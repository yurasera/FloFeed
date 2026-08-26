import { useEffect, useState } from 'react'
import { PrimaryButton } from '../../../components/ui/PrimaryButton'
import { SecondaryButton } from '../../../components/ui/SecondaryButton'
import { supabase } from '../../../lib/supabase'

export type RoomLessonDraft = {
  id?: number | null
  title: string
  display_order?: number
}

export type RoomFormInput = {
  roomName: string
  lessons: RoomLessonDraft[]
}

type RoomFormProps = {
  initialName?: string
  initialLessons?: RoomLessonDraft[]
  selectedRoomId?: number | null
  onSubmit: (input: RoomFormInput) => void
  onCancel?: () => void
  submitLabel?: string
}

async function fetchLessonTitles(selectedRoomId: number): Promise<RoomLessonDraft[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, display_order')
    .eq('room_id', selectedRoomId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error('Gagal memuat lesson dari database.')
  }

  return (data ?? [])
    .map((row) => ({
      id: typeof row?.id === 'number' ? row.id : undefined,
      title: typeof row?.title === 'string' ? row.title.trim() : '',
      display_order: typeof row?.display_order === 'number' ? row.display_order : undefined,
    }))
    .filter((lesson) => lesson.title.length > 0)
}

export function RoomForm({ initialName = '', initialLessons = [], selectedRoomId = null, onSubmit, onCancel, submitLabel = 'Simpan' }: RoomFormProps) {
  const [roomName, setRoomName] = useState(initialName)
  const [lessonTitles, setLessonTitles] = useState<RoomLessonDraft[]>(initialLessons.length > 0 ? initialLessons : [{ title: '' }])
  const [isLoadingLessons, setIsLoadingLessons] = useState(Boolean(selectedRoomId) || initialLessons.length === 0)
  const [lessonError, setLessonError] = useState('')

  useEffect(() => {
    if (initialLessons.length > 0) {
      setLessonTitles(initialLessons)
      setIsLoadingLessons(false)
      setLessonError('')
      return
    }

    if (!selectedRoomId) {
      setLessonTitles([{ title: '' }])
      setLessonError('')
      setIsLoadingLessons(false)
      return
    }

    let isMounted = true

    const loadLessonTitles = async () => {
      setIsLoadingLessons(true)
      setLessonError('')
      setLessonTitles([{ title: '' }])

      try {
        const titles = await fetchLessonTitles(selectedRoomId)

        if (!isMounted) {
          return
        }

        setLessonTitles(titles.length > 0 ? titles : [{ title: '' }])
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message = error instanceof Error ? error.message : 'Gagal memuat daftar lesson.'
        setLessonError(message)
        setLessonTitles([{ title: '' }])
      } finally {
        if (isMounted) {
          setIsLoadingLessons(false)
        }
      }
    }

    void loadLessonTitles()

    return () => {
      isMounted = false
    }
  }, [initialLessons, selectedRoomId])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!roomName.trim()) {
      return
    }

    onSubmit({
      roomName: roomName.trim(),
      lessons: lessonTitles
        .map((lesson, index) => ({
          id: lesson.id,
          title: lesson.title.trim(),
          display_order: index + 1,
        }))
        .filter((lesson) => lesson.title.length > 0),
    })
    setRoomName('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="room-name">
          Room name
        </label>
        <input
          id="room-name"
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
          placeholder="Contoh: Sprint Review"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Lessons</p>

        {isLoadingLessons ? <p className="text-sm text-slate-500">Memuat lesson…</p> : null}

        {!isLoadingLessons && lessonError ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Gagal memuat lesson. Silakan coba lagi nanti.
          </p>
        ) : null}

        {!isLoadingLessons && !lessonError && lessonTitles.length === 1 && lessonTitles[0]?.title === '' ? (
          <p className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
            Belum ada lesson yang tersedia.
          </p>
        ) : null}

        {lessonTitles.map((lesson, index) => (
          <div key={lesson.id ?? `new-${index}`} className="flex items-center gap-2">
            <span className="w-8 text-sm font-semibold text-slate-500">{String(index + 1).padStart(2, '0')}</span>
            <input
              value={lesson.title}
              onChange={(event) => {
                setLessonTitles((current) => current.map((item, lessonIndex) => (lessonIndex === index ? { ...item, title: event.target.value } : item)))
              }}
              placeholder="Judul lesson"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {lessonTitles.length > 1 ? (
              <button
                type="button"
                onClick={() => setLessonTitles((current) => current.filter((_, lessonIndex) => lessonIndex !== index))}
                className="rounded-full px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                Hapus
              </button>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLessonTitles((current) => [...current, { title: '' }])}
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-500"
        >
          + Tambah lesson
        </button>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <SecondaryButton type="button" onClick={onCancel} className="sm:min-w-36">
            Batal
          </SecondaryButton>
        ) : null}
        <PrimaryButton type="submit" className="sm:min-w-40">
          {submitLabel}
        </PrimaryButton>
      </div>
    </form>
  )
}
