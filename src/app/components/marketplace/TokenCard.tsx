"use client";

import { useState } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/app/lib/formatters';
import { Token, Offer } from '@/app/lib/supabase';

interface TokenCardProps {
  token: Token;
  offers?: Offer[];
  onBuy?: (offer: Offer) => void;
  onSell?: (token: Token) => void;
  isOwner?: boolean;
  view?: 'marketplace' | 'account';
}

export default function TokenCard({ 
  token, 
  offers = [], 
  onBuy, 
  onSell, 
  isOwner = false,
  view = 'marketplace'
}: TokenCardProps) {
  const [showOffers, setShowOffers] = useState(false);
  
  const totalOffersQuantity = offers.reduce((sum, offer) => sum + offer.quantity, 0);
  const lowestPrice = offers.length > 0 
    ? Math.min(...offers.map(offer => offer.price_per_token))
    : null;
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transition-all hover:shadow-2xl">
      {/* Imagen del token - Sin padding lateral */}
      <div className="w-full overflow-hidden">
        <Image 
          src={token.image_url || '/placeholder-token.png'} 
          alt={token.name}
          width={400}
          height={300}
          className="w-full h-auto"
          priority
        />
      </div>
      
      {/* Información del token */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{token.name}</h3>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{token.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-gray-400">ID: {token.token_address.slice(0, 6)}...{token.token_address.slice(-4)}</div>
          <div className="text-xs px-2 py-1 rounded-full" 
               style={{ backgroundColor: 'rgba(58, 141, 140, 0.2)', color: '#8CCA6E' }}>
            {token.protocol}
          </div>
        </div>
        
        {/* Información de ofertas */}
        {offers.length > 0 ? (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Disponibles:</span>
              <span className="font-semibold">{totalOffersQuantity} tokens</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Precio desde:</span>
              <span className="font-semibold" style={{ color: '#8CCA6E' }}>
                {lowestPrice ? formatCurrency(lowestPrice) : 'N/A'}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-3 text-sm text-gray-400 italic">No hay ofertas disponibles</div>
        )}
        
        {/* Botones de acción */}
        <div className="flex flex-col gap-2">
          {view === 'account' && isOwner ? (
            <button
              onClick={() => onSell && onSell(token)}
              className="text-white rounded-full py-2 font-medium transition-all"
              style={{ 
                background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
              }}
            >
              Vender Tokens
            </button>
          ) : (
            <button
              onClick={() => setShowOffers(!showOffers)}
              className={`text-white rounded-full py-2 font-medium transition-all ${
                offers.length === 0 ? 'bg-gray-600 cursor-not-allowed' : ''
              }`}
              style={
                offers.length > 0 
                  ? { background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)' }
                  : {}
              }
              disabled={offers.length === 0}
            >
              {offers.length === 0 ? 'Sin disponibilidad' : (showOffers ? 'Ocultar ofertas' : 'Ver ofertas')}
            </button>
          )}
        </div>
      </div>
      
      {/* Listado de ofertas (desplegable) */}
      {showOffers && offers.length > 0 && (
        <div className="p-4 bg-gray-900">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Ofertas disponibles:</h4>
          <ul className="space-y-2">
            {offers.map((offer) => (
              <li key={offer.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <div>
                  <div className="text-sm text-white">{offer.quantity} tokens</div>
                  <div className="text-xs text-gray-400">
                    Vendedor: {offer.seller?.external_id || offer.seller_id.slice(0, 8)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold" style={{ color: '#8CCA6E' }}>
                    {formatCurrency(offer.price_per_token)}
                  </div>
                  <button 
                    onClick={() => onBuy && onBuy(offer)} 
                    className="text-white text-xs px-3 py-1 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)' }}
                  >
                    Comprar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}