"use client";

import { useState, useEffect } from 'react';
import { Input } from '../../ui';
import { getKycForm } from '../../../lib/api';

interface KycFormProps {
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
}

export default function KycForm({ onSuccess, onError }: KycFormProps) {
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  
  // Estado para cada regla de validación
  const [validations, setValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false, 
    hasNumber: false,
    hasSymbol: false
  });

  // Validar cada requisito individualmente
  useEffect(() => {
    if (touched || externalId.length > 0) {
      setValidations({
        minLength: externalId.length >= 12,
        hasUppercase: /[A-Z]/.test(externalId),
        hasLowercase: /[a-z]/.test(externalId),
        hasNumber: /[0-9]/.test(externalId),
        hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(externalId)
      });
    }
  }, [externalId, touched]);

  // Verificar si todos los requisitos se cumplen
  const isValid = Object.values(validations).every(v => v === true);

  // Debug - registrar valores para depuración
  useEffect(() => {
    if (externalId.length > 0) {
      console.log("Validaciones:", validations);
      console.log("¿Es válido?:", isValid);
      console.log("Longitud:", externalId.length >= 12);
      console.log("Mayúsculas:", /[A-Z]/.test(externalId));
      console.log("Minúsculas:", /[a-z]/.test(externalId));
      console.log("Números:", /[0-9]/.test(externalId));
      console.log("Símbolos:", /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(externalId));
    }
  }, [validations, isValid, externalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar validación antes de enviar
    if (!isValid) {
      onError("Por favor, asegúrate de cumplir todos los requisitos");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Enviando solicitud con externalId:", externalId);
      const data = await getKycForm(externalId);
      console.log("Respuesta recibida:", data);
      onSuccess(data);
      
      if (data.kycLink) {
        window.open(data.kycLink, '_blank');
      }
    } catch (err) {
      console.error("Error en KycForm:", err);
      onError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Verificación manual de símbolo (por si la expresión regular da problemas)
  const hasSymbolCheck = () => {
    const symbols = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";
    for (let i = 0; i < externalId.length; i++) {
      if (symbols.includes(externalId[i])) {
        return true;
      }
    }
    return false;
  };

  // Actualizar estado de validación para símbolos usando método alternativo
  useEffect(() => {
    if (touched || externalId.length > 0) {
      setValidations(prev => ({
        ...prev,
        hasSymbol: hasSymbolCheck()
      }));
    }
  }, [externalId]);

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="externalId"
        label="External ID:"
        value={externalId}
        onChange={(e) => setExternalId(e.target.value)}
        onFocus={() => setTouched(true)}
        placeholder="Ej: A3b$Tr9pK2x#5z (mín. 12 caracteres )"
        required
        error={touched && !isValid && externalId.length > 0}
      />
      
      {(touched || externalId.length > 0) && (
        <div className="mt-2 text-sm">
          <p className="font-medium mb-1">Tu identificador debe cumplir:</p>
          <ul className="space-y-1 pl-1">
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full 
                ${validations.minLength 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'}`}
              >
                {validations.minLength ? '✓' : '✗'}
              </span>
              Mínimo 12 caracteres {externalId.length > 0 && `(${externalId.length}/12)`}
            </li>
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full 
                ${validations.hasUppercase 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'}`}
              >
                {validations.hasUppercase ? '✓' : '✗'}
              </span>
              Al menos una letra mayúscula (A-Z)
            </li>
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full 
                ${validations.hasLowercase 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'}`}
              >
                {validations.hasLowercase ? '✓' : '✗'}
              </span>
              Al menos una letra minúscula (a-z)
            </li>
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full 
                ${validations.hasNumber 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'}`}
              >
                {validations.hasNumber ? '✓' : '✗'}
              </span>
              Al menos un número (0-9)
            </li>
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full 
                ${validations.hasSymbol 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'}`}
              >
                {validations.hasSymbol ? '✓' : '✗'}
              </span>
              Al menos un símbolo especial (@#$%&* etc.)
            </li>
          </ul>
        </div>
      )}
      
      {isValid && externalId.length > 0 && (
        <div className="mt-3 p-2 rounded-md bg-green-500/10 border border-green-500/20">
          <p className="text-green-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            El formato del identificador es válido
          </p>
        </div>
      )}
      
      <button 
        type="submit"
        disabled={loading || !isValid}
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