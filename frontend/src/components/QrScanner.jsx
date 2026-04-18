import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = ({ onScanSuccess }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const qrScannerRef = useRef(null);
    const scanProcessed = useRef(false);

    const playBeep = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.2);
        } catch (e) {
            console.warn("Could not play beep", e);
        }
    };

    const startScanner = async () => {
        // Prevent double-initialization
        if (qrScannerRef.current?.isScanning) return;
        scanProcessed.current = false;
        
        try {
            // Small delay to ensure previous instance is fully released by OS/Browser
            await new Promise(r => setTimeout(r, 200));
            
            const html5QrCode = new Html5Qrcode("scanner-video");
            qrScannerRef.current = html5QrCode;

            const config = { fps: 15, qrbox: { width: 250, height: 250 } };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    if (scanProcessed.current) return;
                    scanProcessed.current = true;
                    playBeep();
                    onScanSuccess(decodedText);
                    stopScanner();
                },
                () => { /* No-op for scan attempt failures */ }
            );
            setIsScanning(true);
            setError(null);
        } catch (err) {
            console.error("Camera start error", err);
            // Only set error if we are still mounted
            setError("Cannot access camera. Please ensure permissions are granted and no other app is using it.");
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (qrScannerRef.current) {
            try {
                if (qrScannerRef.current.isScanning) {
                    await qrScannerRef.current.stop();
                    // Clear the element to be safe
                    qrScannerRef.current.clear();
                }
                setIsScanning(false);
            } catch (err) {
                console.warn("Failed to stop scanner cleanly", err);
            }
        }
    };

    useEffect(() => {
        let mounted = true;
        if (mounted) startScanner();
        
        return () => {
            mounted = false;
            stopScanner();
        };
    }, []);

    return (
        <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-black shadow-2xl border-4 border-gray-800">
            {/* Video Feed */}
            <div id="scanner-video" className="w-full aspect-square bg-gray-900 overflow-hidden"></div>

            {/* Custom Overlay */}
            {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-blue-400 opacity-60 rounded-lg relative">
                        {/* Shimmering Scan Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-line"></div>
                        
                        {/* Brackets */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-sm"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-sm"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-sm"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-sm"></div>
                    </div>
                </div>
            )}

            {/* State Buttons & Messages */}
            {!isScanning && !error && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-blue-500 transition" onClick={startScanner}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <p className="text-white font-bold text-lg">Scan Complete</p>
                    <button onClick={startScanner} className="mt-2 text-blue-400 font-semibold hover:underline">Tap to Scan Again</button>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-white font-bold mb-4">{error}</p>
                    <button onClick={startScanner} className="px-6 py-2 bg-white text-red-600 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">Try Again</button>
                </div>
            )}

            {/* Status Footer */}
            {isScanning && (
                <div className="absolute bottom-4 left-0 w-full flex justify-center">
                    <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-black tracking-widest uppercase">Live Camera Feed</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QrScanner;
