import { PrimaryButton } from './PrimaryButton'
import { ShieldIcon } from './ShieldIcon'
import { IllustrationPlaceholder } from './IllustrationPlaceholder'

type WelcomeStepProps = {
    onStart: () => void
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
    return (
        <article className="step-panel grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <section className="space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-inset ring-blue-100">
                    <ShieldIcon />
                </div>

                <div className="space-y-3">
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Anonymous Feedback</h2>
                    <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                        <p>Feedback Anda bersifat anonim.</p>
                        <p>Mentor tidak dapat melihat identitas Anda.</p>
                        <p>Berikan feedback dengan jujur untuk membantu meningkatkan kualitas pembelajaran.</p>
                    </div>
                </div>

                <PrimaryButton onClick={onStart} className="min-w-32">
                    Mulai
                </PrimaryButton>
            </section>

            <section aria-label="Illustration placeholder">
                <IllustrationPlaceholder />
            </section>
        </article>
    )
}