"use client";

import { useState, useRef, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";

// Types for messages
type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Generate a unique user ID for session tracking
  const [userId] = useState(() => {
    return `user-${Math.random().toString(36).substring(2, 9)}`;
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Add initial welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        text: "¡Hola! Soy Sylicon, tu asistente virtual para inversiones inmobiliarias. Puedo ayudarte con información sobre tokens inmobiliarios, proceso de verificación KYC, o cualquier duda sobre nuestra plataforma. ¿En qué puedo ayudarte hoy?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Format the request according to your n8n webhook
      const requestBody = {
        body: {
          messages: [
            {
              text: input,
              from: userId,
              type: "text"
            }
          ]
        }
      };
      
      // Send the message to n8n webhook
      const response = await fetch("https://n8n-siriusagentic-u38879.vm.elestio.app/webhook/sily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      const data = await response.json();
      
      // Add bot response to the chat
      const botMessage: Message = {
        text: data.response || "Lo siento, no pude procesar tu solicitud en este momento.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        text: "Lo siento, hubo un error al conectar con el asistente. Por favor, intenta nuevamente más tarde.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-900">
      {/* Header */}
      <div className="w-full max-w-xl mb-6 text-center">
        <br />
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" 
             style={{ background: 'linear-gradient(135deg, #3A8D8C 0%, #8CCA6E 100%)' }}>
          <div className="text-white text-2xl font-bold">SY</div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">Asistente Sylicon</h1>
        <p className="text-gray-400">Tu asistente virtual para inversiones inmobiliarias</p>
      </div>
      
      {/* Chat Container */}
      <div className="w-full max-w-xl bg-gray-800 rounded-lg shadow-md flex flex-col h-[60vh] mb-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-center">
              <div>
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center opacity-60"
                     style={{ background: 'linear-gradient(135deg, #3A8D8C 0%, #8CCA6E 100%)' }}>
                  <div className="text-white text-xl">SY</div>
                </div>
                <p>Envía un mensaje para comenzar a chatear con el Asistente Sylicon</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg mb-3 max-w-[80%] ${
                  message.isUser 
                    ? "bg-gray-700 text-white self-end" 
                    : "text-white self-start"
                } ${message.isUser ? "" : "bg-gradient-to-r from-[#3A8D8C] to-[#8CCA6E]"}`}
              >
                <div>{message.text}</div>
                <div className={`text-xs mt-1 ${message.isUser ? "text-gray-400" : "text-gray-200"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="p-3 rounded-lg mb-3 max-w-[80%] self-start bg-gradient-to-r from-[#3A8D8C] to-[#8CCA6E]">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 bg-gray-800 rounded-b-lg">
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 p-3 rounded-full bg-gray-700 border-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8CCA6E]"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ml-2 p-3 rounded-full text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3A8D8C 0%, #8CCA6E 100%)' }}
              disabled={isLoading || !input.trim()}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
      
      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-auto">
        <p>Desarrollado por Sylicon • Tokenización Inmobiliaria</p>
      </footer>
    </main>
  );
}