import { useState } from 'react'
import { FeedbackFlowStateProvider } from './context/feedbackFlowState'
import { useFeedbackFlowState } from './context/feedbackFlowState'
import { StepFlow } from './components/StepFlow'
import { feedbackSteps } from './data/feedbackSteps'

function FeedbackFlowScreen() {
    const { resetFeedbackFlowState } = useFeedbackFlowState()
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    const handlePrevious = () => {
        setCurrentStepIndex((previousStepIndex) => Math.max(0, previousStepIndex - 1))
    }

    const handleNext = () => {
        setCurrentStepIndex((previousStepIndex) => Math.min(feedbackSteps.length - 1, previousStepIndex + 1))
    }

    const handleComplete = () => {
        resetFeedbackFlowState()
        setCurrentStepIndex(0)
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <StepFlow
                steps={feedbackSteps}
                currentStepIndex={currentStepIndex}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onComplete={handleComplete}
            />
        </main>
    )
}

export default function App() {
    return (
        <FeedbackFlowStateProvider>
            <FeedbackFlowScreen />
        </FeedbackFlowStateProvider>
    )
}