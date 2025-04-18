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
            <Button 
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Iniciar Sesión
            </Button>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">¿No tienes una cuenta?</p>
              <Link 
                href="/kyc-registration" 
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
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