import { useMemo, useState } from 'react'
import { PrimaryButton } from './PrimaryButton'
import { FeedbackTextareaField } from './FeedbackTextareaField'
import { getReflectionQuestions } from '../data/reflectionQuestions'
import { useFeedbackFlowState } from '../context/feedbackFlowState'

type ReflectionStepProps = {
    onPrevious: () => void
    onNext: () => void
}

export function ReflectionStep({ onPrevious, onNext }: ReflectionStepProps) {
    const { selectedMood } = useFeedbackFlowState()
    const questions = useMemo(() => getReflectionQuestions(selectedMood), [selectedMood])
    const [answers, setAnswers] = useState<Record<string, string>>({})

    const isValid = questions.length > 0 && questions.every((question) => (answers[question.id] ?? '').trim().length > 0)

    return (
        <article className="step-panel rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="space-y-6 text-left">
                <header className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Reflection</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Bagikan refleksi Anda</h2>
                </header>

                <div className="space-y-5">
                    {questions.map((question) => (
                        <FeedbackTextareaField
                            key={question.id}
                            id={question.id}
                            label={question.label}
                            value={answers[question.id] ?? ''}
                            onChange={(value) =>
                                setAnswers((currentAnswers) => ({
                                    ...currentAnswers,
                                    [question.id]: value,
                                }))
                            }
                        />
                    ))}
                </div>

                <div className="flex justify-between gap-4">
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Kembali
                    </button>

                    <PrimaryButton onClick={onNext} disabled={!isValid} className="min-w-36">
                        Lanjut
                    </PrimaryButton>
                </div>
            </div>
        </article>
    )
}