import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLearnerAuth } from '../../context/learnerAuthContext'

const navItems = [
    { label: 'Home', to: '/feedback' },
    { label: 'Room', to: '/room' },
    { label: 'Join Room', to: '/room/join' },
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
        <header className="px-3 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md shadow-lg shadow-slate-900/8 px-5 py-4 sm:px-7 sm:py-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                    {/* Brand Section */}
                    <div className="flex-shrink-0">
                        <p className="text-sm font-semibold tracking-wide text-slate-900">FloFeed</p>
                        <p className="text-xs text-slate-500 mt-1">Structured Feedback, Better Learning</p>
                    </div>

                    {/* Navigation Section */}
                    <nav className="flex flex-wrap items-center gap-2 md:gap-2.5">
                        {(isAuthenticated ? navItems : [{ label: 'Home', to: '/' }, { label: 'Login', to: '/login' }]).map((item) => {
                            const isActive = currentPath === item.to
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${isActive
                                            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15 hover:shadow-lg hover:shadow-slate-900/20'
                                            : 'border border-slate-200/80 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:shadow-sm hover:shadow-slate-200/50'
                                        } ${isActive ? 'focus-visible:outline-slate-900' : 'focus-visible:outline-slate-700'}`}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border border-slate-200/80 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:shadow-sm hover:shadow-slate-200/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                            >
                                Logout
                            </button>
                        ) : null}
                    </nav>
                </div>
            </div>
        </header>
    )
}
