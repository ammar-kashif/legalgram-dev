
import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { legalFaqData } from "@/data/legalFaqData";

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "support",
      text: "Hello there! 👋\nHow can we help?",
      timestamp: "02:55 AM",
    }
  ]);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Find FAQ matches from user input
  const findFaqMatch = (text: string): string | null => {
    const lowercaseText = text.toLowerCase();
    
    for (const faq of legalFaqData) {
      for (const keyword of faq.keywords) {
        if (lowercaseText.includes(keyword.toLowerCase())) {
          return faq.answer;
        }
      }
    }
    
    return null;
  };
  
  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: inputMessage,
        timestamp: getCurrentTime(),
      };
      
      // Add user message to chat
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      
      // Check for FAQ matches
      const faqAnswer = findFaqMatch(inputMessage);
      
      // Simulate a short delay before assistant responds
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'support',
          text: faqAnswer || "I don't have a specific answer for that question. For personalized assistance, please email us at support@legalgram.com or call us at 1-800-LEGAL-HELP.",
          timestamp: getCurrentTime(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={chatRef}>
      {/* Chat Popup */}
      {isOpen && (
        <div className="mb-4 w-80 rounded-lg shadow-lg overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="bg-emerald-700 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-white">
                <div className="bg-red-500 w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  <span>LG</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Legal Gram Support</h3>
                <p className="text-xs opacity-90">Typically replies within 1 hour</p>
              </div>
            </div>
            <button 
              onClick={toggleChat} 
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="bg-gray-100 h-60 overflow-auto p-3 bg-[url('/lovable-uploads/386a6ab3-6e61-47e3-ac6e-8da415db5752.png')] bg-opacity-10">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`${
                  msg.sender === 'user' 
                    ? 'ml-auto bg-green-500 text-white' 
                    : 'bg-white text-gray-800'
                } rounded-lg p-3 shadow-sm max-w-[80%] mb-2`}
              >
                {msg.sender === 'support' && (
                  <p className="text-xs text-gray-500 font-medium mb-1">Legal Gram Support</p>
                )}
                {msg.text.split('\n').map((text, i) => (
                  <p key={i} className={msg.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                    {text}
                  </p>
                ))}
                <p className={`text-xs ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'} text-right mt-1`}>
                  {msg.timestamp} {msg.sender === 'user' ? '✓✓' : ''}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="bg-white p-2 flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button 
              type="submit" 
              className="ml-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
              disabled={!inputMessage.trim()}
            >
              <Send size={18} className={`${!inputMessage.trim() ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </form>
        </div>
      )}
      
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="bg-green-500 hover:bg-green-600 transition-colors rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        aria-label="Open chat"
      >
        {!isOpen && <MessageCircle size={28} className="text-white" />}
      </button>
    </div>
  );
};

export default ChatWidget;
