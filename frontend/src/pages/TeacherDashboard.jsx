import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

export default function TeacherDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [parentPermissionRequired, setParentPermissionRequired] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await API.get('/requests');
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await API.get('/settings/teacher');
            setParentPermissionRequired(res.data.parent_permission_required);
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
            fetchSettings();
        }
    }, [user]);

    const togglePermissionSetting = async () => {
        const newValue = !parentPermissionRequired;
        try {
            await API.post('/settings/teacher', { parent_permission_required: newValue });
            setParentPermissionRequired(newValue);
        } catch (err) {
            alert('Failed to update permission setting');
        }
    };

    const updateRequest = async (id, status) => {
        try {
            await API.put(`/requests/${id}`, { status });
            fetchRequests();
        } catch (err) {
            alert('Error updating request');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Global Settings Section */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl transition-all duration-300 ${parentPermissionRequired ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500'}`}>
                            {parentPermissionRequired ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Parent Permission Protocol</h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current requirement for final exit approval</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-black uppercase tracking-widest ${parentPermissionRequired ? 'text-emerald-600' : 'text-gray-400 dark:text-gray-500'}`}>
                            {parentPermissionRequired ? 'Required' : 'Disabled'}
                        </span>
                        <button 
                            onClick={togglePermissionSetting}
                            className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all focus:outline-none ring-offset-2 hover:ring-2
                                ${parentPermissionRequired ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700'}`}
                        >
                            <span className={`inline-block h-7 w-7 transform rounded-full shadow-md transition-all duration-300 ${parentPermissionRequired ? 'translate-x-[2.75rem] bg-white' : 'translate-x-1 bg-gray-200 dark:bg-gray-600'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Requests Section */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-800 animate-fade-in-up delay-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Awaiting Verification</h2>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Review and approve student exit requests</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {requests.length === 0 ? (
                        <div className="col-span-full py-16 text-center">
                            <div className="bg-gray-50 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Clear!</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">No pending requests at the moment.</p>
                        </div>
                    ) : null}

                    {requests.map((req, index) => (
                        <div key={req.id} 
                             className={`group relative p-8 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up`}
                             style={{ animationDelay: `${(index + 2) * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Student Name</p>
                                    <h3 className="font-black text-gray-900 dark:text-white text-xl">{req.student_name}</h3>
                                </div>
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(req.leave_date).toLocaleDateString()}</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Time</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{req.leave_time}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Stated Reason</p>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 italic">"{req.reason}"</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => updateRequest(req.id, 'Teacher_Approved')} className="bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/25">APPROVE</button>
                                <button onClick={() => updateRequest(req.id, 'Rejected')} className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-2xl font-black text-sm hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-[0.98] transition-all">REJECT</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
