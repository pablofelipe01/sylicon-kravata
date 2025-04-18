"use client";

import { useState, useEffect } from 'react';
import { Input, Button } from '../components/ui';
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
            {/* <h3 className="text-sm font-medium text-gray-300 mb-2">IDs disponibles para pruebas:</h3> */}
            <div className="flex flex-wrap gap-2">
              {['test001', 'test002', 'test003', 'test004'].map((id) => (
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
          
          <div className="mt-6">
            <Button 
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">¿No tienes una cuenta?</p>
          <Link 
            href="/kyc-registration" 
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Completa el proceso KYC para obtener tu ID
          </Link>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700">
          <Link href="/">
            <Button 
              variant="secondary"
              fullWidth
            >
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}