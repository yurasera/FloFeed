import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { learnerAuthService } from '../services/learnerAuthService'
import type {
    Learner,
    LearnerAuthSnapshot,
    LearnerLoginInput,
    LearnerMembership,
    LearnerRegistrationInput,
    LearnerSession,
} from '../types/learner'

type LearnerAuthContextValue = {
    learner: Learner | null
    session: LearnerSession | null
    memberships: LearnerMembership[]
    isAuthenticated: boolean
    refreshSession: () => void
    registerLearner: (input: LearnerRegistrationInput) => Promise<LearnerAuthSnapshot>
    loginLearner: (input: LearnerLoginInput) => Promise<LearnerAuthSnapshot>
    logoutLearner: () => Promise<void>
    touchSession: () => Promise<LearnerAuthSnapshot | null>
    joinClass: (classId: string) => Promise<LearnerAuthSnapshot | null>
}

const LearnerAuthContext = createContext<LearnerAuthContextValue | null>(null)

type LearnerAuthProviderProps = {
    children: ReactNode
}

export function LearnerAuthProvider({ children }: LearnerAuthProviderProps) {
    const [snapshot, setSnapshot] = useState<LearnerAuthSnapshot | null>(() => learnerAuthService.getCurrentSnapshot())

    const refreshSession = useCallback(() => {
        setSnapshot(learnerAuthService.getCurrentSnapshot())
    }, [])

    const registerLearner = useCallback(async (input: LearnerRegistrationInput) => {
        const nextSnapshot = await learnerAuthService.register(input)
        setSnapshot(nextSnapshot)
        return nextSnapshot
    }, [])

    const loginLearner = useCallback(async (input: LearnerLoginInput) => {
        const nextSnapshot = await learnerAuthService.login(input)
        setSnapshot(nextSnapshot)
        return nextSnapshot
    }, [])

    const logoutLearner = useCallback(async () => {
        await learnerAuthService.logout()
        setSnapshot(null)
    }, [])

    const touchSession = useCallback(async () => {
        const nextSnapshot = await learnerAuthService.touchSession()
        setSnapshot(nextSnapshot)
        return nextSnapshot
    }, [])

    const joinClass = useCallback(async (classId: string) => {
        const nextSnapshot = await learnerAuthService.joinClass(classId)
        setSnapshot(nextSnapshot)
        return nextSnapshot
    }, [])

    const value = useMemo<LearnerAuthContextValue>(
        () => ({
            learner: snapshot?.learner ?? null,
            session: snapshot?.session ?? null,
            memberships: snapshot?.memberships ?? [],
            isAuthenticated: Boolean(snapshot?.session?.isAuthenticated && snapshot?.learner),
            refreshSession,
            registerLearner,
            loginLearner,
            logoutLearner,
            touchSession,
            joinClass,
        }),
        [joinClass, loginLearner, logoutLearner, refreshSession, registerLearner, snapshot, touchSession],
    )

    return <LearnerAuthContext.Provider value={value}>{children}</LearnerAuthContext.Provider>
}

export function useLearnerAuth() {
    const context = useContext(LearnerAuthContext)

    if (!context) {
        throw new Error('useLearnerAuth must be used within LearnerAuthProvider')
    }

    return context
}
