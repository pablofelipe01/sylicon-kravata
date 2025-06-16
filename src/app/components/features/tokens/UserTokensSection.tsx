"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TokenBalance } from '@/app/types';
import { Button, Card } from '@/app/components/ui';
import { truncateAddress } from '@/app/lib/formatters';
import TokenDetailModal from './TokenDetailModal';
import { useAuth } from '@/app/contexts/AuthContext';
import { checkKycStatus } from '@/app/lib/api';
import Link from 'next/link';

interface UserTokensSectionProps {
  tokens: TokenBalance[];
  onSellToken: (token: TokenBalance) => void;
  marketplaceTokens?: unknown[]; // Acepta tokens del marketplace para buscar imágenes
}

interface KycStatusData {
  complianceStatus?: string;
  status?: string;
  initialKycCompleted?: boolean;
  livenessKycCompleted?: boolean;
}

export default function UserTokensSection({ 
  tokens, 
  onSellToken, 
  marketplaceTokens = [] 
}: UserTokensSectionProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [kycFullyCompleted, setKycFullyCompleted] = useState(false);
  const [kycStatusMessage, setKycStatusMessage] = useState('');
  const [isCheckingKyc, setIsCheckingKyc] = useState(false);
  
  // Verificar el estado completo del KYC
  useEffect(() => {
    const checkFullKycStatus = async () => {
      if (!user.isLoggedIn) return;
      
      setIsCheckingKyc(true);
      try {
        const kycData = await checkKycStatus(user.externalId) as KycStatusData;
        
        console.log('Estado KYC recibido en UserTokensSection:', kycData);
        
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
  }, [user]);

  const handleOpenModal = (token: TokenBalance) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedToken(null);
  };

  if (!tokens.length) {
    return (
      <Card className="p-8 text-center bg-gray-800">
        <p className="text-gray-400">No posees tokens en tu billetera.</p>
      </Card>
    );
  }
  
  const getTokenImage = (tokenAddress: string) => {
    const foundToken = marketplaceTokens.find(t => 
      t.token_address.toLowerCase() === tokenAddress.toLowerCase()
    );
    
    return foundToken?.image_url || null;
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token, index) => {
          const tokenImage = getTokenImage(token.tokenAddress);
          const isTokenTKM = token.symbol === "TKM";
          
          return (
            <div key={`${token.tokenAddress}-${index}`} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="w-full overflow-hidden">
                {tokenImage ? (
                  <Image
                    src={tokenImage}
                    alt={token.name}
                    width={400}
                    height={300}
                    className="w-full h-auto"
                    priority
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white text-center px-4 drop-shadow-lg">
                      {token.name}
                    </h3>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{token.name}</h3>
                  <span className="bg-blue-900 text-blue-300 px-2 py-1 text-xs rounded-full">
                    {token.standard}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Symbol:</span>
                    <span className="text-white font-medium">{token.symbol || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Blockchain:</span>
                    <span className="text-white font-medium">{token.blockchain}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Address:</span>
                    <span className="text-white font-medium">{truncateAddress(token.tokenAddress)}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-700 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Balance:</p>
                      <p className="text-lg font-bold text-white">{token.amount} tokens</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {Number(token.amount) > 0 && (
                        <>
                          {isCheckingKyc ? (
                            <span className="text-xs text-gray-400">Verificando KYC...</span>
                          ) : kycFullyCompleted ? (
                            <Button
                              onClick={() => onSellToken(token)}
                              variant="success"
                              size="sm"
                            >
                              Vender
                            </Button>
                          ) : (
                            <div className="text-right">
                              <p className="text-xs text-yellow-400 mb-1">
                                KYC requerido
                              </p>
                              <Link href="/kyc-registration">
                                <Button
                                  variant="warning"
                                  size="sm"
                                >
                                  Completar KYC
                                </Button>
                              </Link>
                            </div>
                          )}
                        </>
                      )}
                      
                      {isTokenTKM && (
                        <Button
                          onClick={() => handleOpenModal(token)}
                          variant="primary"
                          size="sm"
                        >
                          Más info
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mensaje informativo sobre KYC si no está completo */}
      {!kycFullyCompleted && !isCheckingKyc && (
        <div className="mt-6 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
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
            Ir a completar verificación
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
      
      {/* Modal de detalles del token */}
      {selectedToken && (
        <TokenDetailModal 
          token={selectedToken} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}