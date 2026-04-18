import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import Layout from './components/Layout';

// Pages
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import AdminDashboard from './pages/AdminDashboard';

const AuthAPI = axios.create({ baseURL: 'http://localhost:5000/api/auth' });

function LoginRegister() {
    const { user, login } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();
    const isAdminMode = new URLSearchParams(location.search).get('mode') === 'admin-setup';
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // If user is already logged in, redirect them
    if (user) {
        if (user.role === 'Student') return <Navigate to="/student" />;
        if (user.role === 'Teacher') return <Navigate to="/teacher" />;
        if (user.role === 'Parent') return <Navigate to="/parent" />;
        if (user.role === 'Security') return <Navigate to="/security" />;
        if (user.role === 'Admin') return <Navigate to="/admin" />;
    }

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            if (isLogin) {
                const res = await AuthAPI.post('/login', { email: formData.email, password: formData.password });
                login(res.data.user, res.data.token);
            } else {
                await AuthAPI.post('/register', formData);
                setSuccess('Registration successful! You can now log in.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-500 p-4 font-sans relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl dark:shadow-blue-900/10 border border-gray-100 dark:border-gray-800 p-10 relative z-10 animate-scale-in">
                {/* Theme Toggle in Login */}
                <div className="absolute top-8 right-8">
                    <button 
                        onClick={toggleTheme}
                        className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                    >
                        {theme === 'light' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        )}
                    </button>
                </div>

                <div className="flex justify-center mb-8 animate-float">
                    <div className="w-20 h-20 bg-blue-600 rounded-[1.75rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a10.003 10.003 0 008.139-4.561l.054.09m-3.44 2.04A10.003 10.003 0 0112 21a10.003 10.003 0 01-8.139-4.561l-.054-.09m16.336-2.04L19 16m-14 0l.054.09A10.003 10.003 0 0112 21a10.003 10.003 0 018.139-4.561l.054.09m-3.44 2.04l.054.09A10.003 10.003 0 0012 21" />
                        </svg>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        {isLogin ? 'Enter your credentials to continue' : 'Join our smart security network'}
                    </p>
                </div>
                
                {error && (
                    <div className="p-4 mb-6 flex items-center gap-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 border-l border-red-500 rounded-xl">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 mb-6 flex items-center gap-3 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-l border-emerald-500 rounded-xl">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        {success}
                    </div>
                )}

                <div className={`space-y-6 transition-all duration-500 ${isLogin ? 'opacity-100' : 'opacity-100'}`}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required 
                                className="block w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent dark:text-white rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-medium" />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input type="email" name="email" placeholder="name@campus.com" onChange={handleChange} required 
                            className="block w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent dark:text-white rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-medium" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required 
                            className="block w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent dark:text-white rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-medium" />
                    </div>
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Select Role</label>
                            <select name="role" onChange={handleChange} value={formData.role}
                                className="block w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent dark:text-white rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold appearance-none">
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Parent">Parent</option>
                                <option value="Security">Security</option>
                                {isAdminMode && <option value="Admin">Admin (Setup Mode)</option>}
                            </select>
                        </div>
                    )}
                    <button type="submit" 
                        className="w-full mt-4 py-4 px-6 rounded-2xl text-base font-black text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/25">
                        {isLogin ? 'SIGN IN ' : 'CREATE ACCOUNT'}
                    </button>
                </form>
                
                <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                        {isLogin ? "Don't have an account? Register Now" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    </div>
);
}

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div className="p-10 text-center">Loading...</div>;
    
    if (!user) {
        return <Navigate to="/" />;
    }
    if (user.role !== allowedRole) {
        return <div className="p-10 text-center text-red-600 text-xl font-bold">Unauthorized Access</div>;
    }
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginRegister />} />
                        <Route path="/student" element={<ProtectedRoute allowedRole="Student"><Layout><StudentDashboard /></Layout></ProtectedRoute>} />
                        <Route path="/teacher" element={<ProtectedRoute allowedRole="Teacher"><Layout><TeacherDashboard /></Layout></ProtectedRoute>} />
                        <Route path="/parent" element={<ProtectedRoute allowedRole="Parent"><Layout><ParentDashboard /></Layout></ProtectedRoute>} />
                        <Route path="/security" element={<ProtectedRoute allowedRole="Security"><Layout><SecurityDashboard /></Layout></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute allowedRole="Admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
