import type { HTMLAttributes } from 'react'

type PageContainerProps = HTMLAttributes<HTMLDivElement>

export function PageContainer({ className = '', ...props }: PageContainerProps) {
    return (
        <div
            className={`mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 ${className}`}
            {...props}
        />
    )
}