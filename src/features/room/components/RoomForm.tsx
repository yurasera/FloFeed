import { useState } from 'react'
import { PrimaryButton } from '../../../components/ui/PrimaryButton'
import { SecondaryButton } from '../../../components/ui/SecondaryButton'

export type RoomFormInput = {
  roomName: string
  lessons: string[]
}

type RoomFormProps = {
  initialName?: string
  initialLessons?: string[]
  onSubmit: (input: RoomFormInput) => void
  onCancel?: () => void
  submitLabel?: string
}

export function RoomForm({ initialName = '', initialLessons = [''], onSubmit, onCancel, submitLabel = 'Simpan' }: RoomFormProps) {
  const [roomName, setRoomName] = useState(initialName)
  const [lessonTitles, setLessonTitles] = useState(initialLessons.length > 0 ? initialLessons : [''])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!roomName.trim()) {
      return
    }

    onSubmit({
      roomName: roomName.trim(),
      lessons: lessonTitles.map((title) => title.trim()).filter(Boolean),
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
        {lessonTitles.map((title, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-8 text-sm font-semibold text-slate-500">{String(index + 1).padStart(2, '0')}</span>
            <input
              value={title}
              onChange={(event) => {
                setLessonTitles((current) => current.map((lesson, lessonIndex) => (lessonIndex === index ? event.target.value : lesson)))
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
          onClick={() => setLessonTitles((current) => [...current, ''])}
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
