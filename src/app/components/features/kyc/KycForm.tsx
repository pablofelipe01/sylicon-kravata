"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
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
      
      <Button 
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        Obtener Formulario KYC
      </Button>
    </form>
  );
}