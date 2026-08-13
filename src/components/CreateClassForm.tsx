import { useState } from 'react'
import { PrimaryButton } from './ui/PrimaryButton'
import { SecondaryButton } from './ui/SecondaryButton'
import type { ClassCreationForm, Mentor } from '../types/feedback'

type CreateClassFormProps = {
    mentors: Mentor[]
    onSubmit: (form: ClassCreationForm) => void
    onCancel?: () => void
}

export function CreateClassForm({ mentors, onSubmit, onCancel }: CreateClassFormProps) {
    const [name, setName] = useState('')
    const [mentorId, setMentorId] = useState(mentors[0]?.id ?? '')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!name.trim()) {
            return
        }

        onSubmit({ name, mentorId })
        setName('')
        setMentorId(mentors[0]?.id ?? '')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="class-name">
                    Nama Kelas
                </label>
                <input
                    id="class-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Contoh: UI/UX Sprint"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="mentor-select">
                    Mentor
                </label>
                <select
                    id="mentor-select"
                    value={mentorId}
                    onChange={(event) => setMentorId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                    {mentors.map((mentor) => (
                        <option key={mentor.id} value={mentor.id}>
                            {mentor.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {onCancel ? (
                    <SecondaryButton type="button" onClick={onCancel} className="sm:min-w-36">
                        Batal
                    </SecondaryButton>
                ) : null}
                <PrimaryButton type="submit" className="sm:min-w-40">
                    Simpan Kelas
                </PrimaryButton>
            </div>
        </form>
    )
}
