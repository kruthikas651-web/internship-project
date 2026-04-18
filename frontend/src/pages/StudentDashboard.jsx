import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import API from '../api';
import TimePicker from '../components/TimePicker';

export default function StudentDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [form, setForm] = useState({ reason: '', leave_date: '', leave_time: '' });
    const [msg, setMsg] = useState({ text: '', type: '' });

    const fetchRequests = async () => {
        try {
            const res = await API.get('/requests');
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };

    useEffect(() => {
        if (user) fetchRequests();
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submitRequest = async (e) => {
        e.preventDefault();
        setMsg({ text: '', type: '' });
        try {
            await API.post('/requests', form);
            setMsg({ text: 'Request submitted successfully!', type: 'success' });
            setForm({ reason: '', leave_date: '', leave_time: '' });
            fetchRequests();
        } catch (err) {
            setMsg({ text: err.response?.data?.message || 'Error submitting request', type: 'error' });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Form Section */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">New Exit Request</h2>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Fill in the details for your campus exit</p>
                    </div>
                </div>

                {msg.text && (
                    <div className={`p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-bold animate-in zoom-in duration-300 ${msg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-l-4 border-emerald-500' : 'bg-red-50 dark:bg-red-900/20 text-red-600 border-l-4 border-red-500'}`}>
                        {msg.type === 'success' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        {msg.text}
                    </div>
                )}

                <form onSubmit={submitRequest} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Leave Date</label>
                        <input type="date" name="leave_date" value={form.leave_date} onChange={handleChange} required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent dark:text-white rounded-2xl focus:border-blue-500 outline-none transition-all font-medium" />
                    </div>
                    <TimePicker 
                        label="Leave Time" 
                        name="leave_time" 
                        value={form.leave_time} 
                        onChange={handleChange} 
                    />
                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Reason for Exit</label>
                        <input type="text" name="reason" placeholder="e.g. Medical emergency, Family visit..." value={form.reason} onChange={handleChange} required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent dark:text-white rounded-2xl focus:border-blue-500 outline-none transition-all font-medium" />
                    </div>
                    <button type="submit" className="lg:col-span-3 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/25">SUBMIT REQUEST</button>
                </form>
            </div>

            {/* Requests Section */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800 animate-fade-in-up delay-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Request History</h2>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Track the status of your permissions</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {requests.length === 0 ? (
                        <div className="col-span-full py-12 text-center">
                            <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-bold">No exit requests found.</p>
                        </div>
                    ) : null}
                    
                    {requests.map(req => (
                        <div key={req.id} className="group relative p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden hover:-translate-y-1 animate-fade-in-up">
                            {/* Status Accent Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${req.status === 'Exited' ? 'bg-blue-500' : req.status === 'Parent_Approved' ? 'bg-emerald-500' : req.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Departure Details</p>
                                    <h3 className="font-black text-gray-900 dark:text-white text-lg">{new Date(req.leave_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                                        {(() => {
                                            const [h, m] = req.leave_time.split(':');
                                            const hh = parseInt(h);
                                            const ampm = hh >= 12 ? 'PM' : 'AM';
                                            const h12 = hh % 12 || 12;
                                            return `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
                                        })()}
                                    </p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-[0.15em] border ${req.status === 'Exited' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-500/20' : req.status === 'Parent_Approved' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-500/20' : req.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-500/20' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-500/20'}`}>
                                    {req.status.replace('_', ' ')}
                                </span>
                            </div>

                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Reason</p>
                            <p className="text-gray-700 dark:text-gray-300 font-bold italic line-clamp-2">"{req.reason}"</p>

                            {req.token_hash && req.status === 'Parent_Approved' && (
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/50 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                    <div className="bg-white p-3 rounded-2xl shadow-inner border-4 border-gray-50">
                                        <QRCodeSVG value={req.token_hash} size={110} />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mt-4 uppercase tracking-[0.2em]">Show this at Gate</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
