import { useState, useCallback, useEffect } from 'react';

interface VoiceInterfaceProps {
  onTranscript: (text: string) => void;
  lang: string;
}

export function useVoice(lang: string, languageName?: string, voiceKeywords: string[] = []) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Debug: Log available voices
  useEffect(() => {
    const logVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log(`Available voices (${voices.length}):`, voices.map(v => `${v.name} (${v.lang})`));
    };
    if (window.speechSynthesis) {
      logVoices();
      window.speechSynthesis.onvoiceschanged = logVoices;
    }
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const targetLang = lang.toLowerCase().replace('_', '-');
      const targetPrefix = targetLang.split('-')[0];
      const targetName = languageName?.toLowerCase() || '';

      console.log(`Searching for voice: lang=${targetLang}, name=${targetName}, keywords=[${voiceKeywords.join(', ')}]`);

      // 1. Try exact match on lang
      let voice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLang);
      
      // 2. Try matching by keywords in voice name or lang
      if (!voice && voiceKeywords.length > 0) {
        voice = voices.find(v => 
          voiceKeywords.some(kw => 
            v.name.toLowerCase().includes(kw.toLowerCase()) || 
            v.lang.toLowerCase().includes(kw.toLowerCase())
          )
        );
      }

      // 3. Try prefix match on lang (e.g., 'te' for 'te-IN')
      if (!voice) {
        voice = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));
      }

      // 4. Try searching for language name in voice name (e.g., "Telugu" in "Google Telugu")
      if (!voice && targetName) {
        voice = voices.find(v => v.name.toLowerCase().includes(targetName));
      }
      
      if (voice) {
        console.log(`Found voice: ${voice.name} (${voice.lang})`);
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        console.warn(`No specific voice found for ${languageName || lang}. Using default.`);
        utterance.lang = lang;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => {
        console.error('SpeechSynthesis Error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      // Even if some voices exist, the specific language voice might still be loading
      const currentVoices = window.speechSynthesis.getVoices();
      const hasTarget = currentVoices.some(v => 
        v.lang.toLowerCase().replace('_', '-').startsWith(lang.toLowerCase().split('-')[0])
      );

      if (!hasTarget) {
        const originalOnVoicesChanged = window.speechSynthesis.onvoiceschanged;
        window.speechSynthesis.onvoiceschanged = (e) => {
          setVoiceAndSpeak();
          if (originalOnVoicesChanged) originalOnVoicesChanged.call(window.speechSynthesis, e);
          window.speechSynthesis.onvoiceschanged = originalOnVoicesChanged;
        };
        // Also try to speak immediately in case it never fires
        setVoiceAndSpeak();
      } else {
        setVoiceAndSpeak();
      }
    }
  }, [lang]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback((onFinal: (text: string) => void, onInterim?: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onFinal(finalTranscript);
        setTranscript('');
      } else if (onInterim) {
        onInterim(interimTranscript);
        setTranscript(interimTranscript);
      } else {
        setTranscript(interimTranscript);
      }
    };

    recognition.start();
  }, [lang]);

  return { isListening, isSpeaking, transcript, error, speak, stopSpeaking, startListening };
}
