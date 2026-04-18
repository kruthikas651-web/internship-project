import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

export default function ParentDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await API.get('/requests');
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };


    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    
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
            {/* Main Content Section */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-purple-500/5 border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Parental Confirmation</h2>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Final verification for your child's exit request</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {requests.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">No Pending Approvals</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Any new requests from your child will appear here.</p>
                        </div>
                    ) : null}

                    {requests.map((req, index) => (
                        <div key={req.id} 
                             className="group relative p-8 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
                             style={{ animationDelay: `${(index + 1) * 150}ms` }}
                        >
                            {/* Accent Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 text-purple-600">
                                        <svg className="w-8 h-8 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Student</p>
                                        <h3 className="font-black text-gray-900 dark:text-white text-xl">{req.student_name}</h3>
                                    </div>
                                </div>
                                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-tighter border border-emerald-500/20">Teacher Verified</span>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Departure</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white">{new Date(req.leave_date).toLocaleDateString()} at {req.leave_time}</span>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                                    <p className="text-[10px] font-black text-purple-400 dark:text-purple-500 uppercase tracking-widest mb-2">Reason for Leave</p>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 italic leading-relaxed">"{req.reason}"</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => updateRequest(req.id, 'Parent_Approved')} 
                                    className="bg-purple-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-purple-700 active:scale-[0.98] transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                    CONFIRM
                                </button>
                                <button 
                                    onClick={() => updateRequest(req.id, 'Rejected')} 
                                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-2xl font-black text-sm hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-[0.98] transition-all"
                                >
                                    REJECT
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
