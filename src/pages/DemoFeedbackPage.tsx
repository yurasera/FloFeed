import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/PageContainer'

type DemoAnswers = {
    standout: string
    keep: string
    improve: string
    anythingElse: string
}

const defaultAnswers: DemoAnswers = {
    standout: 'The discussion made me more confident to ask questions.',
    keep: 'Real project examples.',
    improve: 'Please slow down the explanation of State Management.',
    anythingElse: 'No.',
}

const feedbackQuestions: Array<{ key: keyof DemoAnswers; label: string }> = [
    { key: 'standout', label: 'What stood out the most today?' },
    { key: 'keep', label: 'What should we keep for next session?' },
    { key: 'improve', label: 'What could be improved?' },
    { key: 'anythingElse', label: 'Anything else?' },
]

export function DemoFeedbackPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const learnerName = (location.state as { learnerName?: string } | null)?.learnerName ?? ''
    const [rating, setRating] = useState(5)
    const [answers, setAnswers] = useState<DemoAnswers>(defaultAnswers)
    const [stepIndex, setStepIndex] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const totalSteps = feedbackQuestions.length + 1
    const isRatingStep = stepIndex === 0
    const currentQuestion = stepIndex > 0 ? feedbackQuestions[stepIndex - 1] : null

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
                        {!submitted ? `Draft Feedback` : `Review Submitted`}
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
                                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                                    {isRatingStep ? "How satisfied are you with today's session?" : currentQuestion?.label}
                                </h1>
                                <p className="mt-4 text-sm leading-6 text-slate-500">Answer one step at a time for a cleaner feedback experience.</p>
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
                                <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6">
                                    <textarea
                                        value={answers[currentQuestion!.key]}
                                        onChange={(event) => setAnswers({
                                            ...answers,
                                            [currentQuestion!.key]: event.target.value,
                                        })}
                                        rows={8}
                                        className="min-h-[280px] w-full rounded-[1.75rem] border border-slate-300 bg-white px-6 py-6 text-lg leading-8 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Type your answer here..."
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
                                            }
                                        }}
                                        className="inline-flex min-w-[240px] items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
                                    >
                                        {stepIndex < totalSteps - 1 ? 'Continue' : 'Submit Feedback'}
                                    </button>
                                </div>
                            </div>
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
                                </div>
                                <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 text-left">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Session Rating</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">{rating} / 5</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
                            >
                                Back to home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    )
}
