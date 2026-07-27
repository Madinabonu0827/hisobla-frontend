'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-[#0a0a1a]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#00d68f] border-r-[#4ecdc4]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-[2px] border-transparent border-b-[#a855f7] border-l-[#6366f1] opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold gradient-text">H</span>
          </div>
        </div>
        <h1 className="text-xl font-bold gradient-text mb-1">Hisob Bot</h1>
        <p className="text-xs text-gray-500">Moliyaviy yordamchi</p>
      </motion.div>
    </div>
  );
}
