"use client";

import { useState, useEffect } from 'react';
import { Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [externalId, setExternalId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  // Si el usuario ya está logueado, redirigir a la página principal
  useEffect(() => {
    if (user?.isLoggedIn) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await login(externalId);
      router.push('/dashboard');
    } catch (err) {
      setError('ID no válido. Por favor, verifica e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">Iniciar Sesión</h1>
          
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
                placeholder="Ingresa tu External ID"
                required
              />
              <p className="mt-2 text-sm text-gray-400">
                Este ID es proporcionado por Kravata después del proceso KYC.
              </p>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {[].map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setExternalId(id)}
                    className="px-3 py-1 text-xs rounded text-white transition-all hover:shadow-md"
                    style={{ 
                      background: 'linear-gradient(135deg, #3A8D8C 0%, #71BB87 100%)',
                      opacity: 0.8
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                    }}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white font-medium rounded-md transition-all shadow-md hover:shadow-lg relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                  backgroundSize: '200% auto',
                }}
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
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">¿No tienes una cuenta?</p>
            <Link 
              href="/kyc-registration" 
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: '#8CCA6E' }}
            >
              Completa el proceso KYC para obtener tu ID
            </Link>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-700">
            <Link href="/">
              <button 
                className="w-full px-4 py-2 text-white font-medium rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Volver al Inicio
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}