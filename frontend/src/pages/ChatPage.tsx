import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Message from '../components/Message';
import { ChatMessage } from '../interfaces';
import { useChatService } from '../hooks/useChatService';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage, sessionId } = useChatService();

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // ユーザーメッセージを追加
    const userMessage: ChatMessage = { 
      text: input, 
      isUser: true, 
      id: `user-${Date.now()}` 
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input);

      // AIの応答を追加
      const aiMessage: ChatMessage = {
        text: response,
        isUser: false,
        id: `ai-${Date.now()}`
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        text: 'エラーが発生しました。もう一度お試しください。',
        isUser: false,
        id: `error-${Date.now()}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div 
      style={{ 
        width: '100%',
        maxWidth: '800px', 
        margin: '20px auto', 
        padding: '20px', 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        backgroundColor: isDarkMode ? '#1F2937' : 'white',
        color: isDarkMode ? '#E5E7EB' : '#111827',
        transition: 'all 0.3s ease',
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          width: '100%',
        }}
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            fontWeight: 700, 
            fontSize: '28px',
            margin: 0,
            background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AIチャットボット
        </motion.h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
              color: isDarkMode ? '#E5E7EB' : '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
      
      <div
        style={{
          height: '500px',
          width: '100%',
          border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
          borderRadius: '12px',
          padding: '16px',
          overflowY: 'auto',
          marginBottom: '20px',
          backgroundColor: isDarkMode ? '#111827' : '#F9FAFB',
          transition: 'all 0.3s ease',
          scrollBehavior: 'smooth',
          boxSizing: 'border-box',
        }}
      >
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: isDarkMode ? '#9CA3AF' : '#6B7280',
              textAlign: 'center',
              padding: '0 20px',
            }}
          >
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>👋</span>
            <p style={{ fontSize: '16px', lineHeight: 1.6 }}>
              AIアシスタントへようこそ！<br />
              質問や相談を入力してチャットを開始しましょう
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <Message key={msg.id} text={msg.text} isUser={msg.isUser} />
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  backgroundColor: isDarkMode ? '#374151' : '#EFF6FF',
                  width: 'fit-content',
                  marginBottom: '16px',
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '4px',
                  color: isDarkMode ? '#E5E7EB' : '#1F2937',
                }}>
                  <div className="dot" style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#6366F1',
                    animation: 'pulse 1.5s infinite ease-in-out',
                    animationDelay: '0s',
                  }} />
                  <div className="dot" style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#8B5CF6',
                    animation: 'pulse 1.5s infinite ease-in-out',
                    animationDelay: '0.2s',
                  }} />
                  <div className="dot" style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#A78BFA',
                    animation: 'pulse 1.5s infinite ease-in-out',
                    animationDelay: '0.4s',
                  }} />
                  <span style={{ marginLeft: '8px', fontSize: '14px' }}>考え中...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.form 
        onSubmit={handleSubmit} 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px', 
          width: '100%',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
            backgroundColor: isDarkMode ? '#111827' : 'white',
            color: isDarkMode ? '#E5E7EB' : '#111827',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.3s ease',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 24px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: '#6366F1',
            color: 'white',
            fontWeight: 600,
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.7 : 1,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          送信
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: '4px' }}
          >
            <path 
              d="M5 12H19M19 12L12 5M19 12L12 19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ChatPage; 