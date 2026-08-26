import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { useFeedbackFlowState } from '../context/feedbackFlowState'
import { useFeedbackData } from '../context/feedbackDataContext'
import { feedbackService } from '../services/feedbackService'
import { useLearnerAuth } from '../context/learnerAuthContext'
import { completionService } from '../services/completionService'
import { supabase } from '../lib/supabase'

type OverallUnderstanding = 'very_clear' | 'mostly_clear' | 'confused' | 'not_understood'

type Lesson = {
    id: number
    title: string
}

type PromptKind = 'overall' | 'lesson' | 'secondary' | 'specific'

const overallOptions: Array<{ value: OverallUnderstanding; label: string }> = [
    { value: 'very_clear', label: 'Sangat paham' },
    { value: 'mostly_clear', label: 'Cukup paham' },
    { value: 'confused', label: 'Masih ada yang membingungkan' },
    { value: 'not_understood', label: 'Belum paham' },
]

const secondaryOptionsByOverall: Record<OverallUnderstanding, string[]> = {
    very_clear: ['Penjelasan mentor', 'Contoh kode', 'Practice', 'Sudah pernah belajar sebelumnya', 'Lainnya'],
    mostly_clear: ['Perlu lebih banyak contoh', 'Perlu lebih banyak latihan', 'Masih bingung konsepnya', 'Kadang lupa syntax', 'Masih sering error'],
    confused: ['Tidak memahami konsep', 'Bingung syntax', 'Bingung kapan digunakan', 'Sering mendapatkan error', 'Sulit menerapkan sendiri'],
    not_understood: ['Tidak memahami konsep dasar', 'Tidak mengikuti penjelasan', 'Sulit mengikuti contoh kode', 'Bingung saat practice', 'Tidak tahu harus mulai dari mana'],
}

const stepLabels: Record<OverallUnderstanding, string> = {
    very_clear: 'Bagian mana yang paling kamu kuasai?',
    mostly_clear: 'Bagian mana yang masih perlu kamu latih?',
    confused: 'Bagian mana yang membingungkan?',
    not_understood: 'Bagian mana yang paling sulit dipahami?',
}

