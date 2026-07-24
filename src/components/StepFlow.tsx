import { Card } from './Card'
import { PageContainer } from './PageContainer'
import { ProgressBar } from './ProgressBar'
import { SectionTitle } from './SectionTitle'
import { StepNavigator } from './StepNavigator'
import { StepPanel } from './StepPanel'
import type { FeedbackFlowActions, FeedbackStepDefinition } from '../types/feedback'

type StepFlowProps = {
    steps: FeedbackStepDefinition[]
    currentStepIndex: number
    onPrevious: () => void
    onNext: () => void
    onComplete: () => void
}

export function StepFlow({ steps, currentStepIndex, onPrevious, onNext, onComplete }: StepFlowProps) {
    const activeStep = steps[currentStepIndex]
    const totalSteps = steps.length
    const progressValue = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 100
    const flowActions: FeedbackFlowActions = {
        onNext,
        onPrevious,
        onComplete,
    }

    const stepContent = activeStep.render?.(flowActions)

    return (
        <PageContainer className="py-8 sm:py-10">
            <Card className="space-y-8 bg-white">
                <section className="space-y-4">
                    <SectionTitle
                        eyebrow="FloFeed"
                        title="Suara learner untuk pembelajaran yang lebih baik"
                        description="Kumpulkan feedback anonim, pahami pengalaman belajar, dan bantu mentor meningkatkan kualitas kelas."
                    />
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                        <span>{activeStep.title}</span>
                        <span>
                            {currentStepIndex + 1}/{totalSteps}
                        </span>
                    </div>
                    <ProgressBar value={progressValue} />
                </section>

                <section className="space-y-4">
                    {stepContent ?? <StepPanel stepTitle={activeStep.title} />}
                    {stepContent ? null : (
                        <StepNavigator
                            isFirstStep={currentStepIndex === 0}
                            isLastStep={currentStepIndex === totalSteps - 1}
                            onPrevious={onPrevious}
                            onNext={onNext}
                        />
                    )}
                </section>
            </Card>
        </PageContainer>
    )
}