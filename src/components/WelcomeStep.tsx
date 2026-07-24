import { PrimaryButton } from './PrimaryButton'
import { ShieldIcon } from './ShieldIcon'
import { IllustrationPlaceholder } from './IllustrationPlaceholder'
import { StepSectionHeader } from './StepSectionHeader'
import { StepShell } from './StepShell'

type WelcomeStepProps = {
    onStart: () => void
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
    return (
        <StepShell className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <section className="space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-inset ring-blue-100">
                    <ShieldIcon />
                </div>

                <div className="space-y-3">
                    <StepSectionHeader eyebrow="Welcome" title="Anonymous Feedback" />
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
        </StepShell>
    )
}