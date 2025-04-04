"use client";

import { useState } from 'react';
import { Button } from '../ui';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (externalId: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [externalId, setExternalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!externalId.trim()) {
      setError('El ID es requerido');
      return;
    }
    
    // Validar que el ID sea uno de los permitidos
    const validIds = ['test001', 'test002', 'test003', 'test004'];
    if (!validIds.includes(externalId)) {
      setError('ID no válido. Por favor usa uno de los IDs disponibles.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Iniciar sesión con el ID validado
      onLogin(externalId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Lista de IDs disponibles (que ya están dados de alta en Kravata)
  const validIds = ['test001', 'test002', 'test003', 'test004'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">
                  Iniciar Sesión
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      External ID:
                    </label>
                    <input
                      type="text"
                      value={externalId}
                      onChange={(e) => setExternalId(e.target.value)}
                      placeholder="Ingresa tu External ID"
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Este ID es proporcionado por Kravata después del proceso KYC.
                    </p>
                  </div>
                  
                  {/* IDs disponibles */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">IDs disponibles:</p>
                    <div className="flex flex-wrap gap-2">
                      {validIds.map(id => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setExternalId(id)}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded"
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-blue-400">
                      * Estos son los IDs que ya han completado el proceso KYC en Kravata.
                    </p>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-gray-700 hover:bg-gray-600 text-white rounded-md px-4 py-2 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}