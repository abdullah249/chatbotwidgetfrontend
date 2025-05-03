import React, { useState } from 'react';
import axios from 'axios';

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-r-lg shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
      >
        {isOpen ? '←' : '→'}
      </button>

      {/* Chat Widget */}
      <div 
        className={`fixed left-0 top-0 h-screen w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Chat Header */}
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-xl font-semibold">Chat Support</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4">
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

          {/* Input Area */}
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
      </div>
    </>
  );
}

export default ChatWidget; 