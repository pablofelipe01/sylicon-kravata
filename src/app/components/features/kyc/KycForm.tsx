"use client";

import { useState } from 'react';
import { Input } from '../../ui';
import { getKycForm } from '../../../lib/api';

interface KycFormProps {
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
}

export default function KycForm({ onSuccess, onError }: KycFormProps) {
  // Cambia el valor inicial a cadena vacía para que el usuario lo ingrese
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que externalId no esté vacío
    if (!externalId || externalId.trim() === "") {
      onError("Por favor, ingresa un External ID");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Enviando solicitud con externalId:", externalId); // Agregar log
      const data = await getKycForm(externalId);
      console.log("Respuesta recibida:", data); // Agregar log
      onSuccess(data);
      
      if (data.kycLink) {
        window.open(data.kycLink, '_blank');
      }
    } catch (err) {
      console.error("Error en KycForm:", err); // Agregar log
      onError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="externalId"
        label="External ID:"
        value={externalId}
        onChange={(e) => setExternalId(e.target.value)}
        placeholder="Ingresa un External ID para registrarte"
        required
      />
      
      <button 
        type="submit"
        disabled={loading}
        className="w-full mt-4 px-4 py-2 text-white font-medium rounded-md transition-all shadow-md hover:shadow-lg bg-gradient-to-r from-[#3A8D8C] to-[#8CCA6E] hover:from-[#4DA7A2] hover:to-[#71BB87] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : "Obtener Formulario KYC"}
      </button>
    </form>
  );
}