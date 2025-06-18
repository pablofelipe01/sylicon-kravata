"use client";

import { useState, useEffect } from 'react';
import { Input } from '../../ui';
import { getKycForm } from '../../../lib/api';
import Link from 'next/link';

interface KycFormProps {
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
}

export default function KycForm({ onSuccess, onError }: KycFormProps) {
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Estado para cada regla de validación
  const [validations, setValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false, 
    hasNumber: false,
    hasSymbol: false,
    hasValidChars: true // Nueva validación para caracteres permitidos
  });

  // Validar cada requisito individualmente
  useEffect(() => {
    if (touched || externalId.length > 0) {
      // Verificar si solo contiene caracteres permitidos
      const hasInvalidChars = /[^a-zA-Z0-9@!$%&*]/.test(externalId);
      
      setValidations({
        minLength: externalId.length >= 12,
        hasUppercase: /[A-Z]/.test(externalId),
        hasLowercase: /[a-z]/.test(externalId),
        hasNumber: /[0-9]/.test(externalId),
        // Solo permitir @!$%&* como caracteres especiales
        hasSymbol: /[@!$%&*]/.test(externalId),
        hasValidChars: !hasInvalidChars
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
      console.log("Símbolos permitidos:", /[@!$%&*]/.test(externalId));
      console.log("Solo caracteres válidos:", !(/[^a-zA-Z0-9@!$%&*]/.test(externalId)));
    }
  }, [validations, isValid, externalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar validación antes de enviar
    if (!isValid) {
      onError("Por favor, asegúrate de cumplir todos los requisitos");
      return;
    }
    
    // Verificar aceptación de términos
    if (!termsAccepted) {
      onError("Debes aceptar los términos del contrato para continuar");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Enviando solicitud con externalId:", externalId);
      const data = await getKycForm(externalId);
      console.log("Respuesta recibida:", data);
      onSuccess(data);
      
      // Modificado aquí: usar window.location.href en lugar de window.open
      if (data.kycLink) {
        // Registrar información sobre dispositivo para debugging
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        console.log(`Dispositivo: ${isMobile ? 'Móvil' : 'Desktop'}`);
        console.log(`Redirigiendo a URL KYC: ${data.kycLink}`);
        
        // Redireccionar a la URL KYC
        window.location.href = data.kycLink;
      }
    } catch (err) {
      console.error("Error en KycForm:", err);
      onError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Verificación manual de símbolo (limitado a @!$%&*)
  const hasSymbolCheck = () => {
    const allowedSymbols = "@!$%&*";
    for (let i = 0; i < externalId.length; i++) {
      if (allowedSymbols.includes(externalId[i])) {
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
        placeholder="SZ7ZTd4XUqjU$@!"
        required
        error={touched && !isValid && externalId.length > 0}
      />
      
      {(touched || externalId.length > 0) && (
        <div className="mt-2 text-sm">
          <p className="font-medium mb-1 text-gray-200">Tu identificador debe cumplir:</p>
          <ul className="space-y-1 pl-1">
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full font-bold
                ${validations.minLength 
                  ? 'bg-green-500/30 text-green-400 border border-green-500/50' 
                  : 'bg-red-500/30 text-red-400 border border-red-500/50'}`}
              >
                {validations.minLength ? '✓' : '✗'}
              </span>
              <span className="text-gray-300">
                Mínimo 12 caracteres {externalId.length > 0 && `(${externalId.length}/12)`}
              </span>
            </li>
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full font-bold
                ${validations.hasUppercase 
                  ? 'bg-green-500/30 text-green-400 border border-green-500/50' 
                  : 'bg-red-500/30 text-red-400 border border-red-500/50'}`}
              >
                {validations.hasUppercase ? '✓' : '✗'}
              </span>
              <span className="text-gray-300">
                Al menos una letra mayúscula (A-Z)
              </span>
            </li>
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full font-bold
                ${validations.hasLowercase 
                  ? 'bg-green-500/30 text-green-400 border border-green-500/50' 
                  : 'bg-red-500/30 text-red-400 border border-red-500/50'}`}
              >
                {validations.hasLowercase ? '✓' : '✗'}
              </span>
              <span className="text-gray-300">
                Al menos una letra minúscula (a-z)
              </span>
            </li>
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full font-bold
                ${validations.hasNumber 
                  ? 'bg-green-500/30 text-green-400 border border-green-500/50' 
                  : 'bg-red-500/30 text-red-400 border border-red-500/50'}`}
              >
                {validations.hasNumber ? '✓' : '✗'}
              </span>
              <span className="text-gray-300">
                Al menos un número (0-9)
              </span>
            </li>
            <li className="flex items-center">
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full font-bold
                ${validations.hasSymbol 
                  ? 'bg-green-500/30 text-green-400 border border-green-500/50' 
                  : 'bg-red-500/30 text-red-400 border border-red-500/50'}`}
              >
                {validations.hasSymbol ? '✓' : '✗'}
              </span>
              <span className="text-gray-300">
                Al menos un símbolo especial (solo @, !, $, %, &, *)
              </span>
            </li>
            {!validations.hasValidChars && (
              <li className="flex items-center">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-red-500/30 text-red-400 border border-red-500/50 font-bold">
                  ✗
                </span>
                <span className="text-red-400">
                  Solo se permiten letras, números y los símbolos @, !, $, %, &, *
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
      
      {isValid && externalId.length > 0 && (
        <div className="mt-3 p-2 rounded-md bg-green-500/10 border border-green-500/20">
          <p className="text-green-400 flex items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            El formato del identificador es válido
          </p>
        </div>
      )}
      
      {/* Checkbox para aceptar términos y condiciones */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="terms-checkbox" 
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 mr-3"
          />
          <label htmlFor="terms-checkbox" className="text-gray-300 text-sm">
            Entiendo y acepto las condiciones establecidas en el <Link href="/contrato" className="text-blue-400 hover:text-blue-300 hover:underline font-medium" target="_blank">contrato de compra de tokens inmobiliarios</Link> y confirmo que he leído todos los términos antes de continuar con el proceso de verificación KYC.
          </label>
        </div>
      </div>
      
      {/* Mensaje de advertencia cuando no se han aceptado los términos */}
      {!termsAccepted && externalId.length > 0 && isValid && (
        <div className="mt-3 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-yellow-400 flex items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Debes aceptar los términos del contrato para continuar
          </p>
        </div>
      )}
      
      <button 
        type="submit"
        disabled={loading || !isValid || !termsAccepted}
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