import { Card } from './ui/Card'
import { PrimaryButton } from './ui/PrimaryButton'
import { SecondaryButton } from './ui/SecondaryButton'
import { getReflectionQuestions } from '../data/reflectionQuestions'
import { useFeedbackFlowState } from '../context/feedbackFlowState'
import { StepSectionHeader } from './StepSectionHeader'
import { StepShell } from './StepShell'
import type { MoodSummary } from '../types/feedback'
import { InlineStateMessage } from './ui/InlineStateMessage'

type ReviewStepProps = {
    onPrevious: () => void
    onNext: () => void
}

const moodLabels: Record<string, MoodSummary> = {
    'very-happy': { emoji: '😍', label: 'Sangat Puas' },
    happy: { emoji: '😊', label: 'Puas' },
    neutral: { emoji: '😐', label: 'Biasa Saja' },
    confused: { emoji: '😕', label: 'Bingung' },
    disappointed: { emoji: '😞', label: 'Kecewa' },
}

export function ReviewStep({ onPrevious, onNext }: ReviewStepProps) {
    const { selectedMood, reflectionAnswers, selectedClass } = useFeedbackFlowState()
    const mood = moodLabels[selectedMood]
    const questions = getReflectionQuestions(selectedMood)

    return (
        <StepShell>
            <div className="space-y-6 text-left">
                <StepSectionHeader eyebrow="Review" title="Tinjau feedback Anda" />

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-4">
                        <Card className="space-y-3 p-5 shadow-none">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Class</p>
                            <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-inset ring-blue-100">
                                <p className="font-semibold text-slate-900">{selectedClass?.name ?? 'Belum terhubung'}</p>
                                <p className="mt-1 text-sm text-slate-600">
                                    {selectedClass ? `Kode kelas: ${selectedClass.code}` : 'Masukkan kode kelas untuk mengaitkan feedback.'}
                                </p>
                            </div>
                        </Card>

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
                    </div>

                    <Card className="space-y-3 p-5 shadow-none">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Reflection</p>
                        {questions.length > 0 ? (
                            <div className="space-y-3">
                                {questions.map((question) => (
                                    <div key={question.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                                        <p className="text-sm font-medium text-slate-700">{question.label}</p>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{reflectionAnswers[question.id] || 'Belum diisi'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <InlineStateMessage
                                title="Belum ada jawaban"
                                description="Kembali ke langkah sebelumnya untuk mengisi refleksi Anda."
                            />
                        )}
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
        </StepShell>
    )
}