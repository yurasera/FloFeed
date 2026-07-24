import { Card } from './Card'
import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import { getReflectionQuestions } from '../data/reflectionQuestions'
import { useFeedbackFlowState } from '../context/feedbackFlowState'

type ReviewStepProps = {
    onPrevious: () => void
    onNext: () => void
}

const moodLabels: Record<string, { emoji: string; label: string }> = {
    'very-happy': { emoji: '😍', label: 'Sangat Puas' },
    happy: { emoji: '😊', label: 'Puas' },
    neutral: { emoji: '😐', label: 'Biasa Saja' },
    confused: { emoji: '😕', label: 'Bingung' },
    disappointed: { emoji: '😞', label: 'Kecewa' },
}

export function ReviewStep({ onPrevious, onNext }: ReviewStepProps) {
    const { selectedMood, reflectionAnswers } = useFeedbackFlowState()
    const mood = moodLabels[selectedMood]
    const questions = getReflectionQuestions(selectedMood)

    return (
        <article className="step-panel rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="space-y-6 text-left">
                <header className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Review</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Tinjau feedback Anda</h2>
                </header>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="space-y-3 p-5 shadow-none">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Mood</p>
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl ring-1 ring-inset ring-blue-100">
                                {mood?.emoji ?? '•'}
                            </span>
                            <div>
                                <p className="font-semibold text-slate-900">{mood?.label ?? 'Belum dipilih'}</p>
                                <p className="text-sm text-slate-600">Ringkasan suasana belajar hari ini</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="space-y-3 p-5 shadow-none">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Reflection</p>
                        <div className="space-y-3">
                            {questions.map((question) => (
                                <div key={question.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                                    <p className="text-sm font-medium text-slate-700">{question.label}</p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                        {reflectionAnswers[question.id] || 'Belum diisi'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <SecondaryButton onClick={onPrevious} className="sm:min-w-40">
                        Kembali
                    </SecondaryButton>
                    <PrimaryButton onClick={onNext} className="sm:min-w-40">
                        Submit Feedback
                    </PrimaryButton>
                </div>
            </div>
        </article>
    )
}