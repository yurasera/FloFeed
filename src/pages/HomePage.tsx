import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { PageContainer } from '../components/PageContainer'
import { SectionTitle } from '../components/SectionTitle'
import { useLearnerAuth } from '../context/learnerAuthContext'

type DemoAnswers = {
    standout: string
    keep: string
    improve: string
    anythingElse: string
}

const demoStepLabels = ['Learner Login', 'Feedback Form', 'Verified Anonymity', 'Comparison']

const defaultAnswers: DemoAnswers = {
    standout: 'The discussion made me more confident to ask questions.',
    keep: 'Real project examples.',
    improve: 'Please slow down the explanation of State Management.',
    anythingElse: 'No.',
}

const demoTimelineSuffix = [
    '✓ Participant Verified',
    'Removing Identity...',
    'Anonymous Feedback Created',
    'Sending to Mentor Dashboard...',
]

export function HomePage() {
    const { isAuthenticated } = useLearnerAuth()
    const [demoStep, setDemoStep] = useState(1)
    const [learnerName, setLearnerName] = useState('')
    const [rating, setRating] = useState(5)
    const [answers, setAnswers] = useState<DemoAnswers>(defaultAnswers)
    const [animationPhase, setAnimationPhase] = useState(0)

    useEffect(() => {
        if (demoStep !== 3) {
            return
        }

        setAnimationPhase(0)
        const delays = [500, 700, 700, 700, 700]
        const timers: number[] = []
        let total = 0

        delays.forEach((delay, index) => {
            total += delay
            timers.push(
                window.setTimeout(() => {
                    setAnimationPhase(index + 1)
                }, total),
            )
        })

        timers.push(
            window.setTimeout(() => {
                setDemoStep(4)
            }, total + 300),
        )

        return () => timers.forEach((timer) => window.clearTimeout(timer))
    }, [demoStep])

    const resetDemo = () => {
        setDemoStep(1)
        setLearnerName('')
        setRating(5)
        setAnswers(defaultAnswers)
        setAnimationPhase(0)
    }

    const timelineItems = [learnerName || 'Learner', ...demoTimelineSuffix]

    if (isAuthenticated) {
        return <Navigate to="/feedback" replace />
    }

    return (
        <PageContainer className="py-8 sm:py-10">
            <Card className="space-y-5 bg-white shadow-sm shadow-slate-200/20">
                <div className="flex flex-col gap-4 rounded-t-3xl border-b border-slate-200 bg-slate-50 px-6 py-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Try FloFeed Demo</p>
                        <p className="text-sm font-semibold uppercase text-slate-900 ">Experience anonymous feedback from learner to mentor.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 text-sm">
                        {demoStepLabels.map((label, index) => (
                            <div
                                key={label}
                                className={`rounded-full px-3 py-2 transition ${demoStep === index + 1 ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10' : 'bg-white border border-slate-200 text-slate-600'}`}
                            >
                                {index + 1}. {label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-b-3xl bg-slate-50 p-6">
                    {demoStep === 1 && (
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Learner</p>
                                <h3 className="mt-3 text-2xl font-semibold text-slate-900">Experience how anonymous feedback works.</h3>
                                <div className="mt-6 space-y-4">
                                    <label className="block text-sm font-medium text-slate-700">Name</label>
                                    <input
                                        value={learnerName}
                                        onChange={(event) => setLearnerName(event.target.value)}
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDemoStep(2)}
                                disabled={!learnerName.trim()}
                                className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${learnerName.trim() ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                            >
                                Start Feedback
                            </button>
                        </div>
                    )}

                    {demoStep === 2 && (
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Session</p>
                                        <h3 className="mt-1 text-xl font-semibold text-slate-900">SwiftUI Basics</h3>
                                    </div>
                                    <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Mentor John Doe</div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">How satisfied are you with today's session?</p>
                                        <div className="mt-3 flex gap-2">
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setRating(value)}
                                                    className={`rounded-3xl px-4 py-2 text-lg transition ${rating === value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                                >
                                                    {'★'.repeat(value)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-semibold text-slate-700">What stood out the most today?</label>
                                        <textarea
                                            value={answers.standout}
                                            onChange={(event) => setAnswers({ ...answers, standout: event.target.value })}
                                            rows={3}
                                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />

                                        <label className="block text-sm font-semibold text-slate-700">What should we keep for next session?</label>
                                        <textarea
                                            value={answers.keep}
                                            onChange={(event) => setAnswers({ ...answers, keep: event.target.value })}
                                            rows={3}
                                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />

                                        <label className="block text-sm font-semibold text-slate-700">What could be improved?</label>
                                        <textarea
                                            value={answers.improve}
                                            onChange={(event) => setAnswers({ ...answers, improve: event.target.value })}
                                            rows={3}
                                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />

                                        <label className="block text-sm font-semibold text-slate-700">Anything else?</label>
                                        <textarea
                                            value={answers.anythingElse}
                                            onChange={(event) => setAnswers({ ...answers, anythingElse: event.target.value })}
                                            rows={2}
                                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDemoStep(3)}
                                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    )}

                    {demoStep === 3 && (
                        <div className="space-y-8 text-center">
                            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/20">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Verified Anonymity</p>
                                <div className="mt-6 space-y-4">
                                    {timelineItems.map((text, index) => {
                                        const active = animationPhase > index
                                        return (
                                            <div
                                                key={`${text}-${index}`}
                                                className={`mx-auto max-w-xl rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all duration-300 ${active
                                                    ? 'border-blue-300 bg-blue-50 text-slate-900 shadow-sm'
                                                    : 'border-slate-200 bg-white text-slate-500 opacity-40'
                                                    }`}
                                            >
                                                {text}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mx-auto h-2 w-full max-w-2xl overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                    style={{ width: `${Math.min((animationPhase / timelineItems.length) * 100, 100)}%` }}
                                />
                            </div>

                            <p className="text-sm text-slate-600">Automatically moving to the comparison once anonymity is verified.</p>
                        </div>
                    )}

                    {demoStep === 4 && (
                        <div className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                <Card className="space-y-5 border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Learner</p>
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Feedback Submitted</h3>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{learnerName}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-100">
                                            <span>✅ Submitted</span>
                                            <span className="text-slate-500">Status</span>
                                        </div>
                                        <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm shadow-slate-100">
                                            🔒 Protected
                                        </div>
                                        <p className="text-sm leading-6 text-slate-600">
                                            Your identity has been removed before your feedback reaches the mentor.
                                        </p>
                                    </div>
                                </Card>

                                <div className="space-y-5">
                                    <Card className="space-y-5 border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Mentor Dashboard</p>
                                            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Session Overview</h3>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                                                <p className="font-semibold text-slate-900">Average Rating</p>
                                                <p className="mt-2 text-lg font-semibold text-slate-900">★★★★☆</p>
                                                <p className="text-sm text-slate-500">4.8 / 5</p>
                                            </div>
                                            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                                                <p className="font-semibold text-slate-900">Responses</p>
                                                <p className="mt-2 text-lg font-semibold text-slate-900">24</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">What learners loved</p>
                                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                                    <li>• Real project examples</li>
                                                    <li>• Interactive discussion</li>
                                                    <li>• Clear explanations</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">Suggestions</p>
                                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                                    <li>• Slow down State Management</li>
                                                    <li>• More hands-on practice</li>
                                                    <li>• Longer Q&A</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">AI Summary</p>
                                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                                    Students appreciated the practical examples and engaging discussion. The most common request was to slow down technical explanations and provide additional hands-on practice.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm shadow-slate-200/20">
                                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Mentor Cannot See</p>
                                        <ul className="mt-4 space-y-3 text-slate-700">
                                            <li>❌ Student Name</li>
                                            <li>❌ Email</li>
                                            <li>❌ Identity</li>
                                            <li>✅ Anonymous Feedback</li>
                                            <li>✅ Actionable Insights</li>
                                        </ul>
                                    </Card>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-600">This demo can be restarted at any time to try the flow again.</p>
                                <button
                                    type="button"
                                    onClick={resetDemo}
                                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                                >
                                    Restart Demo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid gap-6">
                <Card className="space-y-4 bg-white">
                    <SectionTitle
                        eyebrow="How it works"
                        title="Alur learner"
                        description="Register atau login, pertahankan session, lalu lanjut ke feedback flow tanpa mengungkap identitas learner."
                    />

                    <ol className="space-y-3 text-sm leading-6 text-slate-600">
                        <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            1. Buat akun learner atau masuk dengan akun yang sudah tersimpan.
                        </li>
                        <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            2. Session tetap tersimpan di perangkat sehingga learner bisa kembali kapan saja.
                        </li>
                        <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            3. Kirim feedback anonim ke mentor tanpa membawa identitas learner.
                        </li>
                    </ol>
                </Card>
            </div>
        </PageContainer>
    )
}
