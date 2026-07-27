'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function VoiceButton({ onTranscript, onError, size = 'md', className = '' }: VoiceButtonProps) {
  const {
    isListening,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceInput({
    lang: 'uz-UZ',
    onResult: (text) => {
      onTranscript(text);
      hapticFeedback();
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  const hapticFeedback = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  const toggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) return null;

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = { sm: 14, md: 20, lg: 26 };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {isListening && interimTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 glass-card px-3 py-2 text-xs text-gray-300 whitespace-nowrap max-w-[200px] truncate"
          >
            {interimTranscript}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggle}
        className={`${sizes[size]} rounded-full flex items-center justify-center transition-all duration-200 ${
          isListening
            ? 'bg-[#ff6b6b] text-white shadow-lg shadow-[#ff6b6b]/30'
            : 'bg-[#00d68f]/20 text-[#00d68f] active:scale-95'
        }`}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <MicOff size={iconSizes[size]} />
          </motion.div>
        ) : (
          <Mic size={iconSizes[size]} />
        )}
      </button>

      <AnimatePresence>
        {isListening && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-[#ff6b6b]/40"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.4,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
