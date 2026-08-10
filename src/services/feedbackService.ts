import { supabase } from '../lib/supabase'
import type { FeedbackResponse, FeedbackSummary } from '../types/feedback'

export interface FeedbackService {
    createFeedback: (payload: Omit<FeedbackResponse, 'id' | 'createdAt'>) => Promise<FeedbackResponse>
    getFeedbackByClass: (roomId: string) => Promise<FeedbackResponse[]>
    getAllFeedback: () => Promise<FeedbackResponse[]>
    getFeedbackSummary: (roomId: string) => Promise<FeedbackSummary>
}

type FeedbackResponseRow = {
    id: string
    room_id: string
    selected_mood: string
    reflection_answers: Record<string, string>
    created_at: string
}

const mapRowToFeedbackResponse = (row: FeedbackResponseRow): FeedbackResponse => ({
    id: row.id,
    roomId: row.room_id,
    selectedMood: row.selected_mood,
    reflectionAnswers: row.reflection_answers,
    createdAt: row.created_at,
})

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

    async getFeedbackByClass(roomId: string): Promise<FeedbackResponse[]> {
        return this.storage.filter((item) => item.roomId === roomId)
    }

    async getAllFeedback(): Promise<FeedbackResponse[]> {
        return [...this.storage]
    }

    async getFeedbackSummary(roomId: string): Promise<FeedbackSummary> {
        const responses = await this.getFeedbackByClass(roomId)
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
            roomId,
            totalResponses: responses.length,
            moodDistribution,
            commonReflection: topReflection ? topReflection[0] : 'No reflections yet',
        }
    }
}

export class SupabaseFeedbackService implements FeedbackService {
    async createFeedback(payload: Omit<FeedbackResponse, 'id' | 'createdAt'>): Promise<FeedbackResponse> {
        const { data, error } = await supabase
            .from<FeedbackResponseRow>('feedback_responses')
            .insert([
                {
                    room_id: payload.roomId,
                    selected_mood: payload.selectedMood,
                    reflection_answers: payload.reflectionAnswers,
                },
            ])
            .select()

        if (error) {
            throw new Error(error.message)
        }

        if (!data || data.length === 0) {
            throw new Error('Gagal menyimpan feedback ke Supabase.')
        }

        return mapRowToFeedbackResponse(data[0])
    }

    async getFeedbackByClass(roomId: string): Promise<FeedbackResponse[]> {
        const { data, error } = await supabase
            .from<FeedbackResponseRow>('feedback_responses')
            .select('id,room_id,selected_mood,reflection_answers,created_at')
            .eq('room_id', roomId)
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(error.message)
        }

        return data?.map(mapRowToFeedbackResponse) ?? []
    }

    async getAllFeedback(): Promise<FeedbackResponse[]> {
        const { data, error } = await supabase
            .from<FeedbackResponseRow>('feedback_responses')
            .select('id,room_id,selected_mood,reflection_answers,created_at')
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(error.message)
        }

        return data?.map(mapRowToFeedbackResponse) ?? []
    }

    async getFeedbackSummary(roomId: string): Promise<FeedbackSummary> {
        const responses = await this.getFeedbackByClass(roomId)
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
            roomId,
            totalResponses: responses.length,
            moodDistribution,
            commonReflection: topReflection ? topReflection[0] : 'No reflections yet',
        }
    }
}

const isSupabaseEnabled = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
export const feedbackService: FeedbackService = isSupabaseEnabled ? new SupabaseFeedbackService() : new MockFeedbackService()
