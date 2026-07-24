export function ConfettiDecoration() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <span className="confetti-piece confetti-piece--one" />
            <span className="confetti-piece confetti-piece--two" />
            <span className="confetti-piece confetti-piece--three" />
            <span className="confetti-piece confetti-piece--four" />
        </div>
    )
}