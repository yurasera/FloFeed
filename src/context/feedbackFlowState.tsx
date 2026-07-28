import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Class, FeedbackAnswerMap } from '../types/feedback'

type FeedbackFlowStateValue = {
    selectedMood: string
    setSelectedMood: (mood: string) => void
    reflectionAnswers: FeedbackAnswerMap
    setReflectionAnswer: (questionId: string, value: string) => void
    selectedClass: Class | null
    setSelectedClass: (selectedClass: Class | null) => void
    resetFeedbackFlowState: () => void
}

const FeedbackFlowStateContext = createContext<FeedbackFlowStateValue | null>(null)

type FeedbackFlowStateProviderProps = {
    children: ReactNode
}

export function FeedbackFlowStateProvider({ children }: FeedbackFlowStateProviderProps) {
    const [selectedMood, setSelectedMood] = useState('')
    const [reflectionAnswers, setReflectionAnswers] = useState<FeedbackAnswerMap>({})
    const [selectedClass, setSelectedClass] = useState<Class | null>(null)

    const setReflectionAnswer = (questionId: string, value: string) => {
        setReflectionAnswers((currentAnswers) => ({
            ...currentAnswers,
            [questionId]: value,
        }))
    }

    const resetFeedbackFlowState = () => {
        setSelectedMood('')
        setReflectionAnswers({})
        setSelectedClass(null)
    }

    return (
        <FeedbackFlowStateContext.Provider
            value={{
                selectedMood,
                setSelectedMood,
                reflectionAnswers,
                setReflectionAnswer,
                selectedClass,
                setSelectedClass,
                resetFeedbackFlowState,
            }}
        >
            {children}
        </FeedbackFlowStateContext.Provider>
    )
}

export function useFeedbackFlowState() {
    const context = useContext(FeedbackFlowStateContext)

    if (!context) {
        throw new Error('useFeedbackFlowState must be used within FeedbackFlowStateProvider')
    }

    return context
}