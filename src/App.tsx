import { useState } from 'react'
import { FeedbackFlowStateProvider } from './context/feedbackFlowState'
import { StepFlow } from './components/StepFlow'
import { feedbackSteps } from './data/feedbackSteps'

export default function App() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    const handlePrevious = () => {
        setCurrentStepIndex((previousStepIndex) => Math.max(0, previousStepIndex - 1))
    }

    const handleNext = () => {
        setCurrentStepIndex((previousStepIndex) => Math.min(feedbackSteps.length - 1, previousStepIndex + 1))
    }

    return (
        <FeedbackFlowStateProvider>
            <main className="min-h-screen bg-slate-50 text-slate-900">
                <StepFlow
                    steps={feedbackSteps}
                    currentStepIndex={currentStepIndex}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />
            </main>
        </FeedbackFlowStateProvider>
    )
}