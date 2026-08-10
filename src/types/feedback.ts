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

export interface Mentor {
    id: string
    name: string
    email: string
}

export interface Class {
    id: number
    code: string
    name: string
    mentorId: string
    createdAt: string
    isActive: boolean
}

export interface ClassCreationForm {
    name: string
    mentorId: string
}

export interface FeedbackSession {
    classId: string
    selectedMood: string
    reflectionAnswers: FeedbackAnswerMap
    createdAt: string
}

export interface FeedbackResponse {
    id: string
    roomId: number
    memberId?: string | null
    selectedMood: string
    reflectionAnswers: FeedbackAnswerMap
    createdAt: string
}

export interface FeedbackSummary {
    roomId: string
    totalResponses: number
    moodDistribution: Record<string, number>
    commonReflection: string
}

export interface FeedbackCompletion {
    learnerId: string
    classId: string
    submittedAt: string
    status: 'completed' | 'pending'
}

export interface ClassRoster {
    classId: string
    learnerCount: number
    completedCount: number
    pendingCount: number
}

export interface CompletionSummary {
    classId: string
    coveragePercent: number
    completedCount: number
    pendingCount: number
}

export interface FeedbackHistoryEntry {
    id: string
    learnerId: string
    classId: string
    className: string
    selectedMood: string
    createdAt: string
    pointsEarned: number
}

export interface LearnerProgressSummary {
    learnerId: string
    totalFeedback: number
    totalPoints: number
    lastSubmittedAt: string | null
    currentStreak: number
}