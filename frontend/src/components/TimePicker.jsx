import React, { useState, useEffect, useRef } from 'react';

const TimePicker = ({ value, onChange, name, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hour, setHour] = useState('12');
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState('AM');
    const pickerRef = useRef(null);
    const hourScrollRef = useRef(null);
    const minuteScrollRef = useRef(null);

    // Parse incoming value (HH:MM) to 12h format
    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':');
            let hh = parseInt(h);
            const p = hh >= 12 ? 'PM' : 'AM';
            hh = hh % 12 || 12;
            setHour(String(hh).padStart(2, '0'));
            setMinute(m || '00');
            setPeriod(p);
        }
    }, [value]);

    // Handle scroll to selected value when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (hourScrollRef.current) {
                    const selectedHour = hourScrollRef.current.querySelector('[data-selected="true"]');
                    if (selectedHour) selectedHour.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
                if (minuteScrollRef.current) {
                    const selectedMinute = minuteScrollRef.current.querySelector('[data-selected="true"]');
                    if (selectedMinute) selectedMinute.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateTime = (newHour, newMinute, newPeriod) => {
        let h24 = parseInt(newHour);
        if (newPeriod === 'PM' && h24 < 12) h24 += 12;
        if (newPeriod === 'AM' && h24 === 12) h24 = 0;
        const formattedValue = `${String(h24).padStart(2, '0')}:${newMinute}`;
        onChange({ target: { name, value: formattedValue } });
    };

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const allMinutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    return (
        <div className="relative space-y-2" ref={pickerRef}>
            {label && <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl transition-all font-medium cursor-pointer flex justify-between items-center ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white text-lg font-bold">{hour}:{minute}</span>
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-black tracking-widest uppercase">{period}</span>
                </div>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
            </div>

            {isOpen && (
                <div className="absolute z-[100] mt-2 p-2 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-2 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                    <div className="flex gap-1 p-2">
                        {/* Hours */}
                        <div className="flex flex-col h-64 w-16 overflow-y-auto no-scrollbar scroll-smooth p-1" ref={hourScrollRef}>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center sticky top-0 bg-white dark:bg-gray-900 py-1 z-10">Hour</p>
                            {hours.map(h => (
                                <button
                                    key={h}
                                    type="button"
                                    data-selected={hour === h}
                                    onClick={() => { setHour(h); updateTime(h, minute, period); }}
                                    className={`flex-shrink-0 w-full py-3 rounded-xl text-sm font-black transition-all mb-1 ${hour === h ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                        
                        {/* Minutes */}
                        <div className="flex flex-col h-64 w-16 overflow-y-auto no-scrollbar scroll-smooth p-1" ref={minuteScrollRef}>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center sticky top-0 bg-white dark:bg-gray-900 py-1 z-10">Min</p>
                            {allMinutes.map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    data-selected={minute === m}
                                    onClick={() => { setMinute(m); updateTime(hour, m, period); }}
                                    className={`flex-shrink-0 w-full py-3 rounded-xl text-sm font-black transition-all mb-1 ${minute === m ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {/* Period */}
                        <div className="flex flex-col h-64 w-20 p-1 border-l border-gray-100 dark:border-gray-800 pl-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Period</p>
                            <div className="flex flex-col gap-2">
                                {['AM', 'PM'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => { setPeriod(p); updateTime(hour, minute, p); }}
                                        className={`w-full py-4 rounded-xl text-xs font-black tracking-widest transition-all ${period === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="mt-auto bg-gray-900 dark:bg-white dark:text-gray-900 text-white w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
        </div>
    );
};

export default TimePicker;
