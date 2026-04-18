/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Smartphone, 
  ShieldCheck, 
  Terminal as TerminalIcon, 
  Mail, 
  Key, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Loader2,
  Lock
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { cn } from './lib/utils';

// Initialize EmailJS
emailjs.init("CHv9O8LgL_hNKcbK-");

type Page = 'intro' | 'company' | 'form' | 'otp' | 'key' | 'console' | 'success';

interface FormData {
  phone: string;
  email: string;
  imei: string;
  company: string;
  phoneModel: string;
}

const COMPANIES = [
  { name: 'MKOPA', color: 'bg-green-700' },
  { name: 'WATU CREDIT', color: 'bg-blue-700' },
  { name: 'DLIGHT KENYA', color: 'bg-teal-700' },
  { name: 'SAFARICOM', color: 'bg-green-800' },
  { name: 'AIRTEL KENYA', color: 'bg-red-700' },
  { name: 'SUNKING', color: 'bg-yellow-600' },
  { name: 'ONFON', color: 'bg-purple-700' },
  { name: 'ALL VIVO', color: 'bg-cyan-600' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('intro');
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    email: '',
    imei: '',
    company: '',
    phoneModel: '',
  });
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [rebootKey, setRebootKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('CONNECTING...');
  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (formData.phone.length !== 10 || !formData.phone.startsWith('0')) {
      newErrors.phone = '10 digits required starting with 0.';
    }
    if (!formData.email?.includes('@')) {
      newErrors.email = 'Valid email required.';
    }
    if (formData.imei.length !== 15) {
      newErrors.imei = 'Exactly 15 digits required.';
    }
    if (!formData.phoneModel.trim()) {
      newErrors.phoneModel = 'Phone model is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setLoadingText('SENDING SECURE OTP...');

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);

    try {
      await emailjs.send('service_iuvmzx8', 'template_0s2sydx', {
        email: formData.email,
        OTP: generatedOtp,
        time: new Date().toLocaleTimeString(),
        brand: formData.company
      });
      setCurrentPage('otp');
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Failed to send OTP. Please check your configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = () => {
    if (otp === sentOtp) {
      setCurrentPage('key');
    } else {
      alert('INVALID OTP CODE.');
    }
  };

  const checkKey = () => {
    if (rebootKey.toUpperCase() === 'DEE') {
      startUnlockProcess();
    } else {
      alert('INVALID REBOOT KEY.');
      window.open("https://wa.me/254739320033", "_blank");
    }
  };

  const startUnlockProcess = () => {
    setCurrentPage('console');
    const processLogs = [
      "INITIALIZING CYBERION SPARK-X PRO...",
      "------------------------------------",
      "DEVICE INFO SCANNED:",
      `> COMPANY: ${formData.company}`,
      `> PHONE  : ${formData.phone}`,
      `> EMAIL  : ${formData.email}`,
      `> IMEI   : ${formData.imei}`,
      `> MODEL  : ${formData.phoneModel}`,
      "------------------------------------",
      "Establishing Bootloader Tunnel...",
      "Status: CONNECTION SECURE",
      "Decrypting Knox Partition...",
      `Bypassing ${formData.company} MDM Policy...`,
      "Injecting Payload to Kernel...",
      "Removing Remote Lock IDs...",
      "Wiping Security Flags...",
      "Rebuilding System UI...",
      "Cleaning Cache...",
      "------------------------------------",
      "REBOOTING DEVICE...",
      "SUCCESS: DEVICE PERMANENTLY UNLOCKED!"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < processLogs.length) {
        setLogs(prev => [...prev, processLogs[i]]);
        i++;
      }
      if (i >= processLogs.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentPage('success');
        }, 1500);
      }
    }, 800);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/254739320033", "_blank");
  };

  return (
    <div className="min-h-screen bg-[#1a237e] text-white font-sans selection:bg-cyan-500/30">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/90 flex flex-col items-center justify-center"
          >
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="mt-4 text-blue-500 font-bold tracking-widest">{loadingText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Button */}
      <button 
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-[999] bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95"
      >
        <MessageSquare className="w-5 h-5" />
        Contact Me
      </button>

      <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gray-200 text-black py-4 px-6 text-center font-bold uppercase tracking-tighter shadow-xl z-10">
          {currentPage === 'intro' ? 'Credit Phone Unlock Software' : 
           currentPage === 'company' ? 'Choose Company' :
           currentPage === 'form' ? `${formData.company} Data Entry` :
           currentPage === 'otp' ? 'Email Verification' :
           currentPage === 'key' ? 'Security Verification' : 'System Console'}
        </header>

        <main className="flex-1 flex flex-col items-center p-6">
          <AnimatePresence mode="wait">
            {currentPage === 'intro' && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center text-center"
              >
                <div className="w-full h-48 bg-gradient-to-b from-black to-blue-900 rounded-xl flex items-center justify-center mb-8 overflow-hidden relative">
                  <motion.div 
                    animate={{ 
                      boxShadow: ["0 0 20px rgba(0,255,255,0.5)", "0 0 50px rgba(0,255,255,0.8)", "0 0 20px rgba(0,255,255,0.5)"],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 bg-black rounded-full border-4 border-cyan-400 flex items-center justify-center text-5xl"
                  >
                    🤖
                  </motion.div>
                </div>

                <h2 className="text-2xl font-black text-blue-400 uppercase mb-4">Simplicity of the Robot</h2>
                <div className="bg-blue-600 px-6 py-2 font-bold rounded mb-6 shadow-lg">
                  10 - 15 MINUTES TO UNLOCK
                </div>
                
                <div className="text-xs font-mono text-cyan-400 border border-cyan-900/50 bg-black/30 px-3 py-1 rounded mb-6">
                  DETECTED: ANDROID 14 SYSTEM (READY)
                </div>

                <p className="text-gray-300 mb-8 leading-relaxed">
                  Advanced firmware bypass for credit-locked Android smartphones. 
                  Secure, fast, and permanent solution.
                </p>

                <button 
                  onClick={() => setCurrentPage('company')}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded font-bold uppercase tracking-widest transition-colors active:scale-[0.98]"
                >
                  Proceed
                </button>
              </motion.div>
            )}

            {currentPage === 'company' && (
              <motion.div 
                key="company"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full grid grid-cols-2 gap-4"
              >
                {COMPANIES.map((company) => (
                  <button
                    key={company.name}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, company: company.name }));
                      setCurrentPage('form');
                    }}
                    className={cn(
                      "py-6 rounded font-bold uppercase tracking-tight shadow-lg transition-all hover:brightness-110 active:scale-95",
                      company.color
                    )}
                  >
                    {company.name}
                  </button>
                ))}
              </motion.div>
            )}

            {currentPage === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="tel"
                      placeholder="07..."
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-black/20 border-b-2 border-gray-600 focus:border-blue-500 p-4 pl-12 text-lg outline-none transition-colors"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-black/20 border-b-2 border-gray-600 focus:border-blue-500 p-4 pl-12 text-lg outline-none transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Model</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text"
                      placeholder="e.g. Tecno, Samsung, Nokia..."
                      value={formData.phoneModel}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneModel: e.target.value }))}
                      className="w-full bg-black/20 border-b-2 border-gray-600 focus:border-blue-500 p-4 pl-12 text-lg outline-none transition-colors"
                    />
                  </div>
                  {errors.phoneModel && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phoneModel}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IMEI Code</label>
                  <div className="relative">
                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text"
                      placeholder="35..."
                      maxLength={15}
                      value={formData.imei}
                      onChange={(e) => setFormData(prev => ({ ...prev, imei: e.target.value.replace(/\D/g, '') }))}
                      className="w-full bg-black/20 border-b-2 border-gray-600 focus:border-blue-500 p-4 pl-12 text-lg outline-none transition-colors"
                    />
                  </div>
                  {errors.imei && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.imei}</p>}
                </div>

                <button 
                  onClick={sendOtp}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  Send Verification Code
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {currentPage === 'otp' && (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full text-center space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-black text-blue-400 uppercase mb-2">Verify Code</h2>
                  <p className="text-gray-400 text-sm">Enter the 6-digit OTP sent to your email.</p>
                </div>

                <input 
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent border-b-2 border-cyan-500 text-center text-5xl tracking-[0.5em] py-4 outline-none font-mono"
                />

                <button 
                  onClick={verifyOtp}
                  className="w-full bg-teal-600 hover:bg-teal-500 py-4 rounded font-bold uppercase tracking-widest transition-colors"
                >
                  Verify Code
                </button>
              </motion.div>
            )}

            {currentPage === 'key' && (
              <motion.div 
                key="key"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full text-center space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-black text-blue-400 uppercase mb-2">Enter Reboot Key</h2>
                  <p className="text-gray-400 text-sm">Security verification required to proceed.</p>
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                  <input 
                    type="password"
                    placeholder="Enter Admin Key"
                    value={rebootKey}
                    onChange={(e) => setRebootKey(e.target.value)}
                    className="w-full bg-black/20 border-b-2 border-gray-600 focus:border-green-500 p-6 pl-14 text-center text-2xl outline-none transition-colors font-mono"
                  />
                </div>

                <button 
                  onClick={checkKey}
                  className="w-full bg-green-700 hover:bg-green-600 py-4 rounded font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Unlock Now
                </button>
              </motion.div>
            )}

            {currentPage === 'console' && (
              <motion.div 
                key="console"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-[60vh] bg-black border-2 border-gray-800 rounded p-4 font-mono text-sm overflow-y-auto shadow-inner"
              >
                <div className="space-y-2">
                  {logs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "flex gap-2",
                        log?.includes("SUCCESS") ? "text-yellow-400 font-bold" : "text-green-500"
                      )}
                    >
                      <span className="opacity-50">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span>{log?.startsWith('>>') ? log : `>> ${log}`}</span>
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </motion.div>
            )}

            {currentPage === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-white text-black p-8 font-sans overflow-y-auto z-[3000]"
              >
                <div className="max-w-md mx-auto">
                  <h1 className="text-xl font-bold border-b border-gray-200 pb-4 mb-8 uppercase tracking-tight">
                    Unlock Successfully Rooted Out
                  </h1>
                  
                  <div className="space-y-1 text-[15px] leading-relaxed font-medium">
                    <p>IMEI:{formData.imei}/01</p>
                    <p>IMEI:{formData.imei.slice(0, -2) + "164"}/01</p>
                    <p>SN:R92FR6001TS</p>
                    <p>TA-1604F/DS®</p>
                    <p>C++Syntax {formData.company} Inc.</p>
                    <p>{formData.phoneModel} A 06 Module ®©°°.</p>
                    <p>Uncoding successful.</p>
                    <p>go to =if(h°g°y:yy:665")¤¤ module</p>
                    <p>Tracker removed successfully.</p>
                    <p>plan.http"umm:%C++mode</p>
                    <p>@https//cyber security#° {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    <p>{new Date().toLocaleDateString('en-GB')}. LCD Software°°™</p>
                    <p>Customer daily payment deactivated.</p>
                    <p>https//chain crack software.</p>
                    <p>Microsoft {formData.company} Inc.</p>
                  </div>

                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-12 w-full border border-black py-3 font-bold uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    Finish
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer Info */}
        <footer className="p-6 text-center text-[10px] text-gray-500 uppercase tracking-widest opacity-50">
          Cyberion Spark-X Advanced Pro • Secure Firmware Tunnel v4.2.0
        </footer>
      </div>
    </div>
  );
}
