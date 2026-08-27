import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'

type OverallUnderstanding = 'very_clear' | 'mostly_clear' | 'confused' | 'not_understood'
type PromptKind = 'overall' | 'lesson' | 'secondary' | 'specific'

type Lesson = {
    id: number
    title: string
}

const demoLessons: Lesson[] = [
    { id: 1, title: 'Pengenalan SwiftUI' },
    { id: 2, title: 'State Management' },
    { id: 3, title: 'Navigation' },
    { id: 4, title: 'Forms & Input' },
    { id: 5, title: 'Layout & Styling' },
    { id: 6, title: 'Data Flow' },
]

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

export function DemoFeedbackPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const learnerName = (location.state as { learnerName?: string } | null)?.learnerName ?? ''
    const [overallUnderstanding, setOverallUnderstanding] = useState<OverallUnderstanding | ''>('')
    const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([])
    const [selectedStrengthReasons, setSelectedStrengthReasons] = useState<string[]>([])
    const [selectedMostlyClearReasons, setSelectedMostlyClearReasons] = useState<string[]>([])
    const [selectedConfusedReasons, setSelectedConfusedReasons] = useState<string[]>([])
    const [selectedNotUnderstoodReasons, setSelectedNotUnderstoodReasons] = useState<string[]>([])
    const [secondaryChoice, setSecondaryChoice] = useState('')
    const [specificFeedback, setSpecificFeedback] = useState('')
    const [stepIndex, setStepIndex] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [animationState, setAnimationState] = useState<'idle' | 'loading' | 'done'>('idle')

    const isAnimating = submitted && animationState === 'loading'
    const selectedLessonSummary = selectedLessonIds.length > 0
        ? demoLessons
            .filter((lesson) => selectedLessonIds.includes(lesson.id))
            .map((lesson) => lesson.title)
        : []

    const selectedReasonSummary = overallUnderstanding === 'very_clear'
        ? selectedStrengthReasons
        : overallUnderstanding === 'mostly_clear'
            ? (secondaryChoice ? [secondaryChoice] : selectedMostlyClearReasons)
            : overallUnderstanding === 'confused'
                ? selectedConfusedReasons
                : overallUnderstanding === 'not_understood'
                    ? selectedNotUnderstoodReasons
                    : []

    const getPrompt = (): { kind: PromptKind; title: string; placeholder?: string; options?: string[] } => {
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
                options: [...demoLessons.map((lesson) => lesson.title)],
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
                options: overallUnderstanding ? secondaryOptionsByOverall[overallUnderstanding] : [],
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
                    ? 'Contoh: Saya bingung kapan menggunakan List dan ForEach di SwiftUI.'
                    : 'Contoh: Saya masih bingung saat menggabungkan @State dan binding.',
        }
    }

    const prompt = getPrompt()
    const promptStepLabel = `Step ${stepIndex + 1}`
    const overallUnderstandingLabel = overallOptions.find((option) => option.value === overallUnderstanding)?.label ?? ''

    const resetDemoState = () => {
        setOverallUnderstanding('')
        setSelectedLessonIds([])
        setSelectedStrengthReasons([])
        setSelectedMostlyClearReasons([])
        setSelectedConfusedReasons([])
        setSelectedNotUnderstoodReasons([])
        setSecondaryChoice('')
        setSpecificFeedback('')
        setStepIndex(0)
        setSubmitted(false)
        setAnimationState('idle')
    }

    useEffect(() => {
        if (!submitted || animationState !== 'loading') {
            return
        }

        const timer = window.setTimeout(() => {
            setAnimationState('done')
        }, 5400)

        return () => window.clearTimeout(timer)
    }, [submitted, animationState])

    const handleOverallChoice = (value: OverallUnderstanding) => {
        setOverallUnderstanding(value)
        setSelectedLessonIds([])
        setSelectedStrengthReasons([])
        setSelectedMostlyClearReasons([])
        setSelectedConfusedReasons([])
        setSelectedNotUnderstoodReasons([])
        setSecondaryChoice('')
        setSpecificFeedback('')
        setStepIndex(1)
    }

    const toggleLesson = (lessonId: number) => {
        setSelectedLessonIds((current) => {
            if (current.includes(lessonId)) {
                return current.filter((item) => item !== lessonId)
            }

            return [...current, lessonId]
        })
        setSecondaryChoice('')
        setSpecificFeedback('')
    }

    const toggleReason = (value: string) => {
        if (overallUnderstanding === 'very_clear') {
            setSelectedStrengthReasons((current) => {
                if (current.includes(value)) {
                    return current.filter((item) => item !== value)
                }

                return [...current, value]
            })
            return
        }

        if (overallUnderstanding === 'mostly_clear') {
            setSelectedMostlyClearReasons((current) => {
                if (current.includes(value)) {
                    return current.filter((item) => item !== value)
                }

                return [...current, value]
            })
            return
        }

        if (overallUnderstanding === 'confused') {
            setSelectedConfusedReasons((current) => {
                if (current.includes(value)) {
                    return current.filter((item) => item !== value)
                }

                return [...current, value]
            })
            return
        }

        if (overallUnderstanding === 'not_understood') {
            setSelectedNotUnderstoodReasons((current) => {
                if (current.includes(value)) {
                    return current.filter((item) => item !== value)
                }

                return [...current, value]
            })
        }
    }

    const validateCurrentPrompt = () => {
        if (prompt.kind === 'overall') {
            return Boolean(overallUnderstanding)
        }

        if (prompt.kind === 'lesson') {
            return selectedLessonIds.length > 0
        }

        if (prompt.kind === 'secondary') {
            if (overallUnderstanding === 'very_clear') {
                return selectedStrengthReasons.length > 0
            }

            if (overallUnderstanding === 'mostly_clear') {
                return Boolean(secondaryChoice)
            }

            if (overallUnderstanding === 'confused') {
                return selectedConfusedReasons.length > 0
            }

            if (overallUnderstanding === 'not_understood') {
                return selectedNotUnderstoodReasons.length > 0
            }

            return Boolean(secondaryChoice)
        }

        return specificFeedback.trim().length > 0
    }

    const handleSecondaryChoice = (value: string) => {
        if (overallUnderstanding === 'very_clear') {
            toggleReason(value)
            setSecondaryChoice(value)
            return
        }

        if (overallUnderstanding === 'mostly_clear') {
            setSelectedMostlyClearReasons((current) => {
                if (current.includes(value)) {
                    return current.filter((item) => item !== value)
                }

                return [value]
            })
            setSecondaryChoice(value)
            return
        }

        if (overallUnderstanding === 'confused') {
            toggleReason(value)
            setSecondaryChoice(value)
            return
        }

        if (overallUnderstanding === 'not_understood') {
            toggleReason(value)
            setSecondaryChoice(value)
            return
        }
    }

    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex((current) => current - 1)
        }
    }

    const onContinue = () => {
        if (!validateCurrentPrompt()) {
            return
        }

        if (prompt.kind === 'overall') {
            return
        }

        if (prompt.kind === 'lesson') {
            if (selectedLessonIds.length === 0) {
                return
            }

            setStepIndex(2)
            return
        }

        if (prompt.kind === 'secondary') {
            if (overallUnderstanding === 'very_clear' && selectedStrengthReasons.includes('Lainnya')) {
                setStepIndex(3)
                return
            }

            if (overallUnderstanding === 'confused' && selectedConfusedReasons.includes('Lainnya')) {
                setStepIndex(3)
                return
            }

            if (overallUnderstanding === 'not_understood' && selectedNotUnderstoodReasons.includes('Lainnya')) {
                setStepIndex(3)
                return
            }

            if (overallUnderstanding === 'mostly_clear' && (!secondaryChoice || secondaryChoice === 'Lainnya')) {
                setStepIndex(3)
                return
            }

            if (overallUnderstanding === 'very_clear' || overallUnderstanding === 'confused' || overallUnderstanding === 'not_understood') {
                setSubmitted(true)
                setAnimationState('loading')
                return
            }

            if (secondaryChoice) {
                setSubmitted(true)
                setAnimationState('loading')
            }

            return
        }

        if (specificFeedback.trim().length > 0) {
            setSubmitted(true)
            setAnimationState('loading')
        }
    }

    return (
        <PageContainer className="min-h-screen w-full">
            <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
                <div className="mb-6 flex flex-col rounded-[2rem] border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        ← Kembali
                    </button>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                        {!submitted ? 'Demo Feedback' : isAnimating ? 'Memproses...' : 'Review Demo'}
                    </div>
                </div>

                <div className="relative w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-2xl shadow-slate-900/10">
                    <div className="absolute right-6 top-6 rounded-full hidden bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:block">
                        {submitted ? 'Submitted' : 'Guided Reflection'}
                    </div>
                    <div className="absolute left-1/2 top-6 -translate-x-1/2 text-center text-xs text-slate-500 sm:left-6 sm:translate-x-0">
                        {learnerName ? `Hi ${learnerName}` : 'Anonymous learner'}
                    </div>

                    {!submitted ? (
                        <div className="space-y-10">
                            <div className="text-center">
                                <p className="text-xs uppercase tracking-[0.32em] text-slate-500 mt-8 sm:mt-0">{promptStepLabel}</p>
                                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                    {prompt.title}
                                </h1>
                            </div>

                            {stepIndex > 0 && overallUnderstanding ? (
                                <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 text-left">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Jawaban sebelumnya</p>
                                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                                        <div>
                                            <p className="font-semibold text-slate-900">Pemahaman kamu</p>
                                            <p>{overallUnderstandingLabel}</p>
                                        </div>
                                        {stepIndex > 1 && selectedLessonSummary.length > 0 ? (
                                            <div>
                                                <p className="font-semibold text-slate-900">Bagian yang dibahas</p>
                                                <p>{selectedLessonSummary.join(', ')}</p>
                                            </div>
                                        ) : null}
                                        {stepIndex > 2 && selectedReasonSummary.length > 0 ? (
                                            <div>
                                                <p className="font-semibold text-slate-900">Catatan utama</p>
                                                <p>{selectedReasonSummary.join(', ')}</p>
                                            </div>
                                        ) : null}
                                    </div>
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

                            {prompt.kind === 'lesson' ? (
                                <div className="grid gap-3">
                                    {demoLessons.map((lesson) => {
                                        const isSelected = selectedLessonIds.includes(lesson.id)

                                        return (
                                            <button
                                                key={lesson.id}
                                                type="button"
                                                onClick={() => toggleLesson(lesson.id)}
                                                className={`rounded-[1.5rem] border px-5 py-4 text-left text-base font-semibold transition ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'}`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-transparent'}`}>
                                                        ✓
                                                    </span>
                                                    {lesson.title}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            ) : null}

                            {prompt.kind === 'secondary' && prompt.options ? (
                                <div className="grid gap-3">
                                    {prompt.options.map((option) => {
                                        const isSelected = overallUnderstanding === 'very_clear'
                                            ? selectedStrengthReasons.includes(option)
                                            : overallUnderstanding === 'mostly_clear'
                                                ? secondaryChoice === option
                                                : overallUnderstanding === 'confused'
                                                    ? selectedConfusedReasons.includes(option)
                                                    : selectedNotUnderstoodReasons.includes(option)

                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => handleSecondaryChoice(option)}
                                                className={`rounded-[1.5rem] border px-5 py-4 text-left text-base font-semibold transition ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'}`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    {overallUnderstanding === 'very_clear' || overallUnderstanding === 'confused' || overallUnderstanding === 'not_understood' ? (
                                                        <span className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-transparent'}`}>
                                                            ✓
                                                        </span>
                                                    ) : null}
                                                    {option}
                                                </span>
                                            </button>
                                        )
                                    })}
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

                            <div className="flex w-full items-center justify-between gap-4">
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
                                    onClick={onContinue}
                                    disabled={!validateCurrentPrompt()}
                                    className={`inline-flex min-w-0 items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white transition ${!validateCurrentPrompt() ? 'cursor-not-allowed bg-slate-300 text-slate-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                                >
                                    {stepIndex === 3 ? 'Submit Feedback' : 'Continue'}
                                </button>
                            </div>
                        </div>
                    ) : animationState === 'loading' ? (
                        <div className="space-y-10 text-center">
                            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Processing anonymous feedback</p>
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner shadow-blue-100/50 animate-pulse">
                                <span className="text-4xl">⏳</span>
                            </div>
                            <h2 className="text-3xl font-semibold text-slate-900">Memberikan insight untuk mentor</h2>
                            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600">
                                Kami sedang menyusun ringkasan anonim berdasarkan jawaban Anda agar mentor dapat memahami kebutuhan belajar tanpa melihat identitas peserta.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8 text-center">
                            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Feedback complete</p>
                            <h2 className="text-3xl font-semibold text-slate-900">Feedback demo berhasil dikirim</h2>
                            <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">
                                Ini adalah contoh lokal dari alur feedback anonim. Data tidak disimpan ke database, tapi hasilnya sudah mencerminkan pengalaman yang sama seperti halaman room feedback.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 text-left">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Ringkasan</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">{learnerName || 'Anonymous learner'}</p>
                                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                                        <div>
                                            <p className="font-semibold text-slate-900">Pemahaman</p>
                                            <p>{overallUnderstandingLabel}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Bagian yang dibahas</p>
                                            <p>{selectedLessonSummary.length > 0 ? selectedLessonSummary.join(', ') : 'Semua'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Detail</p>
                                            <p>{selectedReasonSummary.length > 0 ? selectedReasonSummary.join(', ') : '-'} </p>
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
                                            <p>{specificFeedback || 'Feedback berhasil dikirim. Mentor dapat melihat kebutuhan belajar yang paling relevan.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="flex-1 rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Back to Home
                                </button>

                                <button
                                    type="button"
                                    onClick={resetDemoState}
                                    className="flex-1 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    )
}
