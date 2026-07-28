export interface MoodDistribution {
    mood: string
    count: number
    percentage: number
}

export interface ReflectionSummary {
    category: string
    summary: string
    frequency: number
}

export interface FeedbackInsight {
    classId: string
    totalFeedback: number
    moodDistribution: MoodDistribution[]
    commonStruggles: string[]
    reflectionSummary: ReflectionSummary[]
    generatedAt: string
}
