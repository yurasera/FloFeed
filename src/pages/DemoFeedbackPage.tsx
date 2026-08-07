import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/PageContainer'

type DemoAnswers = {
    standout: string
    keep: string
    improve: string
    anythingElse: string
}

const defaultAnswers: DemoAnswers = {
    standout: '',
    keep: '',
    improve: '',
    anythingElse: '',
}

const placeholderAnswers: DemoAnswers = {
    standout: 'The discussion made me more confident to ask questions.',
    keep: 'Misalnya cara penyampaian, materi, aktivitas, atau pengalaman yang menurut Anda sudah baik.',
    improve: 'Sesi berikut nya saya ingin lebih banyak diskusi dan contoh praktis.',
    anythingElse: '??',
}

const feedbackQuestions: Array<{ key: keyof DemoAnswers; label: string }> = [
    { key: 'keep', label: 'Apa yang ingin tetap ada di sesi berikutnya?' },
    { key: 'improve', label: 'Apa yang perlu diperbaiki di sesi berikutnya?' },
    { key: 'anythingElse', label: 'Jika ada hal lain yang ingin Anda sampaikan, apa itu?' },
]

export function DemoFeedbackPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const learnerName = (location.state as { learnerName?: string } | null)?.learnerName ?? ''
    const [rating, setRating] = useState(5)
    const [answers, setAnswers] = useState<DemoAnswers>(defaultAnswers)
    const [stepIndex, setStepIndex] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [animationState, setAnimationState] = useState<'idle' | 'loading' | 'done'>('idle')
    const totalSteps = feedbackQuestions.length + 1
    const isRatingStep = stepIndex === 0
    const currentQuestion = stepIndex > 0 ? feedbackQuestions[stepIndex - 1] : null
    const isCurrentAnswerEmpty = !isRatingStep && currentQuestion ? answers[currentQuestion.key].trim().length === 0 : false
    const isAnimating = submitted && animationState === 'loading'
    const isComplete = submitted && animationState === 'done'

    useEffect(() => {
        if (!submitted || animationState !== 'loading') {
            return
        }

        const timer = window.setTimeout(() => {
            setAnimationState('done')
        }, 5400)

        return () => window.clearTimeout(timer)
    }, [submitted, animationState])

    return (
        <PageContainer className="min-h-screen w-full">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col ">
                <div className="mb-6 flex flex-col rounded-[2rem] border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        ← Back
                    </button>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                        {!submitted ? 'Draft Feedback' : isAnimating ? 'Processing...' : 'Review Submitted'}
                    </div>
                </div>

                <div className="relative w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-2xl shadow-slate-900/10">
                    <div className="absolute right-6 top-6 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {isRatingStep ? 'Satisfaction' : 'Feedback'}
                    </div>
                    <div className="absolute left-6 top-6 text-xs text-slate-500">
                        {learnerName ? `Hi ${learnerName}` : 'Anonymous learner'}
                    </div>

                    {!submitted ? (
                        <div className="space-y-10">
                            <div className="text-center">
                                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Question {stepIndex + 1}/{totalSteps}</p>
                                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                    {isRatingStep ? "How satisfied are you with today's session?" : currentQuestion?.label}
                                </h1>
                            </div>

                            {isRatingStep ? (
                                <div className="flex justify-center">
                                    <div className="grid grid-cols-5 gap-4 rounded-[2rem] bg-slate-100 p-6">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setRating(value)}
                                                className={`h-20 w-20 rounded-full text-3xl font-semibold transition ${rating === value ? 'bg-blue-600 text-white shadow-xl shadow-blue-200/30' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'}`}
                                            >
                                                {'★'.repeat(value)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mx-auto max-w-3xl">
                                    <input
                                        type="text"
                                        value={answers[currentQuestion!.key]}
                                        onChange={(event) => setAnswers({
                                            ...answers,
                                            [currentQuestion!.key]: event.target.value,
                                        })}
                                        required
                                        placeholder={placeholderAnswers[currentQuestion!.key] || 'Type your answer here...'}
                                        style={{ fontSize: "2.25rem" }}
                                        className="w-full border-b border-slate-300 bg-white px-6 py-4 text-2xl leading-8 text-slate-900 transition focus:outline-none focus:ring-0 focus:border-slate-300 placeholder:text-2xl"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <div className="flex flex-col items-center gap-3 sm:flex-row">
                                    {stepIndex > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setStepIndex(stepIndex - 1)}
                                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (stepIndex < totalSteps - 1) {
                                                setStepIndex(stepIndex + 1)
                                            } else {
                                                setSubmitted(true)
                                                setAnimationState('loading')
                                            }
                                        }}
                                        disabled={isCurrentAnswerEmpty}
                                        className={`inline-flex min-w-[240px] items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white transition ${isCurrentAnswerEmpty ? 'cursor-not-allowed bg-slate-300 text-slate-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                                    >
                                        {stepIndex < totalSteps - 1 ? 'Continue' : 'Submit Feedback'}
                                    </button>
                                </div>
                            </div>
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
                                Your anonymous feedback has been recorded and is ready for review by the mentor.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 text-left">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Learner</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">{learnerName || 'Anonymous learner'}</p>
                                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                                        <div>
                                            <p className="font-semibold text-slate-900">Pertahankan</p>
                                            <p>{answers.keep || '-'} </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Perbaiki</p>
                                            <p>{answers.improve || '-'} </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Catatan lain</p>
                                            <p>{answers.anythingElse || '-'} </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Rating session</p>
                                            <p>{rating} / 5</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 text-left">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Mentor</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">Anonymous review dari 11 learner</p>
                                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                                        <div>
                                            <p className="font-semibold text-slate-900">Rating session</p>
                                            <p>{rating} / 5</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Insight utama</p>
                                            <p>Peserta menyukai penyampaian yang jelas, tetapi meminta lebih banyak diskusi dan contoh praktis.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Status anonimitas</p>
                                            <p>Feedback dikirim tanpa identitas peserta.</p>
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
                                    onClick={() => navigate('/login')}
                                    className="flex-1 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    )
}
