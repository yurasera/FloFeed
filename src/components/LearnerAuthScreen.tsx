import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Card } from './Card'
import { PageContainer } from './PageContainer'
import { PrimaryButton } from './PrimaryButton'
import { SectionTitle } from './SectionTitle'
import { ShieldIcon } from './ShieldIcon'
import { useLearnerAuth } from '../context/learnerAuthContext'

type LearnerAuthScreenProps = {
    mode: 'login' | 'register'
}

function toTitleCaseMode(mode: LearnerAuthScreenProps['mode']) {
    return mode === 'register' ? 'Daftar' : 'Masuk'
}

export function LearnerAuthScreen({ mode }: LearnerAuthScreenProps) {
    const nameId = useId()
    const emailId = useId()
    const passwordId = useId()
    const confirmPasswordId = useId()
    const location = useLocation()
    const navigate = useNavigate()
    const { learner, session, registerLearner, loginLearner, logoutLearner, isAuthenticated } = useLearnerAuth()
    const isRegisterMode = mode === 'register'
    const redirectTo = useMemo(() => {
        const searchParams = new URLSearchParams(location.search)
        return searchParams.get('redirect') || '/feedback'
    }, [location.search])

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!learner) {
            return
        }

        setName(learner.name)
        setEmail(learner.email)
    }, [learner])

    const switchHref = isRegisterMode
        ? `/login?redirect=${encodeURIComponent(redirectTo)}`
        : `/register?redirect=${encodeURIComponent(redirectTo)}`

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            const payload = {
                email,
                password,
            }

            if (isRegisterMode) {
                if (password !== confirmPassword) {
                    throw new Error('Konfirmasi password tidak sama.')
                }

                if (!name.trim()) {
                    throw new Error('Nama learner wajib diisi.')
                }

                await registerLearner({
                    name,
                    ...payload,
                })
            } else {
                await loginLearner(payload)
            }

            navigate(redirectTo, { replace: true })
        } catch (submitError) {
            const message = submitError instanceof Error ? submitError.message : 'Terjadi kesalahan saat memproses autentikasi.'
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageContainer className="py-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
                <Card className="relative overflow-hidden border-blue-100 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(180deg,_#eff6ff_0%,_#ffffff_100%)]">
                    <div className="space-y-8">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-inset ring-blue-100">
                            <ShieldIcon />
                        </div>

                        <SectionTitle
                            eyebrow="Learner Access"
                            title={`${toTitleCaseMode(mode)} untuk feedback anonim`}
                            description="Akun learner disimpan di perangkat ini sebagai lapisan accountability, sementara mentor tetap hanya melihat feedback anonim dan agregat."
                        />

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm">
                                <p className="text-sm font-semibold text-slate-900">Anonymity</p>
                                <p className="mt-1 text-sm leading-6 text-slate-600">Identitas learner tidak pernah masuk ke payload feedback mentor.</p>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm">
                                <p className="text-sm font-semibold text-slate-900">Persisted session</p>
                                <p className="mt-1 text-sm leading-6 text-slate-600">Login tetap tersimpan sehingga learner bisa lanjut ke flow feedback.</p>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm">
                                <p className="text-sm font-semibold text-slate-900">Supabase-ready</p>
                                <p className="mt-1 text-sm leading-6 text-slate-600">Service layer siap diganti ke Supabase Auth tanpa ubah UI utama.</p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-blue-100 bg-white/80 p-5 shadow-sm">
                            <p className="text-sm font-semibold text-blue-700">Current session</p>
                            {isAuthenticated && learner && session ? (
                                <div className="mt-3 space-y-2 text-sm text-slate-600">
                                    <p>
                                        Signed in as <span className="font-semibold text-slate-900">{learner.name}</span>
                                    </p>
                                    <p>{learner.email}</p>
                                    <p>Last active: {new Date(session.lastActiveAt).toLocaleString('id-ID')}</p>
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <Link
                                            to="/feedback"
                                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                        >
                                            Continue feedback
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => void logoutLearner()}
                                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    Belum ada sesi aktif. Login atau buat akun baru untuk menyimpan status sesi dan melanjutkan ke feedback.
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                <Card className="space-y-6 border-slate-200 bg-white">
                    <SectionTitle
                        eyebrow={isRegisterMode ? 'Create account' : 'Welcome back'}
                        title={isRegisterMode ? 'Buat akun learner' : 'Masuk ke akun learner'}
                        description={isRegisterMode ? 'Buat identitas learner agar sesi tersimpan secara lokal di perangkat ini.' : 'Masuk kembali untuk melanjutkan feedback dan menjaga status sesi tetap aktif.'}
                    />

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {isRegisterMode ? (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor={nameId}>
                                    Nama learner
                                </label>
                                <input
                                    id={nameId}
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Contoh: Nabila"
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    autoComplete="name"
                                />
                            </div>
                        ) : null}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor={emailId}>
                                Email
                            </label>
                            <input
                                id={emailId}
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="learner@example.com"
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor={passwordId}>
                                Password
                            </label>
                            <input
                                id={passwordId}
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Minimal 6 karakter"
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                            />
                        </div>

                        {isRegisterMode ? (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor={confirmPasswordId}>
                                    Confirm password
                                </label>
                                <input
                                    id={confirmPasswordId}
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Ulangi password"
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    autoComplete="new-password"
                                />
                            </div>
                        ) : null}

                        {error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                        ) : null}

                        <PrimaryButton type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Memproses...' : isRegisterMode ? 'Buat akun' : 'Masuk'}
                        </PrimaryButton>
                    </form>

                    <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
                        <p className="leading-6">
                            {isRegisterMode
                                ? 'Sudah punya akun learner? Masuk untuk melanjutkan feedback dengan sesi yang tersimpan.'
                                : 'Belum punya akun? Buat akun learner terlebih dahulu agar sesi tetap tersimpan.'}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to={switchHref}
                                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                {isRegisterMode ? 'Pindah ke masuk' : 'Pindah ke daftar'}
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                Kembali ke home
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}
