"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/app/lib/formatters';
import { Token, Offer } from '@/app/lib/supabase';
import TokenDetailModal from '@/app/components/features/tokens/TokenDetailModal';
import { useAuth } from '@/app/contexts/AuthContext';
import { checkKycStatus } from '@/app/lib/api';
import Link from 'next/link';

interface TokenCardProps {
  token: Token;
  offers?: Offer[];
  onBuy?: (offer: Offer) => void;
  onSell?: (token: Token) => void;
  isOwner?: boolean;
  view?: 'marketplace' | 'account';
  onOfferUpdate?: (offerId: string, newQuantity: number) => void;
}

interface KycStatusData {
  complianceStatus?: string;
  status?: string;
  kycType?: string;
  completedKycs?: string[];
  // Campos adicionales que podrían venir del API
  initialKycCompleted?: boolean;
  livenessKycCompleted?: boolean;
}

export default function TokenCard({ 
  token, 
  offers = [], 
  onBuy, 
  onSell, 
  isOwner = false,
  view = 'marketplace',
  onOfferUpdate
}: TokenCardProps) {
  const [showOffers, setShowOffers] = useState(false);
  const [localOffers, setLocalOffers] = useState<Offer[]>(offers);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [kycFullyCompleted, setKycFullyCompleted] = useState(false);
  const [kycStatusMessage, setKycStatusMessage] = useState('');
  const [isCheckingKyc, setIsCheckingKyc] = useState(false);
  
  const { user } = useAuth();
  
  // Verificar el estado completo del KYC
  useEffect(() => {
    const checkFullKycStatus = async () => {
      if (!user.isLoggedIn || view !== 'account' || !isOwner) return;
      
      setIsCheckingKyc(true);
      try {
        // Verificar estado del KYC
        const kycData = await checkKycStatus(user.externalId) as KycStatusData;
        
        // Log para debugging
        console.log('Estado KYC recibido:', kycData);
        
        // Verificar el estado del KYC
        if (kycData.complianceStatus === 'approved') {
          // Usuario completamente aprobado (ambos KYCs)
          setKycFullyCompleted(true);
        } else if (kycData.complianceStatus === 'approved_no_selling') {
          // Usuario aprobado pero no puede vender (falta liveness)
          setKycFullyCompleted(false);
          setKycStatusMessage('Para vender tokens, debes completar el segundo paso de verificación de identidad (Liveness).');
        } else if (kycData.complianceStatus === 'in_review' || kycData.status === 'pending') {
          // KYC en revisión
          setKycFullyCompleted(false);
          setKycStatusMessage('Tu verificación está siendo procesada. Por favor, espera la aprobación.');
        } else {
          // KYC no completado o rechazado
          setKycFullyCompleted(false);
          setKycStatusMessage('Para vender tokens, primero debes completar el proceso de verificación KYC.');
        }
      } catch (error) {
        console.error('Error verificando estado KYC:', error);
        setKycFullyCompleted(false);
        setKycStatusMessage('Error al verificar el estado de verificación. Por favor, intenta más tarde.');
      } finally {
        setIsCheckingKyc(false);
      }
    };
    
    checkFullKycStatus();
  }, [user, view, isOwner]);
  
  // Actualizar ofertas locales cuando cambian las props
  useEffect(() => {
    setLocalOffers(offers);
  }, [offers]);
  
  const totalOffersQuantity = localOffers.reduce((sum, offer) => sum + offer.quantity, 0);
  const lowestPrice = localOffers.length > 0 
    ? Math.min(...localOffers.map(offer => offer.price_per_token))
    : null;
  
  // Verificar si es un token TKM
  const isTKM = token.name.includes('Kravata Main') || token.name.includes('TKM') || 
               (token.token_symbols && token.token_symbols.includes('TKM'));
  
  const handleBuy = (offer: Offer) => {
    if (onBuy) {
      onBuy(offer);
    }
  };
  
  const updateOfferQuantity = (offerId: string, purchasedQuantity: number) => {
    setLocalOffers(prevOffers => 
      prevOffers.map(offer => {
        if (offer.id === offerId) {
          const newQuantity = Math.max(0, offer.quantity - purchasedQuantity);
          
          if (onOfferUpdate) {
            onOfferUpdate(offerId, newQuantity);
          }
          
          if (newQuantity === 0) {
            return null;
          }
          
          return {
            ...offer,
            quantity: newQuantity
          };
        }
        return offer;
      }).filter(Boolean) as Offer[]
    );
  };
  
  const handleOpenDetailsModal = () => {
    setShowDetailsModal(true);
  };
  
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };
  
  return (
    <>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transition-all hover:shadow-2xl">
        {/* Imagen del token */}
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
          {localOffers.length > 0 ? (
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
              <>
                {isCheckingKyc ? (
                  <div className="text-center py-2">
                    <span className="text-gray-400 text-sm">Verificando estado KYC...</span>
                  </div>
                ) : kycFullyCompleted ? (
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
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                    <p className="text-yellow-400 text-sm mb-2 flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {kycStatusMessage}
                    </p>
                    <Link 
                      href="/kyc-registration" 
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Completar verificación
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowOffers(!showOffers)}
                className={`text-white rounded-full py-2 font-medium transition-all ${
                  localOffers.length === 0 ? 'bg-gray-600 cursor-not-allowed' : ''
                }`}
                style={
                  localOffers.length > 0 
                    ? { background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)' }
                    : {}
                }
                disabled={localOffers.length === 0}
              >
                {localOffers.length === 0 ? 'Sin disponibilidad' : (showOffers ? 'Ocultar ofertas' : 'Ver ofertas')}
              </button>
            )}
            
            {/* Botón de Más información (solo para token TKM) */}
            {isTKM && (
              <button
                onClick={handleOpenDetailsModal}
                className="text-white rounded-full py-2 mt-2 font-medium transition-all bg-blue-600 hover:bg-blue-700"
              >
                Más información
              </button>
            )}
          </div>
        </div>
        
        {/* Listado de ofertas (desplegable) */}
        {showOffers && localOffers.length > 0 && (
          <div className="p-4 bg-gray-900">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Ofertas disponibles:</h4>
            <ul className="space-y-2">
              {localOffers.map((offer) => (
                <li key={offer.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <div>
                    <div className="text-sm text-white">{offer.quantity} tokens</div>
                    <div className="text-xs text-gray-400">
                      Vendedor: {offer.seller?.wallet_address 
                        ? `${offer.seller.wallet_address.slice(0, 6)}....${offer.seller.wallet_address.slice(-4)}` 
                        : offer.seller_id.slice(0, 8)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold" style={{ color: '#8CCA6E' }}>
                      {formatCurrency(offer.price_per_token)}
                    </div>
                    <button 
                      onClick={() => handleBuy(offer)} 
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
      
      {/* Modal de detalles del token */}
      {showDetailsModal && (
        <TokenDetailModal 
          token={token}
          isOpen={showDetailsModal}
          onClose={handleCloseDetailsModal}
        />
      )}
    </>
  );
}