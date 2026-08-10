import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLearnerAuth } from '../context/learnerAuthContext'

const navItems = [
    { label: 'Home', to: '/feedback' },
    { label: 'Room', to: '/room' },
    { label: 'Join Room', to: '/room/join' },
    { label: 'Mentor Classes', to: '/mentor/classes' },
    { label: 'Mentor Insights', to: '/mentor/insights' },
]

function normalizePath(path: string) {
    if (path.startsWith('/mentor')) {
        return '/mentor'
    }

    return path
}

export function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAuthenticated, logoutLearner } = useLearnerAuth()
    const currentPath = location.pathname

    const handleLogout = async () => {
        await logoutLearner()
        navigate('/')
    }

    return (
        <header className="border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm shadow-slate-200/50 backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">FloFeed</p>
                    <p className="text-xs text-slate-400">Platform Feedback Psychological Safety</p>
                </div>

                <nav className="flex flex-wrap items-center gap-2">
                    {(isAuthenticated ? navItems : [{ label: 'Home', to: '/' }, { label: 'Login', to: '/login' }]).map((item) => {
                        const isActive = currentPath === item.to
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
                                    ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10'
                                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full px-4 py-2 text-sm font-semibold transition border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        >
                            Logout
                        </button>
                    ) : null}
                </nav>
            </div>
        </header>
    )
}
