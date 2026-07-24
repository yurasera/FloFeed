import { useCallback, useState } from 'react'

type UseFeedbackFlowResult = {
    currentStepIndex: number
    handlePrevious: () => void
    handleNext: () => void
    handleComplete: () => void
}

export function useFeedbackFlow(stepCount: number, onComplete: () => void): UseFeedbackFlowResult {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    const handlePrevious = useCallback(() => {
        setCurrentStepIndex((previousStepIndex) => Math.max(0, previousStepIndex - 1))
    }, [])

    const handleNext = useCallback(() => {
        setCurrentStepIndex((previousStepIndex) => Math.min(stepCount - 1, previousStepIndex + 1))
    }, [stepCount])

    const handleComplete = useCallback(() => {
        onComplete()
        setCurrentStepIndex(0)
    }, [onComplete])

    return {
        currentStepIndex,
        handlePrevious,
        handleNext,
        handleComplete,
    }
}