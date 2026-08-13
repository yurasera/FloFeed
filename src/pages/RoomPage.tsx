import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { SectionTitle } from '../components/SectionTitle'
import { RoomForm } from '../features/room/components/RoomForm'
import { roomService } from '../services/roomService'
import { useLearnerAuth } from '../context/learnerAuthContext'
import type { Room } from '../types/room'

export function RoomPage() {
  const { learner, isAuthenticated } = useLearnerAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const masterId = learner?.id ?? ''

  const loadRooms = async () => {
    if (!masterId) {
      setRooms([])
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await roomService.getRoomsByMaster(masterId)
      setRooms(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat daftar room.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadRooms()
  }, [masterId])

  const handleCreateRoom = async (input: { roomName: string }) => {
    if (!masterId) {
      setError('Anda harus login terlebih dahulu.')
      return
    }

    setError('')

    try {
      const createdRoom = await roomService.createRoom({ roomName: input.roomName, masterId })
      setRooms((current) => [createdRoom, ...current])
      setIsFormOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat room.')
    }
  }

  const handleEditRoom = async (input: { roomName: string }) => {
    if (!selectedRoom || !masterId) {
      return
    }

    setError('')

    try {
      const updatedRoom = await roomService.updateRoom({ id: selectedRoom.id, roomName: input.roomName, masterId })
      setRooms((current) => current.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)))
      setSelectedRoom(null)
      setIsFormOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui room.')
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (!masterId) {
      return
    }

    try {
      await roomService.deleteRoom(roomId, masterId)
      setRooms((current) => current.filter((room) => room.id !== roomId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus room.')
    }
  }

  const actionCard = isFormOpen ? (
    <RoomForm
      initialName={selectedRoom?.roomName ?? ''}
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
      <Card className="space-y-8 bg-white">
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
    </PageContainer>
  )
}
