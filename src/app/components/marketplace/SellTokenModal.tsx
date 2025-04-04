"use client";

import React, { useState } from 'react';
import { Token } from '@/app/lib/supabase';
import { formatCurrency } from '@/app/lib/formatters';

interface SellTokenModalProps {
  token: Token;
  maxQuantity: number;
  onSubmit: (quantity: number, pricePerToken: number) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export default function SellTokenModal({ 
  token, 
  maxQuantity, 
  onSubmit, 
  onClose, 
  isOpen 
}: SellTokenModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [pricePerToken, setPricePerToken] = useState(500000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    
    if (quantity > maxQuantity) {
      setError(`No puedes vender más de ${maxQuantity} tokens`);
      return;
    }
    
    if (pricePerToken <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(quantity, pricePerToken);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la oferta');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">
                  Vender Tokens: {token.name}
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Cantidad de tokens a vender:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Máximo disponible: {maxQuantity} tokens
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Precio por token (COP):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={pricePerToken}
                      onChange={(e) => setPricePerToken(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded-md mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Total a recibir:</span>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(quantity * pricePerToken)}
                      </span>
                    </div>
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
                      className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? 'Creando oferta...' : 'Crear oferta'}
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