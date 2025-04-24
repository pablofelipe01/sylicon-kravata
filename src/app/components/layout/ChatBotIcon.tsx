"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ChatBotIcon() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  
  // No mostrar el icono en la página del bot
  useEffect(() => {
    if (pathname === "/bot") {
      setIsVisible(false);
    } else {
      // Pequeño delay para mostrar el icono con animación
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);
  
  if (!isVisible) return null;
  
  return (
    <Link 
      href="/bot"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:transform hover:scale-110 animate-fadeIn"
      style={{ 
        background: 'linear-gradient(135deg, #3A8D8C 0%, #8CCA6E 100%)',
        boxShadow: '0 4px 14px rgba(140, 202, 110, 0.4)'
      }}
      aria-label="Abrir asistente virtual"
    >
      <div className="relative">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-6 h-6 text-white"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        
        {/* Indicador de "nuevo" - opcional */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full pulse-animation"></span>
      </div>
    </Link>
  );
}