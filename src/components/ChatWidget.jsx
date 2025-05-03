import React, { useState } from 'react';
import axios from 'axios';

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    setMessages([...messages, { from: 'user', text: input }]);
    setIsLoading(true);
    
    try {
      const chatRes = await axios.post('https://chatbotwidgetbackend.vercel.app/chat', { message: input });
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: chatRes.data.response 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="p-4 w-96 border rounded-xl shadow-md bg-white">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`px-3 py-2 rounded inline-block max-w-[80%] ${
              msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <span className="px-3 py-2 rounded bg-gray-200 inline-block">
              Thinking...
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          className="border p-2 flex-1 rounded" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWidget; 