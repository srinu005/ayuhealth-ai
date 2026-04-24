import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Send, 
  User, 
  MapPin, 
  Calendar, 
  Languages,
  Stethoscope, 
  ChevronRight,
  RefreshCw,
  Volume2,
  VolumeX,
  Heart
} from 'lucide-react';
import { cn } from './lib/utils';
import { LANGUAGES, Language } from './constants/languages';
import { analyzeSymptoms } from './services/gemini';
import { useVoice } from './components/VoiceInterface';

type Step = 'welcome' | 'gender' | 'age' | 'location' | 'language' | 'symptoms' | 'result';

interface UserProfile {
  gender: string;
  age: string;
  location: string;
  language: Language;
}

export default function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [profile, setProfile] = useState<UserProfile>({
    gender: '',
    age: '',
    location: '',
    language: LANGUAGES[0], // Default to English
  });
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isListening, isSpeaking, transcript, speak, stopSpeaking, startListening } = useVoice(
    profile.language.bcp47, 
    profile.language.name,
    profile.language.voiceKeywords
  );
  const hasSpokenIntro = useRef(false);
  const hasSpokenGreeting = useRef(false);

  // Handle Intro Speech
  useEffect(() => {
    if (step === 'welcome' && !hasSpokenIntro.current && !isMuted) {
      speak("Hello, I am your Medical AI Agent. I am here to help you with your health concerns. Let's start with a few questions.");
      hasSpokenIntro.current = true;
    }
  }, [step, speak, isMuted]);

  useEffect(() => {
    if (step === 'symptoms' && !hasSpokenGreeting.current && !isMuted) {
      speak(profile.language.greeting);
      hasSpokenGreeting.current = true;
    }
  }, [step, speak, isMuted, profile.language.greeting]);

  const handleNext = () => {
    if (step === 'welcome') setStep('gender');
    else if (step === 'gender' && profile.gender) setStep('age');
    else if (step === 'age' && profile.age) setStep('location');
    else if (step === 'location' && profile.location) setStep('language');
    else if (step === 'language') setStep('symptoms');
  };

  const handleAnalyze = async () => {
    const finalSymptoms = symptoms + (isListening ? (symptoms ? ' ' : '') + transcript : '');
    if (!finalSymptoms) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSymptoms(finalSymptoms, profile, profile.language.name);
      setAnalysis(result.fullResponse);
      setStep('result');
      if (!isMuted) {
        speak(result.fullResponse);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('welcome');
    setSymptoms('');
    setAnalysis(null);
    hasSpokenIntro.current = false;
    hasSpokenGreeting.current = false;
  };

  const steps = [
    { id: 'gender', label: 'Basic Info', key: 'gender' },
    { id: 'language', label: 'Language Select', key: 'language' },
    { id: 'symptoms', label: 'Symptom Analysis', key: 'symptoms' },
    { id: 'result', label: 'Diagnosis', key: 'result' },
  ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['welcome', 'gender', 'age', 'location', 'language', 'symptoms', 'result'];
    const currentIndex = stepOrder.indexOf(step);
    
    if (stepId === 'gender') {
      if (currentIndex > stepOrder.indexOf('location')) return 'complete';
      if (currentIndex >= stepOrder.indexOf('gender') && currentIndex <= stepOrder.indexOf('location')) return 'active';
    }
    if (stepId === 'language') {
      if (currentIndex > stepOrder.indexOf('language')) return 'complete';
      if (currentIndex === stepOrder.indexOf('language')) return 'active';
    }
    if (stepId === 'symptoms') {
      if (currentIndex > stepOrder.indexOf('symptoms')) return 'complete';
      if (currentIndex === stepOrder.indexOf('symptoms')) return 'active';
    }
    if (stepId === 'result') {
      if (currentIndex === stepOrder.indexOf('result')) return 'active';
    }
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans flex flex-col">
      {/* Header */}
      <header className="h-[72px] bg-surface border-b border-border px-10 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            +
          </div>
          <h1 className="text-xl font-bold text-primary">MediScan AI</h1>
        </div>
        <div className="flex items-center gap-5">
          {step !== 'welcome' && (
            <div className="hidden md:flex items-center gap-2 bg-primary-soft text-primary px-3 py-1.5 rounded-full text-sm font-semibold">
              <Languages className="w-4 h-4" />
              {profile.language.nativeName}
            </div>
          )}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-text-muted" /> : <Volume2 className="w-5 h-5 text-primary" />}
          </button>
          <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-8 gap-8 max-w-[1440px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 w-[320px] shrink-0 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-soft rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-primary">
                <Stethoscope className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-base">Medical AI Agent</h3>
              <p className="text-text-muted text-xs">Online & Active</p>
            </div>

            <div className="space-y-4">
              {steps.map((s, i) => {
                const status = getStepStatus(s.id);
                return (
                  <div key={s.id} className={cn(
                    "flex items-center gap-3 text-sm transition-colors",
                    status === 'active' ? "text-primary font-semibold" : "text-text-muted",
                    status === 'complete' && "text-text-main"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs shrink-0",
                      status === 'active' ? "border-primary bg-primary-soft text-primary" : "border-border",
                      status === 'complete' && "bg-accent-green border-accent-green text-white"
                    )}>
                      {status === 'complete' ? "✓" : i + 1}
                    </div>
                    {s.label}
                  </div>
                );
              })}
            </div>
          </div>

          {(profile.age || profile.gender || profile.location) && (
            <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-2xl p-6 space-y-3">
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-primary">Patient Context</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Age:</strong> {profile.age || '--'} Years</p>
                <p><strong>Gender:</strong> {profile.gender || '--'}</p>
                <p><strong>Location:</strong> {profile.location || '--'}</p>
              </div>
            </div>
          )}

          {/* Voice Status */}
          {step !== 'welcome' && (
            <div className="mt-6 p-4 bg-surface border border-border rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Voice Status</span>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isSpeaking ? "bg-accent-green animate-pulse" : "bg-slate-300"
                )} />
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <Volume2 className="w-4 h-4 text-primary" />
                <span className="text-text-main font-medium">{profile.language.name} Voice</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">
                {window.speechSynthesis.getVoices().some(v => 
                  profile.language.voiceKeywords.some(kw => 
                    v.name.toLowerCase().includes(kw.toLowerCase()) || 
                    v.lang.toLowerCase().includes(kw.toLowerCase())
                  )
                ) ? '✓ High-quality voice found' : '⚠ Using system default voice'}
              </p>
              <button 
                onClick={() => speak(profile.language.greeting)}
                disabled={isSpeaking}
                className="mt-3 w-full py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-primary hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Test Voice
              </button>
            </div>
          )}
        </aside>

        {/* Chat/Content Area */}
        <section className="flex-1 bg-surface border border-border rounded-[20px] shadow-sm flex flex-col overflow-hidden relative">
          <div className="px-8 py-5 border-b border-border flex justify-between items-center shrink-0">
            <h2 className="text-lg font-bold">
              {step === 'welcome' ? 'Welcome' : 'Live Consultation'}
            </h2>
            {step !== 'welcome' && (
              <span className="bg-primary-soft text-primary px-3 py-1.5 rounded-full text-[13px] font-semibold">
                Input/Output: {profile.language.name}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-3 whitespace-pre-wrap">
                <div className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                {error}
              </div>
            )}
            <AnimatePresence mode="wait">
              {step === 'welcome' && (
                <motion.div 
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="w-32 h-32 bg-primary-soft rounded-3xl flex items-center justify-center border border-primary/10">
                    <Stethoscope className="w-16 h-16 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-extrabold text-text-main leading-tight">
                      Hello, I am your <span className="text-primary">Medical AI Agent</span>
                    </h2>
                    <p className="text-lg text-text-muted max-w-md mx-auto">
                      I can help analyze your symptoms and provide preliminary guidance in your preferred language.
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="group flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Get Started
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {(['gender', 'age', 'location', 'language'] as Step[]).includes(step) && (
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-xl mx-auto w-full space-y-8 py-10"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-text-main">
                      {step === 'gender' && "What is your gender?"}
                      {step === 'age' && "How old are you?"}
                      {step === 'location' && "Where are you located?"}
                      {step === 'language' && "Select your language"}
                    </h2>
                  </div>

                  <div className="grid gap-4">
                    {step === 'gender' && (
                      <div className="grid grid-cols-2 gap-4">
                        {['Male', 'Female', 'Other'].map((g) => (
                          <button
                            key={g}
                            onClick={() => setProfile({ ...profile, gender: g })}
                            className={cn(
                              "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                              profile.gender === g 
                                ? "border-primary bg-primary-soft text-primary" 
                                : "border-border bg-white hover:border-slate-300"
                            )}
                          >
                            <User className="w-8 h-8" />
                            <span className="font-semibold">{g}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 'age' && (
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-6 h-6" />
                        <input 
                          type="number"
                          placeholder="Enter your age"
                          value={profile.age}
                          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                          className="w-full p-6 pl-14 rounded-xl border border-border focus:border-primary outline-none transition-all text-xl font-medium"
                        />
                      </div>
                    )}

                    {step === 'location' && (
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-6 h-6" />
                        <input 
                          type="text"
                          placeholder="e.g. Mumbai, India"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full p-6 pl-14 rounded-xl border border-border focus:border-primary outline-none transition-all text-xl font-medium"
                        />
                      </div>
                    )}

                    {step === 'language' && (
                      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setProfile({ ...profile, language: lang })}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all text-left flex flex-col",
                              profile.language.code === lang.code 
                                ? "border-primary bg-primary-soft" 
                                : "border-border bg-white hover:border-slate-300"
                            )}
                          >
                            <span className="font-bold text-text-main">{lang.nativeName}</span>
                            <span className="text-sm text-text-muted">{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleNext}
                    disabled={
                      (step === 'gender' && !profile.gender) ||
                      (step === 'age' && !profile.age) ||
                      (step === 'location' && !profile.location)
                    }
                    className="w-full bg-primary text-white p-5 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 'symptoms' && (
                <motion.div 
                  key="symptoms"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6"
                >
                  <div className="max-w-[80%] p-5 rounded-2xl bg-primary-soft text-text-main self-start rounded-bl-none">
                    {profile.language.greeting}
                  </div>
                  {symptoms && (
                    <div className="max-w-[80%] p-5 rounded-2xl bg-primary text-white self-end rounded-br-none">
                      {symptoms}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'result' && analysis && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6"
                >
                  <div className="max-w-[80%] p-5 rounded-2xl bg-primary-soft text-text-main self-start rounded-bl-none space-y-4 relative">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-accent-green mb-2">Diagnosis & Treatment Plan</div>
                      {isSpeaking && (
                        <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-full border border-primary/10">
                          <div className="flex gap-0.5 items-end h-3">
                            <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-primary" />
                            <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-primary" />
                            <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-primary" />
                          </div>
                          <span className="text-[10px] font-bold text-primary uppercase">Speaking</span>
                        </div>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {analysis}
                    </div>
                    <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-6 rounded-xl mt-4">
                      <div className="text-sm italic text-text-muted">
                        {profile.language.closing}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          {step === 'symptoms' && (
            <div className="p-8 border-t border-border flex flex-col gap-4 shrink-0 bg-surface">
              <div className="flex-1 relative">
                <textarea
                  value={symptoms + (isListening ? (symptoms ? ' ' : '') + transcript : '')}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms here or use voice..."
                  className="w-full min-h-[120px] p-4 border border-border rounded-xl outline-none focus:border-primary transition-all resize-none custom-scrollbar"
                />
                {isListening && (
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Listening</span>
                  </div>
                )}
              </div>
              <div className="flex gap-4 items-center">
                <button 
                  onClick={() => startListening((text) => setSymptoms(prev => (prev ? prev + " " + text : text)))}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 shadow-md",
                    isListening ? "bg-red-500 text-white" : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button 
                  onClick={handleAnalyze}
                  disabled={!symptoms || isLoading}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
                </button>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="p-8 border-t border-border flex gap-4 shrink-0 bg-surface">
              <button 
                onClick={() => isSpeaking ? stopSpeaking() : speak(analysis!)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-bold transition-all shadow-md",
                  isSpeaking 
                    ? "bg-red-500 text-white hover:bg-red-600" 
                    : "bg-primary-soft text-primary hover:bg-primary-soft/80"
                )}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                {isSpeaking ? 'Stop Reading' : 'Listen to Diagnosis'}
              </button>
              <button 
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-text-muted p-4 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-sm"
              >
                <RefreshCw className="w-5 h-5" />
                New Analysis
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="h-10 bg-surface border-t border-border flex items-center justify-center text-xs text-text-muted shrink-0">
        &copy; 2024 MNC Healthcare AI Systems. All diagnostic data is encrypted and secure.
      </footer>
    </div>
  );
}
