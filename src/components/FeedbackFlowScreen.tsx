import { useEffect } from 'react'
import { StepFlow } from './StepFlow'
import { feedbackSteps } from '../data/feedbackSteps'
import { useFeedbackFlow } from '../hooks/useFeedbackFlow'
import { useFeedbackFlowState } from '../context/feedbackFlowState'
import { useFeedbackData } from '../context/feedbackDataContext'
import { feedbackService } from '../services/feedbackService'
import { useLearnerAuth } from '../context/learnerAuthContext'
import { completionService } from '../services/completionService'
import { Card } from './Card'
import { Link } from 'react-router-dom'

function LearnerSessionBanner() {
    const { learner, session, memberships, logoutLearner, touchSession } = useLearnerAuth()

    // useEffect(() => {
    //     if (learner) {
    //         void touchSession()
    //     }
    // }, [learner, touchSession])

    if (!learner || !session) {
        return null
    }

    const lastActiveDate = new Date(session.lastActiveAt)

    return (
        <Card className="flex flex-col gap-4 border-blue-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Learner Session</p>
                <h2 className="text-lg font-semibold text-slate-900">
                    {learner.name} <span className="text-slate-500">· {learner.email}</span>
                </h2>
                <p className="text-sm text-slate-600">
                    Session tersimpan, last active {lastActiveDate.toLocaleString('id-ID')}, {memberships.length} class membership aktif/tersimpan.
                </p>
            </div>
        </Card>
    )
}

export function FeedbackFlowScreen() {
    const { resetFeedbackFlowState, selectedMood, reflectionAnswers, selectedClass } = useFeedbackFlowState()
    const { refreshFeedback } = useFeedbackData()
    const { learner } = useLearnerAuth()

    const handleComplete = async () => {
        if (!selectedClass) {
            resetFeedbackFlowState()
            return
        }

        await feedbackService.createFeedback({
            roomId: selectedClass.id,
            memberId: learner?.id ?? null,
            selectedMood,
            reflectionAnswers,
        })

        // Record completion for authenticated learner
        if (learner && learner.id) {
            await completionService.recordCompletion(learner.id, selectedClass.id)
        }

        await refreshFeedback()
        resetFeedbackFlowState()
    }

    const { currentStepIndex, handlePrevious, handleNext, handleComplete: handleFlowComplete } = useFeedbackFlow(
        feedbackSteps.length,
        handleComplete,
    )

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <main className="space-y-6">
                <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
                    <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
                        <LearnerSessionBanner />
                    </div>
                </div>

                <StepFlow
                    steps={feedbackSteps}
                    currentStepIndex={currentStepIndex}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onComplete={handleFlowComplete}
                />
            </main>
        </div>
    )
}
