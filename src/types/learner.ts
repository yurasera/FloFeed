export interface Learner {
    id: string
    name: string
    email: string
    createdAt: string
}

export interface LearnerSession {
    learnerId: string
    isAuthenticated: boolean
    lastActiveAt: string
}

export interface LearnerMembership {
    learnerId: string
    classId: string
    joinedAt: string
    isActive: boolean
}

export interface LearnerAuthSnapshot {
    learner: Learner
    session: LearnerSession
    memberships: LearnerMembership[]
}

export interface LearnerRegistrationInput {
    name: string
    email: string
    password: string
}

export interface LearnerLoginInput {
    email: string
    password: string
}
