type StruggleListProps = {
    items: string[]
}

export function StruggleList({ items }: StruggleListProps) {
    return (
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Poin struggle umum</h3>
            {items.length > 0 ? (
                <ul className="space-y-2 text-sm text-slate-600">
                    {items.map((item) => (
                        <li key={item} className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-500">Belum ada pola struggle yang teridentifikasi.</p>
            )}
        </div>
    )
}
