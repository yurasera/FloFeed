import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { feedbackService } from '../services/feedbackService'
import type { FeedbackResponse } from '../types/feedback'

type FeedbackDataContextValue = {
    feedbackResponses: FeedbackResponse[]
    refreshFeedback: () => Promise<void>
}

const FeedbackDataContext = createContext<FeedbackDataContextValue | null>(null)

type FeedbackDataProviderProps = {
    children: ReactNode
}

export function FeedbackDataProvider({ children }: FeedbackDataProviderProps) {
    const [feedbackResponses, setFeedbackResponses] = useState<FeedbackResponse[]>([])

    const refreshFeedback = useCallback(async () => {
        const allFeedback = await feedbackService.getAllFeedback()
        setFeedbackResponses(allFeedback)
    }, [])

    useEffect(() => {
        void refreshFeedback()
    }, [])

    return (
        <FeedbackDataContext.Provider value={{ feedbackResponses, refreshFeedback }}>
            {children}
        </FeedbackDataContext.Provider>
    )
}

export function useFeedbackData() {
    const context = useContext(FeedbackDataContext)

    if (!context) {
        throw new Error('useFeedbackData must be used within FeedbackDataProvider')
    }

    return context
}
