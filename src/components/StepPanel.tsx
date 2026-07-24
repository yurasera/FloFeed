import type { ReactNode } from 'react'

type StepPanelProps = {
    stepTitle: string
    children?: ReactNode
}

export function StepPanel({ stepTitle, children }: StepPanelProps) {
    return (
        <div key={stepTitle} className="step-panel rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-10">
            {children ? (
                <div className="text-left">{children}</div>
            ) : (
                <>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Step</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{stepTitle}</h2>
                </>
            )}
        </div>
    )
}