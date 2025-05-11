import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Message from './Message';

interface ChatMessage {
  text: string;
  isUser: boolean;
  id: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const requestData = {
        message: input,
        session_id: sessionId
      };
      
      // 明示的にヘッダーを設定
      const response = await axios.post('http://localhost:8000/api/chat', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // レスポンスからセッションIDを保存
      if (response.data.session_id) {
        setSessionId(response.data.session_id);
      }

      // AIの応答を追加
      const aiMessage: ChatMessage = {
        text: response.data.response,
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
          border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
          borderRadius: '12px',
          padding: '16px',
          overflowY: 'auto',
          marginBottom: '20px',
          backgroundColor: isDarkMode ? '#111827' : '#F9FAFB',
          transition: 'all 0.3s ease',
          scrollBehavior: 'smooth',
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
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="メッセージを入力..."
          style={{
            flexGrow: 1,
            padding: '16px',
            borderRadius: '12px',
            border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
            outline: 'none',
            fontSize: '16px',
            backgroundColor: isDarkMode ? '#111827' : 'white',
            color: isDarkMode ? '#E5E7EB' : '#111827',
            transition: 'all 0.3s ease',
          }}
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '16px 24px',
            backgroundColor: '#6366F1',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '16px',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <span>送信</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
          </svg>
        </motion.button>
      </motion.form>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
          }
        `
      }} />
    </div>
  );
};

export default Chat; 