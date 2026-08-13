import { useState } from 'react'
import { PrimaryButton } from '../../../components/ui/PrimaryButton'
import { SecondaryButton } from '../../../components/ui/SecondaryButton'
import type { RoomCreateInput, RoomUpdateInput } from '../../../types/room'

type RoomFormProps = {
  initialName?: string
  onSubmit: (input: RoomCreateInput | RoomUpdateInput) => void
  onCancel?: () => void
  submitLabel?: string
}

export function RoomForm({ initialName = '', onSubmit, onCancel, submitLabel = 'Simpan' }: RoomFormProps) {
  const [roomName, setRoomName] = useState(initialName)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!roomName.trim()) {
      return
    }

    onSubmit({
      roomName: roomName.trim(),
      masterId: ''
    })
    setRoomName('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="room-name">
          Room name
        </label>
        <input
          id="room-name"
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
          placeholder="Contoh: Sprint Review"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <SecondaryButton type="button" onClick={onCancel} className="sm:min-w-36">
            Batal
          </SecondaryButton>
        ) : null}
        <PrimaryButton type="submit" className="sm:min-w-40">
          {submitLabel}
        </PrimaryButton>
      </div>
    </form>
  )
}
