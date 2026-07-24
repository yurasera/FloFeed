import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import { useFeedbackFlowState } from '../context/feedbackFlowState'
import { StepSectionHeader } from './StepSectionHeader'
import { StepShell } from './StepShell'
import type { MoodOption } from '../types/feedback'

type MoodStepProps = {
    onNext: () => void
    onPrevious: () => void
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
            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 ease-out focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${checked
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

export function MoodStep({ onNext, onPrevious }: MoodStepProps) {
    const { selectedMood, setSelectedMood } = useFeedbackFlowState()

    return (
        <StepShell>
            <div className="space-y-6 text-left">
                <StepSectionHeader eyebrow="Mood Check" title="Bagaimana perasaan Anda setelah mengikuti kelas hari ini?" />

                <fieldset>
                    <legend className="sr-only">Pilih satu mood</legend>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {moodOptions.map((option) => (
                            <MoodCard
                                key={option.value}
                                option={option}
                                checked={selectedMood === option.value}
                                onSelect={setSelectedMood}
                            />
                        ))}
                    </div>
                </fieldset>

                <div className="flex justify-between gap-4">
                    <SecondaryButton onClick={onPrevious} className="min-w-36">
                        Kembali
                    </SecondaryButton>

                    <PrimaryButton onClick={onNext} disabled={!selectedMood} className="min-w-36">
                        Lanjut
                    </PrimaryButton>
                </div>
            </div>
        </StepShell>
    )
}