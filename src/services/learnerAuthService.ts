import { supabase } from '../lib/supabase'
import type {
    Learner,
    LearnerAuthSnapshot,
    LearnerLoginInput,
    LearnerMembership,
    LearnerRegistrationInput,
    LearnerSession,
} from '../types/learner'

type StoredLearnerRecord = Learner & {
    password: string
    memberships: LearnerMembership[]
    lastActiveAt: string
}

type StoredLearnerAuthState = {
    learners: StoredLearnerRecord[]
    currentLearnerId: string | null
}

const STORAGE_KEY = 'flofeed.learner-auth.v1'

const defaultState: StoredLearnerAuthState = {
    learners: [],
    currentLearnerId: null,
}

function now() {
    return new Date().toISOString()
}

function createId(prefix: string) {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}-${crypto.randomUUID()}`
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeEmail(email: string) {
    return email.trim().toLowerCase()
}

function hasStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readState(): StoredLearnerAuthState {
    if (!hasStorage()) {
        return defaultState
    }

    try {
        const rawState = window.localStorage.getItem(STORAGE_KEY)
        if (!rawState) {
            return defaultState
        }

        const parsedState = JSON.parse(rawState) as StoredLearnerAuthState
        return {
            learners: Array.isArray(parsedState.learners) ? parsedState.learners : [],
            currentLearnerId: typeof parsedState.currentLearnerId === 'string' ? parsedState.currentLearnerId : null,
        }
    } catch {
        return defaultState
    }
}

function writeState(state: StoredLearnerAuthState) {
    if (!hasStorage()) {
        return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function toSnapshot(learner: StoredLearnerRecord | undefined): LearnerAuthSnapshot | null {
    if (!learner) {
        return null
    }

    const session: LearnerSession = {
        learnerId: learner.id,
        isAuthenticated: true,
        lastActiveAt: learner.lastActiveAt,
    }

    return {
        learner: {
            id: learner.id,
            name: learner.name,
            email: learner.email,
            createdAt: learner.createdAt,
        },
        session,
        memberships: [...learner.memberships],
    }
}

function updateCurrentLearner(state: StoredLearnerAuthState, learnerId: string) {
    const learnerIndex = state.learners.findIndex((item) => item.id === learnerId)

    if (learnerIndex === -1) {
        return state
    }

    const learners = [...state.learners]
    learners[learnerIndex] = {
        ...learners[learnerIndex],
        lastActiveAt: now(),
    }

    return {
        learners,
        currentLearnerId: learnerId,
    }
}

export interface LearnerAuthService {
    getCurrentSnapshot: () => LearnerAuthSnapshot | null
    register: (input: LearnerRegistrationInput) => Promise<LearnerAuthSnapshot>
    login: (input: LearnerLoginInput) => Promise<LearnerAuthSnapshot>
    logout: () => Promise<void>
    touchSession: () => Promise<LearnerAuthSnapshot | null>
    joinClass: (classId: string) => Promise<LearnerAuthSnapshot | null>
}

class MockLearnerAuthService implements LearnerAuthService {
    getCurrentSnapshot() {
        const state = readState()
        const learner = state.learners.find((item) => item.id === state.currentLearnerId)

        return toSnapshot(learner)
    }

    async register(input: LearnerRegistrationInput) {
        const name = input.name.trim()
        const email = normalizeEmail(input.email)
        const password = input.password.trim()

        if (!name) {
            throw new Error('Nama learner wajib diisi.')
        }

        if (!email) {
            throw new Error('Email learner wajib diisi.')
        }

        if (password.length < 6) {
            throw new Error('Password minimal 6 karakter.')
        }

        const state = readState()
        const hasExistingEmail = state.learners.some((item) => normalizeEmail(item.email) === email)

        if (hasExistingEmail) {
            throw new Error('Email ini sudah terdaftar.')
        }

        const createdLearner: StoredLearnerRecord = {
            id: createId('learner'),
            name,
            email,
            createdAt: now(),
            password,
            memberships: [],
            lastActiveAt: now(),
        }

        const nextState: StoredLearnerAuthState = {
            learners: [createdLearner, ...state.learners],
            currentLearnerId: createdLearner.id,
        }

        writeState(nextState)
        return toSnapshot(createdLearner) as LearnerAuthSnapshot
    }

    async login(input: LearnerLoginInput) {
        const email = normalizeEmail(input.email)
        const password = input.password.trim()

        if (!email) {
            throw new Error('Email learner wajib diisi.')
        }

        if (!password) {
            throw new Error('Password wajib diisi.')
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            throw new Error(error.message)
        }

        const user = data.user

        if (!user) {
            throw new Error('Gagal melakukan autentikasi learner.')
        }

        const profileQuery = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

        const userMetadata = user.user_metadata as { full_name?: string } | null
        const name = profileQuery.data?.full_name ?? userMetadata?.full_name ?? email
        const createdAt = user.created_at ?? now()

        const state = readState()
        const existingLearner = state.learners.find((item) => item.id === user.id)

        const storedLearner: StoredLearnerRecord = existingLearner
            ? {
                ...existingLearner,
                name,
                email,
                createdAt,
                lastActiveAt: now(),
            }
            : {
                id: user.id,
                name,
                email,
                createdAt,
                password: '',
                memberships: [],
                lastActiveAt: now(),
            }

        const learners = existingLearner
            ? state.learners.map((item) => (item.id === user.id ? storedLearner : item))
            : [storedLearner, ...state.learners]

        const nextState: StoredLearnerAuthState = {
            learners,
            currentLearnerId: user.id,
        }

        writeState(nextState)

        return toSnapshot(storedLearner) as LearnerAuthSnapshot
    }

    async logout() {
        await supabase.auth.signOut()

        const state = readState()
        writeState({
            ...state,
            currentLearnerId: null,
        })
    }

    async touchSession() {
        const state = readState()
        const currentLearner = state.learners.find((item) => item.id === state.currentLearnerId)

        if (!currentLearner) {
            return null
        }

        const nextLearners = state.learners.map((item) =>
            item.id === currentLearner.id
                ? {
                    ...item,
                    lastActiveAt: now(),
                }
                : item,
        )

        const nextState = {
            learners: nextLearners,
            currentLearnerId: currentLearner.id,
        }

        writeState(nextState)
        return toSnapshot(nextLearners.find((item) => item.id === currentLearner.id))
    }

    async joinClass(classId: string) {
        const state = readState()
        const currentLearner = state.learners.find((item) => item.id === state.currentLearnerId)

        if (!currentLearner) {
            return null
        }

        const joinedAt = now()
        const nextLearners = state.learners.map((item) => {
            if (item.id !== currentLearner.id) {
                return item
            }

            const membershipIndex = item.memberships.findIndex((membership) => membership.classId === classId)
            const memberships =
                membershipIndex === -1
                    ? [
                        {
                            learnerId: item.id,
                            classId,
                            joinedAt,
                            isActive: true,
                        },
                        ...item.memberships,
                    ]
                    : item.memberships.map((membership, index) =>
                        index === membershipIndex
                            ? {
                                ...membership,
                                joinedAt: membership.joinedAt,
                                isActive: true,
                            }
                            : membership,
                    )

            return {
                ...item,
                memberships,
                lastActiveAt: joinedAt,
            }
        })

        const nextState: StoredLearnerAuthState = {
            learners: nextLearners,
            currentLearnerId: currentLearner.id,
        }

        writeState(nextState)
        return toSnapshot(nextLearners.find((item) => item.id === currentLearner.id))
    }
}

export const learnerAuthService = new MockLearnerAuthService()
