import { useState } from 'react'
import { PrimaryButton } from './PrimaryButton'
import { useFeedbackFlowState } from '../context/feedbackFlowState'

type MoodOption = {
    value: string
    label: string
    emoji: string
}

type MoodStepProps = {
    onNext: () => void
}

const moodOptions: MoodOption[] = [
    { value: 'very-happy', label: 'Sangat Puas', emoji: '😍' },
    { value: 'happy', label: 'Puas', emoji: '😊' },
    { value: 'neutral', label: 'Biasa Saja', emoji: '😐' },
    { value: 'confused', label: 'Bingung', emoji: '😕' },
    { value: 'disappointed', label: 'Kecewa', emoji: '😞' },
]

function MoodCard({ option, checked, onSelect }: { option: MoodOption; checked: boolean; onSelect: (value: string) => void }) {
    return (
        <label
            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 ease-out focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                checked
                    ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-600/10'
                    : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50 hover:shadow-sm hover:shadow-slate-900/5'
            }`}
        >
            <input
                type="radio"
                name="mood"
                value={option.value}
                checked={checked}
                onChange={(event) => onSelect(event.target.value)}
                className="sr-only"
            />
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm shadow-slate-900/5 ring-1 ring-inset ring-slate-200">
                {option.emoji}
            </span>
            <span className={`text-sm font-semibold sm:text-base ${checked ? 'text-blue-700' : 'text-slate-700'}`}>{option.label}</span>
        </label>
    )
}

export function MoodStep({ onNext }: MoodStepProps) {
    const [selectedMood, setSelectedMood] = useState('')
    const { setSelectedMood: setSharedSelectedMood } = useFeedbackFlowState()

    return (
        <article className="step-panel rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="space-y-6 text-left">
                <header className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Mood Check</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Bagaimana perasaan Anda setelah mengikuti kelas hari ini?
                    </h2>
                </header>

                <fieldset>
                    <legend className="sr-only">Pilih satu mood</legend>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {moodOptions.map((option) => (
                            <MoodCard
                                key={option.value}
                                option={option}
                                checked={selectedMood === option.value}
                                onSelect={(value) => {
                                    setSelectedMood(value)
                                    setSharedSelectedMood(value)
                                }}
                            />
                        ))}
                    </div>
                </fieldset>

                <div className="flex justify-end">
                    <PrimaryButton onClick={onNext} disabled={!selectedMood} className="min-w-36">
                        Lanjut
                    </PrimaryButton>
                </div>
            </div>
        </article>
    )
}