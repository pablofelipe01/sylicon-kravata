"use client";

import { useState } from 'react';
import { Button } from '../../ui';
import KycStatus from './KycStatus';

interface KycStatusToggleProps {
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
}

export default function KycStatusToggle({ onSuccess, onError }: KycStatusToggleProps) {
  const [showStatus, setShowStatus] = useState(false);

  return (
    <div className="my-3">
      {!showStatus ? (
        <div className="text-center">
          <Button
            onClick={() => setShowStatus(true)}
            variant="secondary"
            className="w-full px-4 py-2 bg-gradient-to-r from-[#3A8D8C] to-[#8CCA6E] hover:from-[#4DA7A2] hover:to-[#71BB87] text-white font-medium rounded-md transition-all shadow-md hover:shadow-lg"
          >
            Verificar Estado KYC / Recuperar ID
          </Button>
          <p className="mt-2 text-xs text-gray-400">
            ¿Olvidaste tu ID? Recupéralo aquí
          </p>
        </div>
      ) : (
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white">Consultar Estado KYC</h3>
            <Button
              onClick={() => setShowStatus(false)}
              variant="text"
              className="text-gray-400 hover:text-white"
            >
              <span className="sr-only">Cerrar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
          <p className="text-xs text-gray-300 mb-3">
            Ingresa el ID que utilizaste durante el proceso KYC para recuperarlo
          </p>
          <KycStatus onSuccess={onSuccess} onError={onError} />
        </div>
      )}
    </div>
  );
}