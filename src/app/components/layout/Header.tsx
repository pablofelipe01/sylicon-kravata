"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./UserMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-4 border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Sylicon Logo"
              width={40}
              height={40}
              priority
              className="mr-3"
            />
            <span className="text-xl font-bold text-white">Sylicon Marketplace</span>
          </Link>
        </div>
        
        {/* Menú de hamburguesa (móvil) */}
        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={toggleMenu}
          aria-label="Menú"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
        
        {/* Navegación para desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">
                Marketplace
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Mi Cuenta
              </Link>
            </li>
          </ul>
          
          <UserMenu />
        </nav>
      </div>
      
      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 shadow-lg">
          <ul className="flex flex-col space-y-3 p-4">
            <li>
              <Link 
                href="/" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link 
                href="/marketplace" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Cuenta
              </Link>
            </li>
          </ul>
          
          <div className="p-4 border-t border-gray-700">
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  );
}