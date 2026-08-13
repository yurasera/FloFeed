import type { ReactNode } from 'react'

type StepShellProps = {
    children: ReactNode
    className?: string
}

export function StepShell({ children, className = '' }: StepShellProps) {
    return (
        <article className={`step-panel rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-8 ${className}`}>
            {children}
        </article>
    )
}