import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import QrScanner from '../components/QrScanner';

export default function SecurityDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [qrData, setQrData] = useState('');
    const [result, setResult] = useState(null);

    const handleScan = async (scannedData = qrData) => {
        setResult(null);
        if (!scannedData) return;
        try {
            // Always use 'Exit' as per user request
            const res = await API.post('/qr/scan', { qrData: scannedData, scanType: 'Exit' });
            setResult({ type: 'success', msg: res.data.message, student: res.data.studentName });
            setQrData('');
        } catch (err) {
            setResult({ 
                type: err.response?.data?.status === 'Fraud_Attempt' ? 'fraud' : 'error', 
                msg: err.response?.data?.message || 'Verification Failed' 
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Scanner Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-red-500/5 border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4" /></svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Active Scanner</h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Place QR code within the frame</p>
                        </div>
                    </div>

                    <div className="mb-10 overflow-hidden rounded-[2rem] ring-4 ring-gray-100 dark:ring-gray-800/50">
                        <QrScanner onScanSuccess={(data) => handleScan(data)} />
                    </div>

                    {/* Manual Input */}
                    <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="flex-grow h-px bg-gray-100 dark:bg-gray-800"></div>
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Manual Entry Backup</span>
                            <div className="flex-grow h-px bg-gray-100 dark:bg-gray-800"></div>
                        </div>
                        
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                placeholder="Enter QR Token Hash..." 
                                value={qrData}
                                onChange={(e) => setQrData(e.target.value)}
                                className="flex-grow px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent dark:text-white rounded-2xl focus:border-red-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-mono text-sm" 
                            />
                            <button 
                                onClick={() => handleScan()}
                                className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 hover:bg-red-700 active:scale-95 transition-all"
                            >
                                SCAN
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Dashboard */}
                <div className="space-y-6 animate-fade-in-up delay-100">
                    {!result ? (
                        <div className="bg-white dark:bg-gray-900 p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Waiting for Scan...</h3>
                            <p className="text-gray-400 dark:text-gray-600 mt-2 font-medium">Results will appear here in real-time</p>
                        </div>
                    ) : (
                        <div className={`p-10 rounded-[2.5rem] border-4 animate-in zoom-in duration-500 h-full min-h-[400px] flex flex-col justify-center
                            ${result.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/20 text-emerald-900 dark:text-emerald-100' : 
                              result.type === 'fraud' ? 'bg-red-50 dark:bg-red-950/20 border-red-500/20 text-red-900 dark:text-red-100' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-500/20 text-amber-900 dark:text-amber-100'}`}>
                            
                            <div className="flex flex-col items-center text-center gap-8">
                                <div className={`p-6 rounded-[2rem] shadow-2xl ${result.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/40' : result.type === 'fraud' ? 'bg-red-500 shadow-red-500/40' : 'bg-amber-500 shadow-amber-500/40'}`}>
                                    {result.type === 'success' ? (
                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-black text-4xl tracking-tight leading-tight">{result.msg}</h3>
                                    {result.student && (
                                        <div className="inline-block px-6 py-3 bg-white/50 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-black/5 dark:border-white/5">
                                            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-1">Student Identity</p>
                                            <p className="text-2xl font-black tracking-tight">{result.student}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <button onClick={() => setResult(null)} className="mt-4 px-6 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                                    Clear Result
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
