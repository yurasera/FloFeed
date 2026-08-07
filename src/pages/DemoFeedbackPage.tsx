import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { PageContainer } from '../components/PageContainer'
import { SectionTitle } from '../components/SectionTitle'

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
    const [questionIndex, setQuestionIndex] = useState(0)
    const [submitted, setSubmitted] = useState(false)

    return (
        <PageContainer className="py-8 sm:py-10">
            <div className="mb-6 flex items-center justify-between gap-3">
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

            <Card className="space-y-6 bg-white p-6 shadow-sm shadow-slate-200/20">
                <SectionTitle
                    eyebrow="Feedback Demo"
                    title={learnerName ? `Hello, ${learnerName}` : 'Enter anonymous feedback'}
                    description="Continue the learner feedback flow on its own page without the navbar."
                />

                {!submitted ? (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-sm font-semibold text-slate-700">How satisfied are you with today's session?</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setRating(value)}
                                        className={`rounded-3xl px-4 py-3 text-lg font-semibold transition ${rating === value ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100'}`}
                                    >
                                        {'★'.repeat(value)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span>{feedbackQuestions[questionIndex].label}</span>
                                <span>{questionIndex + 1}/{feedbackQuestions.length}</span>
                            </div>
                            <textarea
                                value={answers[feedbackQuestions[questionIndex].key]}
                                onChange={(event) => setAnswers({
                                    ...answers,
                                    [feedbackQuestions[questionIndex].key]: event.target.value,
                                })}
                                rows={6}
                                className="mt-4 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Type your feedback here"
                            />
                        </div>

                        <div className="flex justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (questionIndex < feedbackQuestions.length - 1) {
                                        setQuestionIndex(questionIndex + 1)
                                        return
                                    }
                                    setSubmitted(true)
                                }}
                                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                {questionIndex < feedbackQuestions.length - 1 ? 'Continue Feedback' : 'Submit Feedback'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm shadow-slate-200/20">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Feedback Complete</p>
                            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Thanks for submitting</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Your anonymous feedback is now ready for review. The mentor will get the summary without any learner identity.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/20">
                                <p className="text-sm font-semibold text-slate-500">Learner</p>
                                <p className="mt-3 text-lg font-semibold text-slate-900">{learnerName || 'Anonymous learner'}</p>
                            </div>
                            <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/20">
                                <p className="text-sm font-semibold text-slate-500">Session Rating</p>
                                <p className="mt-3 text-lg font-semibold text-slate-900">{rating} / 5</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            Back to home
                        </button>
                    </div>
                )}
            </Card>
        </PageContainer>
    )
}
