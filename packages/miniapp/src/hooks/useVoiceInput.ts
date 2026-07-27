'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceInputOptions {
  lang?: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

interface SpeechRecognitionType {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionType;
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
  }
}

export function useVoiceInput(options: VoiceInputOptions = {}) {
  const { lang = 'uz-UZ', onResult, onError } = options;
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [mode, setMode] = useState<'speech' | 'recording' | 'none'>('none');
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  onResultRef.current = onResult;
  onErrorRef.current = onError;

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const MR = typeof MediaRecorder !== 'undefined';
    setIsSupported(!!SR || MR);
    setMode(!!SR ? 'speech' : MR ? 'recording' : 'none');
  }, []);

  const stopAll = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
      mediaRecorderRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startSpeechRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      onErrorRef.current?.('Web Speech API qo\'llab-quvvatlanmaydi');
      return;
    }

    stopAll();

    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setInterimTranscript('');
        onResultRef.current?.(final.trim());
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') return;
      const errorMap: Record<string, string> = {
        'no-speech': 'Ovoz eshitilmadi',
        'audio-capture': 'Mikrofon topilmadi',
        'not-allowed': 'Mikrofon ruxsati berilmadi',
        'network': 'Tarmoq xatoligi',
      };
      onErrorRef.current?.(errorMap[event.error] || 'Xatolik: ' + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      onErrorRef.current?.('Ovozli kiritishni boshlab bo\'lmadi');
      setIsListening(false);
    }
  }, [lang, stopAll]);

  const startMediaRecording = useCallback(async () => {
    stopAll();
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        setIsListening(false);

        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            onResultRef.current?.(`[AUDIO_BASE64:${base64}]`);
          };
          reader.readAsDataURL(blob);
        }
        audioChunksRef.current = [];
      };

      recorder.onerror = () => {
        stream.getTracks().forEach(t => t.stop());
        setIsListening(false);
        onErrorRef.current?.('Yozish xatoligi');
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
      setInterimTranscript('Yozilmoqda...');
    } catch (e: any) {
      if (e.name === 'NotAllowedError') {
        onErrorRef.current?.('Mikrofon ruxsati berilmadi');
      } else {
        onErrorRef.current?.('Mikrofon topilmadi');
      }
      setIsListening(false);
    }
  }, [stopAll]);

  const startListening = useCallback(() => {
    if (mode === 'speech') {
      startSpeechRecognition();
    } else {
      startMediaRecording();
    }
  }, [mode, startSpeechRecognition, startMediaRecording]);

  const stopListening = useCallback(() => {
    stopAll();
  }, [stopAll]);

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  return {
    isListening,
    interimTranscript,
    isSupported,
    mode,
    startListening,
    stopListening,
  };
}
