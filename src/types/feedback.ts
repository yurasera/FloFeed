import type { ReactNode } from 'react'

export interface FeedbackAnswerMap {
    [questionId: string]: string
}

export interface FeedbackFlowActions {
    onNext: () => void
    onPrevious: () => void
    onComplete: () => void
}

export interface FeedbackStepDefinition {
    id: string
    title: string
    render?: (actions: FeedbackFlowActions) => ReactNode
}

export interface MoodOption {
    value: string
    label: string
    emoji: string
}

export interface ReflectionQuestion {
    id: string
    label: string
}

export interface MoodSummary {
    emoji: string
    label: string
}