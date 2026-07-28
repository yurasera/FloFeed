import { FeedbackFlowStateProvider } from './context/feedbackFlowState'
import { FeedbackDataProvider } from './context/feedbackDataContext'
import { useFeedbackFlowState } from './context/feedbackFlowState'
import { useFeedbackData } from './context/feedbackDataContext'
import { StepFlow } from './components/StepFlow'
import { feedbackSteps } from './data/feedbackSteps'
import { useFeedbackFlow } from './hooks/useFeedbackFlow'
import { MentorClassManagementPage } from './pages/MentorClassManagementPage'
import { MentorInsightDashboardPage } from './pages/MentorInsightDashboardPage'
import { feedbackService } from './services/feedbackService'

function FeedbackFlowScreen() {
    const { resetFeedbackFlowState, selectedMood, reflectionAnswers, selectedClass } = useFeedbackFlowState()
    const { refreshFeedback } = useFeedbackData()

    const handleComplete = async () => {
        if (!selectedClass) {
            resetFeedbackFlowState()
            return
        }

        await feedbackService.createFeedback({
            classId: selectedClass.id,
            selectedMood,
            reflectionAnswers,
        })

        await refreshFeedback()
        resetFeedbackFlowState()
    }

    const { currentStepIndex, handlePrevious, handleNext, handleComplete: handleFlowComplete } = useFeedbackFlow(
        feedbackSteps.length,
        handleComplete,
    )

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <StepFlow
                steps={feedbackSteps}
                currentStepIndex={currentStepIndex}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onComplete={handleFlowComplete}
            />
        </main>
    )
}

export default function App() {
    return (
        <FeedbackFlowStateProvider>
            <FeedbackDataProvider>
                <div className="min-h-screen bg-slate-50 text-slate-900">
                    <FeedbackFlowScreen />
                    <MentorClassManagementPage />
                    <MentorInsightDashboardPage />
                </div>
            </FeedbackDataProvider>
        </FeedbackFlowStateProvider>
    )
}