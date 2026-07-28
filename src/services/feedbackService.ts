import type { FeedbackResponse, FeedbackSummary } from '../types/feedback'

export interface FeedbackService {
    createFeedback: (payload: Omit<FeedbackResponse, 'id' | 'createdAt'>) => Promise<FeedbackResponse>
    getFeedbackByClass: (classId: string) => Promise<FeedbackResponse[]>
    getFeedbackSummary: (classId: string) => Promise<FeedbackSummary>
}

export class MockFeedbackService implements FeedbackService {
    private storage: FeedbackResponse[] = []

    async createFeedback(payload: Omit<FeedbackResponse, 'id' | 'createdAt'>): Promise<FeedbackResponse> {
        const createdFeedback: FeedbackResponse = {
            id: `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            ...payload,
        }

        this.storage.push(createdFeedback)
        return createdFeedback
    }

    async getFeedbackByClass(classId: string): Promise<FeedbackResponse[]> {
        return this.storage.filter((item) => item.classId === classId)
    }

    async getFeedbackSummary(classId: string): Promise<FeedbackSummary> {
        const responses = await this.getFeedbackByClass(classId)
        const moodDistribution = responses.reduce<Record<string, number>>((accumulator, response) => {
            accumulator[response.selectedMood] = (accumulator[response.selectedMood] ?? 0) + 1
            return accumulator
        }, {})

        const commonReflection = responses.reduce<Record<string, number>>((accumulator, response) => {
            Object.entries(response.reflectionAnswers).forEach(([questionId, answer]) => {
                const key = `${questionId}:${answer}`
                accumulator[key] = (accumulator[key] ?? 0) + 1
            })
            return accumulator
        }, {})

        const topReflection = Object.entries(commonReflection).sort((left, right) => right[1] - left[1])[0]

        return {
            classId,
            totalResponses: responses.length,
            moodDistribution,
            commonReflection: topReflection ? topReflection[0] : 'No reflections yet',
        }
    }
}

export const feedbackService = new MockFeedbackService()
