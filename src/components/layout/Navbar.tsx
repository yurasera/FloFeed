import { useState } from 'react'
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await logoutLearner()
        navigate('/')
        setIsMobileMenuOpen(false)
    }

    return (
        <header className="px-3 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-4xl border border-slate-200/70 bg-white/80 backdrop-blur-md shadow-lg shadow-slate-900/8 px-5 py-2 sm:px-5 sm:py-3">
                <div className="flex items-center justify-between gap-3 sm:gap-6">
                    {/* Brand Section */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <img
                            src="/FloFeed/fs.png"
                            alt="FloFeed Logo"
                            className="h-6 w-6 object-contain"
                        />
                        <p className="text-sm font-semibold tracking-wide text-slate-900">FLOFEED</p>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex flex-wrap items-center gap-2 md:gap-2.5">
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

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="sm:hidden flex flex-col gap-1.5 items-center justify-center h-4 w-4 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <span className={`h-0.5 w-4 bg-slate-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`h-0.5 w-4 bg-slate-900 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`h-0.5 w-4 bg-slate-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <nav className="sm:hidden flex flex-col gap-2 mt-3 pt-3 border-t border-slate-200/50">
                        {(isAuthenticated ? navItems : [{ label: 'Home', to: '/' }, { label: 'Login', to: '/login' }]).map((item) => {
                            const isActive = currentPath === item.to
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 block ${isActive
                                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                                        : 'border border-slate-200/80 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
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
                                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border border-slate-200/80 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 w-full text-left"
                            >
                                Logout
                            </button>
                        ) : null}
                    </nav>
                )}
            </div>
        </header>
    )
}
