import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { SectionTitle } from '../components/SectionTitle'
import { RoomForm, type RoomFormInput, type RoomLessonDraft } from '../features/room/components/RoomForm'
import { roomService } from '../services/roomService'
import { feedbackService } from '../services/feedbackService'
import { useLearnerAuth } from '../context/learnerAuthContext'
import { supabase } from '../lib/supabase'
import type { Room } from '../types/room'
import type { FeedbackResponse } from '../types/feedback'

async function syncRoomLessons(roomId: number, lessons: RoomLessonDraft[]) {
  const nextLessons = lessons
    .map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title.trim(),
      display_order: index + 1,
    }))
    .filter((lesson) => lesson.title.length > 0)

  const { data: existingRows, error: fetchError } = await supabase
    .from('lessons')
    .select('id, title, display_order')
    .eq('room_id', roomId)

  if (fetchError) {
    throw new Error('Gagal memuat lesson room yang ada di database.')
  }

  const existingLessons = existingRows ?? []
  const currentIds = new Set(
    nextLessons
      .filter((lesson) => typeof lesson.id === 'number')
      .map((lesson) => lesson.id as number),
  )

  const removedLessons = existingLessons.filter((lesson) => !currentIds.has(lesson.id))
  if (removedLessons.length > 0) {
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .in(
        'id',
        removedLessons.map((lesson) => lesson.id),
      )

    if (deleteError) {
      throw new Error('Gagal menghapus lesson room yang dihapus.')
    }
  }

  const lessonsToUpdate = nextLessons.filter((lesson) => typeof lesson.id === 'number')
  for (const lesson of lessonsToUpdate) {
    const { error: updateError } = await supabase
      .from('lessons')
      .update({
        title: lesson.title,
        display_order: lesson.display_order,
      })
      .eq('id', lesson.id)
      .eq('room_id', roomId)

    if (updateError) {
      throw new Error('Gagal memperbarui lesson room yang sudah ada.')
    }
  }

  const lessonsToInsert = nextLessons.filter((lesson) => lesson.id == null)
  if (lessonsToInsert.length > 0) {
    const { error: insertError } = await supabase.from('lessons').insert(
      lessonsToInsert.map((lesson) => ({
        room_id: roomId,
        title: lesson.title,
        display_order: lesson.display_order,
      })),
    )

    if (insertError) {
      throw new Error('Gagal menambahkan lesson baru room.')
    }
  }
}

