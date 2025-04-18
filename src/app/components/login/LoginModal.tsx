"use client";

import { useState } from 'react';
import { Input, Button } from '../ui'; // Corregido: Cambiado de '../components/ui' a '../../ui'
import { useAuth } from '../../contexts/AuthContext'; // También necesita ajustarse
import Link from 'next/link';

export default function LoginModal({ isOpen, onClose }) {
  const [externalId, setExternalId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await login(externalId);
      onClose();
    } catch (err) {
      setError('ID no válido. Por favor, verifica e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Iniciar Sesión</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="externalId" className="block text-sm font-medium text-gray-300 mb-2">
              External ID:
            </label>
            <Input
              id="externalId"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              placeholder="Ingresa tu ID"
              required
              className="w-full"
            />
            <p className="mt-2 text-sm text-gray-400">
              Este ID es tu Identificación aprobada por Kravata después del proceso KYC.
            </p>
          </div>
          
          <div className="mb-4">
            {/* <h3 className="text-sm font-medium text-gray-300 mb-2">IDs disponibles para pruebas:</h3> */}
            <div className="flex flex-wrap gap-2">
              {[].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setExternalId(id)}
                  className="px-3 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  {id}
                </button>
              ))}
            </div>
            {/* <p className="mt-2 text-xs text-blue-400">
              * Estos son los IDs que ya han completado el proceso KYC en Kravata.
            </p> */}
          </div>
          
          <div className="mt-6 flex flex-col gap-4">
            {/* Botón con gradiente de turquesa a verde */}
            <button 
              type="submit"
              className="w-full py-2 px-4 rounded-md font-medium text-white relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                transition: 'all 0.3s ease'
              }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : "Iniciar Sesión"}
              
              {/* Efecto hover */}
              <span 
                className="absolute inset-0 w-full h-full"
                style={{ 
                  background: 'linear-gradient(90deg, #4DA7A2 0%, #71BB87 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  mixBlendMode: 'multiply'
                }}
              ></span>
            </button>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">¿No tienes una cuenta?</p>
              <Link 
                href="/kyc-registration" 
                className="text-[#71BB87] hover:text-[#8CCA6E] text-sm font-medium"
                onClick={onClose}
              >
                Completa el proceso KYC para obtener tu ID
              </Link>
            </div>
          </div>
        </form>
        
        <div className="mt-6 border-t border-gray-700 pt-4">
          <Button 
            variant="secondary"
            onClick={onClose}
            fullWidth
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}