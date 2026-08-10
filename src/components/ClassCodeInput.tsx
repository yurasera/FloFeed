import { useId } from 'react'

type ClassCodeInputProps = {
    value: string
    onChange: (value: string) => void
    error?: string
    disabled?: boolean
    label?: string
    placeholder?: string
}

export function ClassCodeInput({
    value,
    onChange,
    error,
    disabled = false,
    label = 'Kode Kelas',
    placeholder = 'Contoh: ALPHA01',
}: ClassCodeInputProps) {
    const inputId = useId()

    return (
        <div className="space-y-2">
            <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
                Kode Kelas
            </label>
            <input
                id={inputId}
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value.toUpperCase())}
                placeholder="Contoh: ALPHA01"
                disabled={disabled}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    )
}