export function RoomFeedbackPage() {
    const navigate = useNavigate()
    const { selectedClass } = useFeedbackFlowState()
    const { refreshFeedback } = useFeedbackData()
    const { learner } = useLearnerAuth()
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [isLoadingLessons, setIsLoadingLessons] = useState(false)
    const [lessonError, setLessonError] = useState('')
    const [overallUnderstanding, setOverallUnderstanding] = useState<OverallUnderstanding | ''>('')
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null)
    const [selectedStrengthLessonIds, setSelectedStrengthLessonIds] = useState<string[]>([])
    const [secondaryChoice, setSecondaryChoice] = useState('')
    const [specificFeedback, setSpecificFeedback] = useState('')
    const [stepIndex, setStepIndex] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [animationState, setAnimationState] = useState<'idle' | 'loading' | 'done'>('idle')
    const [submissionError, setSubmissionError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isAnimating = submitted && animationState === 'loading'

    const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? null
    const selectedStrengthLessons = lessons.filter((lesson) => selectedStrengthLessonIds.includes(String(lesson.id)))
    const branchOptions = overallUnderstanding ? secondaryOptionsByOverall[overallUnderstanding] : []

    useEffect(() => {
        if (!selectedClass) {
            navigate('/room/join', { replace: true })
            return
        }

        let isMounted = true

        const loadLessons = async () => {
            setIsLoadingLessons(true)
            setLessonError('')

            try {
                const { data, error } = await supabase
                    .from('lessons')
                    .select('id, title, display_order')
                    .eq('room_id', selectedClass.id)
                    .order('display_order', { ascending: true })
                    .order('created_at', { ascending: true })

                if (!isMounted) {
                    return
                }

                if (error) {
                    throw new Error('Gagal memuat lesson untuk room ini.')
                }

                const mappedLessons = (data ?? [])
                    .filter((row): row is { id: number; title: string; display_order: number } => typeof row?.id === 'number' && typeof row?.title === 'string')
                    .map((row) => ({
                        id: row.id,
                        title: row.title.trim(),
                    }))
                    .filter((row) => row.title.length > 0)

                setLessons(mappedLessons)
            } catch (error) {
                if (!isMounted) {
                    return
                }

                setLessons([])
                setLessonError(error instanceof Error ? error.message : 'Gagal memuat lesson untuk room ini.')
            } finally {
                if (isMounted) {
                    setIsLoadingLessons(false)
                }
            }
        }

        void loadLessons()

        return () => {
            isMounted = false
        }
    }, [selectedClass, navigate])

    useEffect(() => {
        if (!submitted || animationState !== 'loading') {
            return
        }

        const timer = window.setTimeout(() => {
            setAnimationState('done')
        }, 5400)

        return () => window.clearTimeout(timer)
    }, [submitted, animationState])

    const resetDependentState = () => {
        setSelectedLessonId(null)
        setSelectedStrengthLessonIds([])
        setSecondaryChoice('')
        setSpecificFeedback('')
    }

    const handleOverallChoice = (value: OverallUnderstanding) => {
        setOverallUnderstanding(value)
        resetDependentState()
        setStepIndex(1)
    }

    const handleLessonChoice = (lessonId: number) => {
        setSelectedLessonId(lessonId)
        setSecondaryChoice('')
        setSpecificFeedback('')
        setStepIndex(2)
    }

    const toggleStrengthLesson = (lessonId: number) => {
        const lessonIdString = String(lessonId)
        setSelectedStrengthLessonIds((current) => {
            if (current.includes(lessonIdString)) {
                return current.filter((item) => item !== lessonIdString)
            }

            return [...current, lessonIdString]
        })
        setSecondaryChoice('')
        setSpecificFeedback('')
    }

    const handleSecondaryChoice = (value: string) => {
        setSecondaryChoice(value)

        if (value === 'Lainnya' || overallUnderstanding === 'confused' || overallUnderstanding === 'not_understood') {
            setStepIndex(3)
            return
        }

        void handleSubmitFeedback(value)
    }

    const handleBack = () => {
        setStepIndex((current) => Math.max(0, current - 1))
    }

    const getCurrentPrompt = (): { kind: PromptKind; title: string; placeholder?: string; options?: string[] } => {
        if (stepIndex === 0) {
            return {
                kind: 'overall',
                title: 'Bagaimana pemahaman kamu tentang materi hari ini?',
                options: overallOptions.map((option) => option.label),
            }
        }

        if (stepIndex === 1) {
            return {
                kind: 'lesson',
                title: overallUnderstanding ? stepLabels[overallUnderstanding] : 'Pilih bagian yang ingin dibahas',
                options: overallUnderstanding === 'not_understood' ? [...lessons.map((lesson) => lesson.title), 'Hampir semuanya'] : [...lessons.map((lesson) => lesson.title)],
            }
        }

        if (stepIndex === 2) {
            return {
                kind: 'secondary',
                title: overallUnderstanding === 'very_clear'
                    ? 'Apa yang membuat bagian tersebut mudah dipahami?'
                    : overallUnderstanding === 'mostly_clear'
                        ? 'Apa yang masih kurang?'
                        : overallUnderstanding === 'confused'
                            ? 'Apa yang membuatnya membingungkan?'
                            : 'Apa yang paling menghambat kamu?',
                options: branchOptions,
            }
        }

        return {
            kind: 'specific',
            title:
                overallUnderstanding === 'confused'
                    ? 'Bagian mana yang paling spesifik?'
                    : 'Coba ceritakan bagian yang paling sulit.',
            placeholder:
                overallUnderstanding === 'confused'
                    ? 'Contoh: Saya bingung kapan menggunakan nextInt() dan nextLine().'
                    : 'Contoh: Saya masih bingung kapan menggunakan int, double, dan String.',
        }
    }

    const prompt = getCurrentPrompt()
    const promptStepLabel = `Step ${stepIndex + 1}`

    const validateCurrentPrompt = () => {
        if (prompt.kind === 'overall') {
            return Boolean(overallUnderstanding)
        }

        if (prompt.kind === 'lesson') {
            if (overallUnderstanding === 'very_clear') {
                return selectedStrengthLessonIds.length > 0
            }

            return Boolean(selectedLessonId)
        }

        if (prompt.kind === 'secondary') {
            return Boolean(secondaryChoice)
        }

        return specificFeedback.trim().length > 0
    }

    const handleSubmitFeedback = async (finalSecondaryChoice: string = secondaryChoice) => {
        if (!selectedClass) {
            return
        }

        if (!overallUnderstanding) {
            return
        }

        if (prompt.kind !== 'overall' && overallUnderstanding === 'very_clear' && selectedStrengthLessonIds.length === 0) {
            return
        }

        if (prompt.kind !== 'overall' && overallUnderstanding !== 'very_clear' && !selectedLessonId) {
            return
        }

        const payloadReflectionAnswers: Record<string, string> = {
            overallUnderstanding,
            secondaryChoice: finalSecondaryChoice,
            specificFeedback: specificFeedback.trim(),
        }

        if (overallUnderstanding === 'very_clear') {
            const uniqueStrengthLessonIds = Array.from(new Set(selectedStrengthLessonIds))
            payloadReflectionAnswers.selectedStrengthLessonIds = uniqueStrengthLessonIds.join(',')
            payloadReflectionAnswers.selectedStrengthLessonTitles = selectedStrengthLessons
                .map((lesson) => lesson.title)
                .join(', ')
        } else {
            payloadReflectionAnswers.selectedLessonId = String(selectedLessonId ?? '')
            payloadReflectionAnswers.selectedLessonTitle = selectedLesson?.title ?? ''
        }

        setSubmissionError('')
        setIsSubmitting(true)

        try {
            await feedbackService.createFeedback({
                roomId: selectedClass.id,
                memberId: learner?.id ?? null,
                selectedMood: overallUnderstanding,
                reflectionAnswers: payloadReflectionAnswers,
            })

            if (learner?.id) {
                await completionService.recordCompletion(learner.id, selectedClass.id)
            }

            await refreshFeedback()
            setSubmitted(true)
            setAnimationState('loading')
        } catch (error) {
            setSubmissionError(error instanceof Error ? error.message : 'Gagal menyimpan feedback. Silakan coba lagi.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const onContinue = async () => {
        if (!validateCurrentPrompt()) {
            return
        }

        if (prompt.kind === 'overall') {
            return
        }

        if (prompt.kind === 'lesson') {
            if (overallUnderstanding === 'very_clear') {
                if (selectedStrengthLessonIds.length === 0) {
                    return
                }

                setStepIndex(2)
                return
            }

            if (!selectedLessonId) {
                return
            }

            setStepIndex(2)
            return
        }

        if (prompt.kind === 'secondary') {
            if (!secondaryChoice) {
                return
            }

            if (secondaryChoice === 'Lainnya' || overallUnderstanding === 'confused' || overallUnderstanding === 'not_understood') {
                setStepIndex(3)
                return
            }

            await handleSubmitFeedback(secondaryChoice)
            return
        }

        if (specificFeedback.trim().length === 0) {
            return
        }

        await handleSubmitFeedback()
    }

    return (
        <PageContainer className="min-h-screen w-full">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col ">
                <div className="mb-6 flex flex-col rounded-[2rem] border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <button
                        type="button"
                        onClick={() => navigate('/room/join')}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        ← Back
                    </button>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                        {!submitted ? 'Room Feedback' : isAnimating ? 'Processing...' : 'Review Submitted'}
                    </div>
                </div>

                <div className="relative w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-2xl shadow-slate-900/10">
                    <div className="absolute right-6 top-6 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {submitted ? 'Submitted' : 'Guided Reflection'}
                    </div>
                    <div className="absolute left-6 top-6 text-xs text-slate-500">
                        {selectedClass ? `Room: ${selectedClass.name}` : 'Room belum dipilih'}
                    </div>

                    {!submitted ? (
                        <div className="space-y-10">
                            <div className="text-center">
                                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{promptStepLabel}</p>
                                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                    {prompt.title}
                                </h1>
                            </div>

                            {isLoadingLessons ? (
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                                    Memuat lesson untuk room ini...
                                </div>
                            ) : lessonError ? (
                                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                                    {lessonError}
                                </div>
                            ) : !lessons.length && prompt.kind !== 'overall' ? (
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                                    Belum ada materi untuk sesi ini.
                                </div>
                            ) : null}

                            {prompt.kind === 'overall' ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {overallOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleOverallChoice(option.value)}
                                            className={`rounded-[1.5rem] border px-5 py-4 text-left text-base font-semibold transition ${overallUnderstanding === option.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            ) : null}

                            {prompt.kind === 'lesson' && lessons.length > 0 ? (
                                <div className="grid gap-3">
                                    {overallUnderstanding === 'not_understood' ? (
                                        <button
                                            type="button"
                                            onClick={() => handleLessonChoice(-1 as unknown as number)}
                                            className={`rounded-[1.5rem] border px-5 py-4 text-left text-base font-semibold transition ${selectedLessonId === -1 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'}`}
                                        >
                                            Hampir semuanya
                                        </button>
                                    ) : null}
                                    {lessons.map((lesson) => {
                                        const isSelected = overallUnderstanding === 'very_clear'
                                            ? selectedStrengthLessonIds.includes(String(lesson.id))
                                            : selectedLessonId === lesson.id

                                        return (
                                            <button
                                                key={lesson.id}
                                                type="button"
                                                onClick={() => {
                                                    if (overallUnderstanding === 'very_clear') {
                                                        toggleStrengthLesson(lesson.id)
                                                        return
                                                    }

                                                    handleLessonChoice(lesson.id)
                                                }}
                                                className={`rounded-[1.5rem] border px-5 py-4 text-left text-base font-semibold transition ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'}`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    {overallUnderstanding === 'very_clear' ? (
                                                        <span className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-transparent'}`}>
                                                            ✓
                                                        </span>
                                                    ) : null}
                                                    {lesson.title}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            ) : null}

                            {prompt.kind === 'secondary' && prompt.options ? (
                                <div className="grid gap-3">
                                    {prompt.options.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => handleSecondaryChoice(option)}
                                            className={`rounded-[1.5rem] border px-5 py-4 text-left text-base font-semibold transition ${secondaryChoice === option ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            ) : null}

                            {prompt.kind === 'specific' ? (
                                <div className="mx-auto max-w-3xl">
                                    <textarea
                                        value={specificFeedback}
                                        onChange={(event) => setSpecificFeedback(event.target.value)}
                                        placeholder={prompt.placeholder || 'Tuliskan pendapat kamu...'}
                                        rows={4}
                                        className="w-full rounded-[1.5rem] border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            ) : null}

                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                                <button
                                    type="button"
                                    onClick={() => navigate('/room/join')}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <div className="flex flex-col items-center gap-3 sm:flex-row">
                                    {stepIndex > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => void onContinue()}
                                        disabled={!validateCurrentPrompt() || isSubmitting}
                                        className={`inline-flex min-w-[220px] items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white transition ${!validateCurrentPrompt() || isSubmitting ? 'cursor-not-allowed bg-slate-300 text-slate-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                                    >
                                        {isSubmitting ? 'Submitting...' : stepIndex === 3 ? 'Submit Feedback' : 'Continue'}
                                    </button>
                                </div>
                            </div>

                            {submissionError ? (
                                <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                                    {submissionError}
                                </div>
                            ) : null}
                        </div>
                    ) : animationState === 'loading' ? (
                        <div className="space-y-10 text-center">
                            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Processing anonymous feedback</p>
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner shadow-blue-100/50 animate-pulse">
                                <span className="text-4xl">⏳</span>
                            </div>
                            <h2 className="text-3xl font-semibold text-slate-900">Connecting learner and mentor</h2>
                            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600">
                                Kami sedang memproses feedback Anda secara anonim dan menyiapkan ringkasan untuk mentor.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8 text-center">
                            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Feedback complete</p>
                            <h2 className="text-3xl font-semibold text-slate-900">Thanks for submitting</h2>
                            <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">
                                Feedback anonim Anda sudah tercatat dan siap ditinjau oleh mentor.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 text-left">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Ringkasan</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">{selectedClass?.name ?? 'Anonymous learner'}</p>
                                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                                        <div>
                                            <p className="font-semibold text-slate-900">Pemahaman</p>
                                            <p>{overallUnderstanding}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Lesson</p>
                                            <p>{selectedLesson?.title ?? 'Semua'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Detail</p>
                                            <p>{secondaryChoice || '-'} </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Feedback spesifik</p>
                                            <p>{specificFeedback || '-'} </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 text-left">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Mentor</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">Feedback anonim</p>
                                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                                        <div>
                                            <p className="font-semibold text-slate-900">Status</p>
                                            <p>Feedback dikirim tanpa identitas peserta.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Insight utama</p>
                                            <p>{specificFeedback || 'Feedback berhasil dikirim.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/room/join')}
                                    className="flex-1 rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Back to Join
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/room')}
                                    className="flex-1 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
                                >
                                    Lihat Room
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    )
}
