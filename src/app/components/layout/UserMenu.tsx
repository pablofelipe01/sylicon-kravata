"use client";

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { truncateAddress } from '@/app/lib/formatters';
import LoginModal from '../login/LoginModal';
import Link from 'next/link';

export default function UserMenu() {
  const { user, logout, refreshBalance, isLoading } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = async (externalId: string) => {
    try {
      await login(externalId);
      setLoginModalOpen(false);
    } catch (err) {
      // Error ya manejado por el contexto de autenticación
    }
  };

  const { login } = useAuth();

  return (
    <div className="relative">
      {user.isLoggedIn ? (
        <>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <div className="bg-gradient-to-br from-teal-400 to-green-400 rounded-full p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs text-white font-semibold">{user.externalId}</p>
              <p className="text-xs text-gray-400">{truncateAddress(user.walletAddress, 4)}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi Cuenta
                </Link>
                <button
                  onClick={() => {
                    refreshBalance();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar Balance'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => setLoginModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Iniciar Sesión
        </button>
      )}

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}