import React from 'react';
import { motion } from 'framer-motion';

interface MessageProps {
  text: string;
  isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        position: 'relative',
      }}
    >
      {!isUser && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            flexShrink: 0,
            fontSize: '14px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          AI
        </div>
      )}
      <motion.div
        whileHover={{ scale: 1.01 }}
        style={{
          maxWidth: '75%',
          padding: '12px 16px',
          borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          backgroundColor: isUser ? '#6366F1' : '#f0f4f9',
          color: isUser ? 'white' : '#1F2937',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          position: 'relative',
          fontWeight: 400,
          lineHeight: 1.5,
        }}
      >
        {text}
      </motion.div>
      {isUser && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '8px',
            flexShrink: 0,
            fontSize: '14px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          YOU
        </div>
      )}
    </motion.div>
  );
};

export default Message; 