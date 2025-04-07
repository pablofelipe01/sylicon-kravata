"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
import { checkKycStatus } from '../../../lib/api';

interface KycStatusProps {
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
}

export default function KycStatus({ onSuccess, onError }: KycStatusProps) {
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!externalId || externalId.trim() === "") {
      onError("Por favor, ingresa un External ID");
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await checkKycStatus(externalId);
      console.log("Respuesta de checkKycStatus:", data);
      setResponseData(data);
      onSuccess(data);
    } catch (err) {
      console.error("Error en KycStatus:", err);
      onError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <Input
          id="externalId"
          label="External ID:"
          value={externalId}
          onChange={(e) => setExternalId(e.target.value)}
          placeholder="Ingresa el ID a verificar"
          required
        />
        
        <div className="mt-2 mb-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">IDs de prueba disponibles:</h3>
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
        </div>
        
        <Button 
          type="submit"
          variant="secondary"
          fullWidth
          loading={loading}
        >
          Verificar Estado KYC
        </Button>
      </form>
      
      {responseData && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-4">Estado de tu verificación:</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="font-medium">Status Original:</span>
            <code className="bg-gray-700 px-2 py-1 rounded text-white">{responseData.status}</code>
          </div>
          
          {/* <div className="flex items-center gap-2 mb-4">
            <span className="font-medium">Estado mostrado:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              responseData.status === 'completed' 
                ? 'bg-green-900/40 text-green-400' 
                : responseData.status === 'pending'
                  ? 'bg-yellow-900/40 text-yellow-400'
                  : 'bg-red-900/40 text-red-400'
            }`}>
              {responseData.status === 'completed' 
                ? 'Completado' 
                : responseData.status === 'pending'
                  ? 'Pendiente'
                  : 'Rechazado'}
            </span>
          </div> */}
          
          <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
            <details>
              <summary className="cursor-pointer text-sm text-blue-400">Ver respuesta completa de API</summary>
              <pre className="mt-2 text-xs text-gray-300 overflow-auto max-h-48">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}