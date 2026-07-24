import { createContext, useContext, useState, type ReactNode } from 'react'

type FeedbackFlowStateValue = {
    selectedMood: string
    setSelectedMood: (mood: string) => void
}

const FeedbackFlowStateContext = createContext<FeedbackFlowStateValue | null>(null)

type FeedbackFlowStateProviderProps = {
    children: ReactNode
}

export function FeedbackFlowStateProvider({ children }: FeedbackFlowStateProviderProps) {
    const [selectedMood, setSelectedMood] = useState('')

    return <FeedbackFlowStateContext.Provider value={{ selectedMood, setSelectedMood }}>{children}</FeedbackFlowStateContext.Provider>
}

export function useFeedbackFlowState() {
    const context = useContext(FeedbackFlowStateContext)

    if (!context) {
        throw new Error('useFeedbackFlowState must be used within FeedbackFlowStateProvider')
    }

    return context
}