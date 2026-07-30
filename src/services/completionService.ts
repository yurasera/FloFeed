import type { FeedbackCompletion, ClassRoster, CompletionSummary } from '../types/feedback'

export interface CompletionService {
  recordCompletion: (learnerId: string, classId: string) => Promise<FeedbackCompletion>
  getLearnerCompletion: (learnerId: string, classId: string) => Promise<FeedbackCompletion | null>
  getLearnerCompletions: (learnerId: string) => Promise<FeedbackCompletion[]>
  getClassRoster: (classId: string) => Promise<ClassRoster>
  getCompletionSummary: (classId: string) => Promise<CompletionSummary>
}

export class MockCompletionService implements CompletionService {
  private storage: FeedbackCompletion[] = []

  async recordCompletion(learnerId: string, classId: string) {
    const existing = this.storage.find(
      (c) => c.learnerId === learnerId && c.classId === classId,
    )
    if (existing) {
      // update timestamp and status
      existing.submittedAt = new Date().toISOString()
      existing.status = 'completed'
      return existing
    }
    const record: FeedbackCompletion = {
      learnerId,
      classId,
      submittedAt: new Date().toISOString(),
      status: 'completed',
    }
    this.storage.push(record)
    return record
  }

  async getLearnerCompletion(learnerId: string, classId: string) {
    return (
      this.storage.find(
        (c) => c.learnerId === learnerId && c.classId === classId,
      ) ?? null
    )
  }

  async getLearnerCompletions(learnerId: string) {
    return this.storage.filter((c) => c.learnerId === learnerId)
  }

  async getClassRoster(classId: string) {
    const completions = this.storage.filter((c) => c.classId === classId)
    const completedCount = completions.filter((c) => c.status === 'completed')
      .length
    // In this mock we don't have total learner count; assume pending is unknown (0)
    const pendingCount = 0
    const learnerCount = completedCount + pendingCount
    return {
      classId,
      learnerCount,
      completedCount,
      pendingCount,
    }
  }

  async getCompletionSummary(classId: string) {
    const roster = await this.getClassRoster(classId)
    const coveragePercent =
      roster.learnerCount > 0
        ? Math.round((roster.completedCount / roster.learnerCount) * 100)
        : 0
    return {
      classId,
      coveragePercent,
      completedCount: roster.completedCount,
      pendingCount: roster.pendingCount,
    }
  }
}

export const completionService = new MockCompletionService()
