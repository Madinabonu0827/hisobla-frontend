'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertTriangle, Lightbulb, Bot, User } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import apiClient from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "Qancha sarfladim?",
  "Qanday tejasam?",
  "Prognoz",
  "Keraksiz xarajatlar",
  "Oylik tahlil",
  "Moliyaviy maslahat",
];

export function AIPage() {
  const { telegramId } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Salom! Men sizning shaxsiy AI moliyaviy maslahatchingizman. Qanday savolingiz bor?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!telegramId) return;
    const fetchAdvice = async () => {
      try {
        const res = await apiClient.post('/ai/advice', { telegramId });
        if (res.success) setAdvice(res.data);
      } catch {}
    };
    fetchAdvice();
  }, [telegramId]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading || !telegramId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await apiClient.post('/ai/chat', {
        telegramId,
        message: messageText,
      });

      if (res.success) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Kechirasiz, xatolik yuz berdi. Qaytadan urinib ko'ring.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-6 flex flex-col min-h-[calc(100dvh-100px)]">
      <h1 className="text-2xl font-bold mb-4">AI Maslahat</h1>

      {/* Score Card */}
      {advice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{advice.score || 0}</div>
              <div className="text-[10px] text-gray-400">Ball</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">{advice.summary || ""}</div>
              {advice.warnings && advice.warnings.length > 0 && (
                <div className="space-y-1">
                  {advice.warnings.slice(0, 2).map((w: string, i: number) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-[#ff6b6b]">
                      <AlertTriangle size={12} />
                      <span className="truncate">{w}</span>
                    </div>
                  ))}
                </div>
              )}
              {advice.tips && advice.tips.length > 0 && (
                <div className="space-y-1 mt-1">
                  {advice.tips.slice(0, 1).map((t: string, i: number) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-[#00d68f]">
                      <Lightbulb size={12} />
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Questions */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-full glass-card text-xs text-gray-400 whitespace-nowrap hover:text-[#4ecdc4] transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-[#a855f7]" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-[#00d68f] text-white rounded-br-md'
                  : 'glass-card text-gray-200 rounded-bl-md'
              }`}
            >
              {msg.content.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < msg.content.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[#00d68f]/20 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-[#00d68f]" />
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
              <Bot size={16} className="text-[#a855f7]" />
            </div>
            <div className="glass-card p-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card p-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="Savolingizni yozing..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent outline-none text-sm px-2"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            input.trim() && !isLoading
              ? 'bg-[#00d68f] text-white'
              : 'bg-white/5 text-gray-500'
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
