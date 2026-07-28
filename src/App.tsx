import { FeedbackFlowStateProvider } from './context/feedbackFlowState'
import { useFeedbackFlowState } from './context/feedbackFlowState'
import { StepFlow } from './components/StepFlow'
import { feedbackSteps } from './data/feedbackSteps'
import { useFeedbackFlow } from './hooks/useFeedbackFlow'
import { MentorClassManagementPage } from './pages/MentorClassManagementPage'

function FeedbackFlowScreen() {
    const { resetFeedbackFlowState } = useFeedbackFlowState()
    const { currentStepIndex, handlePrevious, handleNext, handleComplete } = useFeedbackFlow(
        feedbackSteps.length,
        resetFeedbackFlowState,
    )

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
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <FeedbackFlowScreen />
                <MentorClassManagementPage />
            </div>
        </FeedbackFlowStateProvider>
    )
}