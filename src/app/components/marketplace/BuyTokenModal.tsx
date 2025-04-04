"use client";

import React, { useState } from 'react';
import { Offer } from '@/app/lib/supabase';
import { formatCurrency } from '@/app/lib/formatters';

interface BuyTokenModalProps {
  offer: Offer;
  buyerExternalId: string;
  buyerWalletId: string;
  onSubmit: (offerId: string, quantity: number) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export default function BuyTokenModal({ 
  offer, 
  buyerExternalId,
  buyerWalletId,
  onSubmit, 
  onClose, 
  isOpen 
}: BuyTokenModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen || !offer) return null;
  
  const maxQuantity = offer.quantity;
  const totalPrice = quantity * offer.price_per_token;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    
    if (quantity > maxQuantity) {
      setError(`No puedes comprar más de ${maxQuantity} tokens`);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(offer.id, quantity);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };
  
  const tokenName = offer.token?.name || 'Token';
  const sellerName = offer.seller?.external_id || 'Vendedor desconocido';
  
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
                  Comprar {tokenName}
                </h3>
                
                <div className="bg-gray-700 p-3 rounded-md mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Vendedor:</span>
                    <span className="text-white">{sellerName}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Disponibles:</span>
                    <span className="text-white">{offer.quantity} tokens</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Precio por token:</span>
                    <span className="text-green-400 font-bold">{formatCurrency(offer.price_per_token)}</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Cantidad de tokens a comprar:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded-md mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Total a pagar:</span>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded-md mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Detalles de pago:</h4>
                    <p className="text-xs text-gray-400 mb-2">
                      El pago será procesado a través de PSE una vez que confirmes la compra.
                    </p>
                    <p className="text-xs text-gray-400">
                      Tu ID: {buyerExternalId}
                    </p>
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
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? 'Procesando...' : 'Confirmar compra'}
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