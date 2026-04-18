import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    // Get color based on role
    const getRoleColor = (role) => {
        switch (role) {
            case 'Student': return 'blue';
            case 'Teacher': return 'emerald';
            case 'Parent': return 'purple';
            case 'Security': return 'red';
            case 'Admin': return 'amber';
            default: return 'gray';
        }
    };

    const roleColor = getRoleColor(user?.role);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
            {/* Standard Header */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm animate-slide-down">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        {/* Left: Branding */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${roleColor}-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-${roleColor}-500/30 overflow-hidden hover:rotate-12 transition-transform duration-300 cursor-pointer`}>
                                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a10.003 10.003 0 008.139-4.561l.054.09m-3.44 2.04A10.003 10.003 0 0112 21a10.003 10.003 0 01-8.139-4.561l-.054-.09m16.336-2.04L19 16m-14 0l.054.09A10.003 10.003 0 0112 21a10.003 10.003 0 018.139-4.561l.054.09m-3.44 2.04l.054.09A10.003 10.003 0 0012 21" />
                                </svg>
                            </div>
                            <div className="hidden xs:block">
                                <h1 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">SMART EXIT</h1>
                                <p className={`text-[10px] sm:text-xs font-bold text-${roleColor}-500 dark:text-${roleColor}-400 uppercase tracking-widest mt-1`}>Secure Campus Portal</p>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-6">
                            {/* Theme Toggle */}
                            <button 
                                onClick={toggleTheme}
                                className="p-2 sm:p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                                title="Toggle Theme"
                            >
                                {theme === 'light' ? (
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                )}
                            </button>

                            {/* User Info */}
                            <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-800 pl-3 sm:pl-6">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{user?.name}</p>
                                    <p className={`text-[10px] font-black text-${roleColor}-600 dark:text-${roleColor}-400 uppercase tracking-tighter`}>{user?.role}</p>
                                </div>
                                <button 
                                    onClick={logout}
                                    className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95"
                                    title="Logout"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in-up">
                {children}
            </main>
        </div>
    );
};

export default Layout;
