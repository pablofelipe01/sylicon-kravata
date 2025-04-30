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
      onError(err instanceof Error ? err.message : 'Ha ocurrido un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-3">
        <Input
          id="kycStatusId"
          label=""
          value={externalId}
          onChange={(e) => setExternalId(e.target.value)}
          placeholder="SZ7ZTd4XUqjU$@"
          required
          className="mb-2"
        />
        
        <Button 
          type="submit"
          variant="secondary"
          fullWidth
          loading={loading}
          className="mt-2"
        >
          Verificar Estado
        </Button>
      </form>
      
      {responseData && (
        <div className="mt-3 p-3 bg-gray-800 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">Estado:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
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
          </div>
          
          {responseData.status === 'completed' && responseData.externalId && (
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">External ID:</span>
              <code className="bg-gray-700 px-2 py-0.5 rounded text-green-300 font-mono text-xs">{responseData.externalId}</code>
            </div>
          )}
          
          {responseData.status === 'rejected' && responseData.rejectionReason && (
            <div className="flex flex-col gap-1 mb-2">
              <span className="font-medium">Motivo:</span>
              <div className="bg-red-900/20 border border-red-800 p-2 rounded text-red-300 text-xs">
                {responseData.rejectionReason}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}