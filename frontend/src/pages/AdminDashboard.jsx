import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

export default function AdminDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await API.get('/logs');
                setLogs(res.data);
            } catch (err) {
                console.error("Failed to fetch logs", err);
            }
        };
        if (user) fetchLogs();
    }, [user]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-xl shadow-amber-500/5 border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Logs</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{logs.length}</h3>
                    </div>
                </div>
            </div>

            {/* Log History */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-amber-500/5 border border-gray-100 dark:border-gray-800 animate-fade-in-up delay-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Security Audit History</h2>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Complete record of system entries and exits</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="pb-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">Timestamp</th>
                                <th className="pb-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">Student</th>
                                <th className="pb-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">Type</th>
                                <th className="pb-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">Status</th>
                                <th className="pb-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">QR Token</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {logs.map((log) => (
                                <tr key={log.id} className={`group transition-colors ${log.status === 'Fraud_Attempt' ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50'}`}>
                                    <td className="py-4 px-4">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(log.scan_time).toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <h4 className="font-black text-gray-900 dark:text-white">{log.student_name}</h4>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{log.type}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border 
                                            ${log.status === 'Success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-500/20' : 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-500/20'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <code className="text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{log.token_hash.substring(0, 16)}...</code>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
