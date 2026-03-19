import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hello! I am CloudSafe AI. How can I assist you with your cloud security today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `You are CloudSafe AI, a cybersecurity expert. Answer the following question briefly and professionally: ${userMsg}` }] }]
      });
      const text = response.text || 'No response from AI.';
      
      setMessages(prev => [...prev, { role: 'bot', text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting to my neural network. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10001]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-card w-96 h-[500px] mb-4 flex flex-col overflow-hidden border-cyber-neon/50 shadow-[0_0_30px_rgba(0,255,204,0.2)]"
          >
            <div className="p-4 bg-cyber-neon/10 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="text-cyber-neon" size={20} />
                <span className="font-bold text-cyber-neon uppercase tracking-wider text-sm">CloudSafe AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyber-blue/20 border border-cyber-blue/30 text-white' 
                      : 'bg-white/5 border border-white/10 text-white/90'
                  }`}>
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase font-bold">
                      {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                      {msg.role === 'user' ? 'You' : 'CloudSafe AI'}
                    </div>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-xs text-cyber-neon"
                    >
                      Analyzing security protocols...
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about cloud security..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyber-neon/50 transition-colors"
              />
              <button
                onClick={handleSend}
                className="bg-cyber-neon text-black p-2 rounded-xl hover:scale-105 transition-transform"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-cyber-neon rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,204,0.4)] text-black"
      >
        <MessageSquare size={24} />
      </motion.button>
    </div>
  );
};

export default AIChatbot;
