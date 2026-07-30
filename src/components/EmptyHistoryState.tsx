import { Card } from './Card'

export function EmptyHistoryState() {
    return (
        <Card className="p-8 text-center shadow-none">
            <div className="space-y-3">
                <span className="inline-block text-5xl">📋</span>
                <p className="text-lg font-semibold text-slate-900">Belum ada riwayat feedback</p>
                <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">
                    Kirim feedback pertama Anda untuk mulai membangun riwayat dan mengumpulkan poin.
                </p>
            </div>
        </Card>
    )
}