export function RoomPage() {
  const { learner, isAuthenticated } = useLearnerAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFeedbackRoom, setSelectedFeedbackRoom] = useState<Room | null>(null)
  const [feedbackList, setFeedbackList] = useState<FeedbackResponse[]>([])
  const [feedbackCounts, setFeedbackCounts] = useState<Record<number, number>>({})
  const [roomLessons, setRoomLessons] = useState<Record<number, RoomLessonDraft[]>>({})

  const masterId = learner?.id ?? ''

  const loadRooms = async () => {
    if (!masterId) {
      setRooms([])
      setRoomLessons({})
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await roomService.getRoomsByMaster(masterId)
      setRooms(data)

      const roomIds = data.map((room) => room.id)
      if (roomIds.length === 0) {
        setRoomLessons({})
        return
      }

      const { data: lessonRows, error: lessonError } = await supabase
        .from('lessons')
        .select('id, room_id, title, display_order')
        .in('room_id', roomIds)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (lessonError) {
        throw new Error('Gagal memuat lesson room dari database.')
      }

      const nextRoomLessons: Record<number, RoomLessonDraft[]> = {}
      for (const room of data) {
        nextRoomLessons[room.id] = []
      }

      for (const row of lessonRows ?? []) {
        if (typeof row?.room_id !== 'number' || typeof row?.title !== 'string') {
          continue
        }

        const title = row.title.trim()
        if (!title) {
          continue
        }

        nextRoomLessons[row.room_id] = [
          ...(nextRoomLessons[row.room_id] ?? []),
          {
            id: typeof row.id === 'number' ? row.id : undefined,
            title,
            display_order: typeof row.display_order === 'number' ? row.display_order : undefined,
          },
        ]
      }

      setRoomLessons(nextRoomLessons)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat daftar room.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadFeedbackCounts = async () => {
    try {
      const counts: Record<number, number> = {}
      for (const room of rooms) {
        const feedbacks = await feedbackService.getFeedbackByClass(room.id)
        counts[room.id] = feedbacks.length
      }
      setFeedbackCounts(counts)
    } catch (err) {
      console.error('Gagal memuat jumlah feedback:', err)
    }
  }

  useEffect(() => {
    void loadRooms()
  }, [masterId])

  useEffect(() => {
    if (rooms.length > 0) {
      void loadFeedbackCounts()
    }
  }, [rooms])

  const handleViewFeedback = async (room: Room) => {
    try {
      const feedbacks = await feedbackService.getFeedbackByClass(room.id)
      setFeedbackList(feedbacks)
      setSelectedFeedbackRoom(room)
    } catch (err) {
      console.error('Gagal memuat feedback:', err)
    }
  }

  const calculateFeedbackInsights = (feedbacks: FeedbackResponse[]) => {
    if (feedbacks.length === 0) {
      return {
        totalResponses: 0,
        moodDistribution: {} as Record<string, number>,
        commonThemes: [] as string[],
      }
    }

    const moodDistribution: Record<string, number> = {}
    const allAnswers: string[] = []

    feedbacks.forEach((feedback) => {
      moodDistribution[feedback.selectedMood] = (moodDistribution[feedback.selectedMood] || 0) + 1
      Object.values(feedback.reflectionAnswers).forEach((answer) => {
        if (answer && typeof answer === 'string') {
          allAnswers.push(answer.toLowerCase())
        }
      })
    })

    const commonThemes = allAnswers
      .filter((answer) => answer.length > 0)
      .slice(0, 5)

    return {
      totalResponses: feedbacks.length,
      moodDistribution,
      commonThemes,
    }
  }

  const handleCreateRoom = async (input: RoomFormInput) => {
    if (!masterId) {
      setError('Anda harus login terlebih dahulu.')
      return
    }

    setError('')

    try {
      const createdRoom = await roomService.createRoom({ roomName: input.roomName, masterId })
      await syncRoomLessons(createdRoom.id, input.lessons)
      setRooms((current) => [createdRoom, ...current])
      setRoomLessons((current) => ({ ...current, [createdRoom.id]: input.lessons }))
      setIsFormOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat room.')
    }
  }

  const handleEditRoom = async (input: RoomFormInput) => {
    if (!selectedRoom || !masterId) {
      return
    }

    setError('')

    try {
      const updatedRoom = await roomService.updateRoom({ id: String(selectedRoom.id), roomName: input.roomName, masterId })
      await syncRoomLessons(updatedRoom.id, input.lessons)
      setRooms((current) => current.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)))
      setRoomLessons((current) => ({ ...current, [updatedRoom.id]: input.lessons }))
      setSelectedRoom(null)
      setIsFormOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui room.')
    }
  }

  const handleDeleteRoom = async (roomId: number) => {
    if (!masterId) {
      return
    }

    try {
      await roomService.deleteRoom(String(roomId), masterId)
      setRooms((current) => current.filter((room) => room.id !== roomId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus room.')
    }
  }

  const actionCard = isFormOpen ? (
    <RoomForm
      key={selectedRoom?.id ?? 'new'}
      initialName={selectedRoom?.roomName ?? ''}
      initialLessons={selectedRoom ? roomLessons[selectedRoom.id] ?? [] : []}
      selectedRoomId={selectedRoom?.id ?? null}
      onSubmit={selectedRoom ? handleEditRoom : handleCreateRoom}
      onCancel={() => {
        setSelectedRoom(null)
        setIsFormOpen(false)
      }}
      submitLabel={selectedRoom ? 'Perbarui Room' : 'Buat Room'}
    />
  ) : null

  const roomCountText = useMemo(() => {
    if (rooms.length === 0) {
      return 'Belum ada room.'
    }
    return `${rooms.length} room`
  }, [rooms.length])

  return (
    <PageContainer className="py-10">
      <Card className="space-y-8 bg-white max-w-4xl mx-auto p-6 sm:p-8 lg:p-10">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrow="Room Management"
            title="Kelola Room Anda"
            description="Buat, edit, dan hapus room dengan master ID learner yang sudah login."
          />
          <button
            type="button"
            onClick={() => {
              setSelectedRoom(null)
              setIsFormOpen((current) => !current)
            }}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-500"
          >
            {isFormOpen ? 'Tutup form' : 'Buat room baru'}
          </button>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {actionCard}

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{roomCountText}</h3>
            {isLoading ? <p className="text-sm text-slate-500">Memuat...</p> : null}
          </div>

          {rooms.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {rooms.map((room) => (
                <Card key={room.id} className="space-y-4 p-5 shadow-none">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Room</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">{room.roomName}</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {new Date(room.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>Room code: <span className="font-semibold text-slate-900">{room.roomCode}</span></p>
                    <p>Master ID: {room.masterId}</p>
                    <p>Last updated: {new Date(room.updatedAt).toLocaleDateString('id-ID')}</p>
                    <p className="pt-1 font-semibold text-blue-600">
                      <button
                        type="button"
                        onClick={() => void handleViewFeedback(room)}
                        className="cursor-pointer hover:underline"
                      >
                        {feedbackCounts[room.id] ?? 0} feedback terisi
                      </button>
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    <h4 className="font-semibold text-slate-900">Lessons</h4>
                    <div className="space-y-2">
                      {(roomLessons[room.id] ?? []).map((lesson, index) => (
                        <div key={`${room.id}-${lesson.id ?? 'new'}-${index}`} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <span className="text-sm font-semibold text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                          <span className="font-semibold text-slate-900">{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoom(room)
                        setIsFormOpen(true)
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteRoom(room.id)}
                      className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                    >
                      Hapus
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-slate-600 shadow-none">
              {isAuthenticated ? 'Belum ada room. Buat room baru untuk memulainya.' : 'Login untuk melihat dan mengelola room Anda.'}
            </Card>
          )}
        </section>
      </Card>

      {selectedFeedbackRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] space-y-6 overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{selectedFeedbackRoom.roomName}</h2>
                <p className="mt-1 text-sm text-slate-600">Feedback Insights & Details</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFeedbackRoom(null)
                  setFeedbackList([])
                }}
                className="text-2xl text-slate-500 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {feedbackList.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                Belum ada feedback untuk room ini.
              </div>
            ) : (
              <>
                {(() => {
                  const insights = calculateFeedbackInsights(feedbackList)
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-blue-50">
                          <p className="text-sm text-slate-600">Total Feedback</p>
                          <p className="text-3xl font-bold text-blue-600">{insights.totalResponses}</p>
                        </Card>
                        <Card className="p-4 bg-green-50">
                          <p className="text-sm text-slate-600">Response Rate</p>
                          <p className="text-3xl font-bold text-green-600">100%</p>
                        </Card>
                      </div>

                      {Object.keys(insights.moodDistribution).length > 0 && (
                        <div className="space-y-3">
                          <h3 className="font-semibold text-slate-900">Mood Distribution</h3>
                          {Object.entries(insights.moodDistribution).map(([mood, count]) => (
                            <div key={mood} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">{mood}</span>
                                <span className="font-semibold text-slate-900">{count} ({Math.round((count / insights.totalResponses) * 100)}%)</span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 transition-all"
                                  style={{ width: `${(count / insights.totalResponses) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-3">
                        <h3 className="font-semibold text-slate-900">Feedback Responses</h3>
                        <div className="space-y-3">
                          {feedbackList.map((feedback) => (
                            <Card key={feedback.id} className="p-4 bg-slate-50">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    Mood: <span className="text-blue-600">{feedback.selectedMood}</span>
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {new Date(feedback.createdAt).toLocaleString('id-ID')}
                                  </p>
                                </div>
                              </div>
                              {Object.entries(feedback.reflectionAnswers).length > 0 && (
                                <div className="space-y-2 text-sm">
                                  {Object.entries(feedback.reflectionAnswers).map(([questionId, answer]) => (
                                    <div key={questionId}>
                                      <p className="text-slate-600">{answer}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </>
            )}
          </Card>
        </div>
      )}
    </PageContainer>
  )
}
