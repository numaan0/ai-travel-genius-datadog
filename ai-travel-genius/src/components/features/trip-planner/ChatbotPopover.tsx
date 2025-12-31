'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Plane,
  MapPin
} from 'lucide-react';
import { adkService } from '@/lib/adk-service';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Memoized message component WITHOUT animations on re-render
const MessageBubble = memo(({ msg }: { msg: Message }) => {
  const isUser = msg.type === 'user';
  
  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r from-green-500 to-blue-600' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Message bubble - NO motion.div here */}
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${
          isUser
            ? 'bg-gradient-to-r from-green-500/20 to-blue-600/20 border border-green-400/30 text-green-100'
            : 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 text-blue-100'
        }`}>
          <p className="text-sm leading-5 whitespace-pre-wrap">
            {msg.content}
          </p>
        </div>
        
        <p className={`text-xs mt-1 opacity-60 ${
          isUser ? 'text-green-300' : 'text-blue-300'
        }`}>
          {msg.timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default function ChatbotPopover() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your AI Travel Genius assistant. I can help you plan trips, suggest activities, or answer any travel questions!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Simplified scroll - only when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]); // Only when message count changes

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any ongoing streams
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized input handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const handleSend = useCallback(async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userMessageContent = message.trim();
    setMessage('');
    setIsLoading(true);

    // Create a placeholder bot message for streaming
    const botMessageId = Date.now().toString();
    const botMessage: Message = {
      id: botMessageId,
      type: 'bot',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);

    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Use SSE streaming for real-time response
      const response = await adkService.askQuestionStream(userMessageContent, {
        signal: abortControllerRef.current.signal,
        onChunk: (chunk: string) => {
          // Update message content as chunks arrive
          if (chunk) {
            setMessages(prev => prev.map(msg => 
              msg.id === botMessageId 
                ? { ...msg, content: msg.content + chunk }
                : msg
            ));
          }
        },
        onComplete: (result: any) => {
          // Final structured response
          if (result?.answer) {
            setMessages(prev => prev.map(msg => 
              msg.id === botMessageId 
                ? { ...msg, content: result.answer }
                : msg
            ));
          }
        },
        onError: (error: Error) => {
          // Don't show error if aborted
          if (error.name === 'AbortError' || error.message.includes('aborted')) {
            return;
          }
          // Update message with error
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, content: `🚨 Error: ${error.message || 'Network error'}. Please try again.` }
              : msg
          ));
        }
      });

      // If we got a structured response, update the message
      if (response?.answer) {
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, content: response.answer }
            : msg
        ));
      } else if (response && !response.answer) {
        // Fallback if response doesn't have answer field
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, content: 'I apologize, but I couldn\'t process that request. Could you please try rephrasing?' }
            : msg
        ));
      }
      
    } catch (error: any) {
      // Don't show error if aborted
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return;
      }
      // Update error message
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, content: `🚨 Error: ${error.message || 'Network error'}. Please try again.` }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [message, isLoading]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-96 h-[600px] bg-gradient-to-br from-gray-900/95 to-blue-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Travel Genius</h3>
                    <p className="text-blue-300 text-xs">Your AI Travel Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Container - NO animations here */}
            <div className="flex-1 overflow-y-auto p-4 h-[450px]">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              
              {/* Simple typing indicator */}
              {isLoading && (
                <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-2xl">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 text-sm">Typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about travel..."
                    disabled={isLoading}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 pr-12 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 ${
                      message.trim() && !isLoading
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-2xl flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
