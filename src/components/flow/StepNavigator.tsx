import { PrimaryButton } from './ui/PrimaryButton'
import { SecondaryButton } from './ui/SecondaryButton'

type StepNavigatorProps = {
    isFirstStep: boolean
    isLastStep: boolean
    onPrevious: () => void
    onNext: () => void
}

export function StepNavigator({ isFirstStep, isLastStep, onPrevious, onNext }: StepNavigatorProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <SecondaryButton onClick={onPrevious} disabled={isFirstStep} className="sm:min-w-32">
                Previous
            </SecondaryButton>
            <PrimaryButton onClick={onNext} disabled={isLastStep} className="sm:min-w-32">
                Next
            </PrimaryButton>
        </div>
    )
}