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
      const chatRes = await axios.post('https://chatbotwidgetbackend-omega.vercel.app/chat', { message: input });
      setMessages(prev => [...prev, { from: 'bot', text: chatRes.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-300 z-50 text-3xl"
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {/* Chat Widget Pop-up */}
      <div
        className={`fixed bottom-6 right-6 w-80 max-w-full h-[500px] bg-white shadow-2xl rounded-xl flex flex-col transition-transform duration-300 z-50 border border-gray-200 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ transformOrigin: 'bottom right' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-blue-500 rounded-t-xl">
          <h2 className="text-lg font-semibold text-white">Chat Assistant</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-xl hover:text-gray-200"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 mt-20">How can I help you today?</div>
          )}
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
        {/* Input */}
        <div className="p-3 border-t bg-white flex gap-2">
          <input
            className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.197-.12 1.197.488V7.5c4.5 0 7.5 1.5 9 6-1.5 4.5-4.5 6-9 6v3.967c0 .609-.757.928-1.197.489L2.25 12z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatWidget; 
