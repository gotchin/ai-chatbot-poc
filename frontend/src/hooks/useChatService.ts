import { useState } from 'react';
import axios from 'axios';

export const useChatService = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendMessage = async (message: string): Promise<string> => {
    try {
      const requestData = {
        message,
        session_id: sessionId
      };
      
      const response = await axios.post('http://localhost:8000/api/chat', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // レスポンスからセッションIDを保存
      if (response.data.session_id) {
        setSessionId(response.data.session_id);
      }

      return response.data.response;
    } catch (error) {
      console.error('Error in chat service:', error);
      throw error;
    }
  };

  return {
    sendMessage,
    sessionId
  };
}; 