import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import { FeedbackTextareaField } from './FeedbackTextareaField'
import { useFeedbackFlowState } from '../context/feedbackFlowState'
import { StepSectionHeader } from './StepSectionHeader'
import { StepShell } from './StepShell'
import { useReflectionQuestions } from '../hooks/useReflectionQuestions'
import { InlineStateMessage } from './InlineStateMessage'

type ReflectionStepProps = {
    onPrevious: () => void
    onNext: () => void
}

export function ReflectionStep({ onPrevious, onNext }: ReflectionStepProps) {
    const { selectedMood, reflectionAnswers, setReflectionAnswer } = useFeedbackFlowState()
    const questions = useReflectionQuestions(selectedMood)

    const isValid = questions.length > 0 && questions.every((question) => (reflectionAnswers[question.id] ?? '').trim().length > 0)

    return (
        <StepShell>
            <div className="space-y-6 text-left">
                <StepSectionHeader eyebrow="Reflection" title="Bagikan refleksi Anda" />

                {questions.length > 0 ? (
                    <div className="space-y-5">
                        {questions.map((question) => (
                            <FeedbackTextareaField
                                key={question.id}
                                id={question.id}
                                label={question.label}
                                value={reflectionAnswers[question.id] ?? ''}
                                onChange={(value) => setReflectionAnswer(question.id, value)}
                            />
                        ))}
                    </div>
                ) : (
                    <InlineStateMessage
                        title="Belum ada pertanyaan"
                        description="Pilih mood terlebih dahulu agar pertanyaan refleksi dapat ditampilkan."
                    />
                )}

                <div className="flex justify-between gap-4">
                    <SecondaryButton onClick={onPrevious} className="min-w-36">
                        Kembali
                    </SecondaryButton>

                    <PrimaryButton onClick={onNext} disabled={!isValid} className="min-w-36">
                        Lanjut
                    </PrimaryButton>
                </div>
            </div>
        </StepShell>
    )
}