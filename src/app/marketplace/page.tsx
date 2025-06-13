"use client";

import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
import { 
  getTokens, 
  getActiveOffers, 
  Token, 
  Offer,
  createOrder as createSupabaseOrder,
  updateOfferStatus
} from "../lib/supabase";
import { initializeMarketplaceData } from "../lib/initialize-data";
import TokenCard from "../components/marketplace/TokenCard";
import BuyTokenModal from "../components/marketplace/BuyTokenModal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, Card } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { createOrder } from "../lib/api"; // Importar createOrder desde api.ts para Kravata
import { CreateOrderRequest } from "../types";
import { getTokenSymbol } from "../lib/tokenMapping"; // Importar la función de mapeo

// Función para enmascarar el ID, mostrando solo los primeros 2 y últimos 1 caracteres
const maskExternalId = (id: string): string => {
  if (!id || id.length < 4) return id;
  
  const firstPart = id.substring(0, 2);
  const lastPart = id.substring(id.length - 1);
  const maskedPart = '.'.repeat(id.length - 3);
  
  return `${firstPart}${maskedPart}${lastPart}`;
};

export default function MarketplacePage() {
  const { user, refreshBalance, isLoading } = useAuth();
  
  const [tokens, setTokens] = useState<Token[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        
        // Inicializar datos de ejemplo si es necesario
        await initializeMarketplaceData();
        
        // Cargar tokens y ofertas activas (de todos los usuarios)
        const tokensData = await getTokens();
        const offersData = await getActiveOffers();
        
        setTokens(tokensData);
        setOffers(offersData);
      } catch (err) {
        console.error("Error loading marketplace data:", err);
        setError("Error al cargar los datos del marketplace");
      } finally {
        setLoadingData(false);
      }
    }
    
    loadData();
  }, []);
  
  // Agrupar ofertas por token
  const getOffersForToken = (tokenId: string) => {
    return offers.filter(offer => offer.token_id === tokenId);
  };
  
  // Verificar si el usuario actual es propietario de un token
  const isTokenOwner = (tokenAddress: string) => {
    // Para este caso específico, un usuario es dueño del token
    // si tiene al menos una oferta de venta para ese token
    if (!user.isLoggedIn) return false;
    
    const userOffers = offers.filter(
      offer => offer.seller?.external_id === user.externalId
    );
    
    return userOffers.some(
      offer => offer.token?.token_address === tokenAddress
    );
  };
  
  // Manejar la compra de tokens
  const handleBuyToken = (offer: Offer) => {
    if (!user.isLoggedIn) {
      setError("Debes iniciar sesión para comprar tokens");
      return;
    }
    
    setSelectedOffer(offer);
    setBuyModalOpen(true);
  };
  
  // Procesar la compra - ACTUALIZADA PARA INCLUIR bankName
  const handleProcessPurchase = async (offerId: string, quantity: number, bankName: string): Promise<string> => {
    if (!selectedOffer || !user.externalId || !user.walletId) {
      throw new Error("Debes iniciar sesión para comprar tokens");
    }
    
    try {
      // Obtener detalles de la oferta
      if (!selectedOffer.token || !selectedOffer.seller) {
        throw new Error("Información de oferta incompleta");
      }
      
      // Comprobar si hay suficientes tokens disponibles
      if (selectedOffer.quantity < quantity) {
        throw new Error('No hay suficientes tokens disponibles');
      }
      
      console.log("Procesando compra para oferta:", selectedOffer);
      console.log("Banco seleccionado:", bankName);
      
      // Obtener el símbolo correcto del token basado en su dirección
      const tokenSymbol = getTokenSymbol(
        selectedOffer.token.token_address, 
        selectedOffer.token.name
      );
      
      console.log(`Usando símbolo de token: ${tokenSymbol} para dirección: ${selectedOffer.token.token_address}`);
      
      // Preparar datos para la orden en Kravata
      const orderData: CreateOrderRequest = {
        amount: selectedOffer.price_per_token * quantity,
        token: tokenSymbol,
        methodPay: 'PSE',
        recipientId: user.externalId,
        recipientWalletId: user.walletId || '',
        tokensReceived: quantity,
        sellers: [
          {
            walletId: selectedOffer.seller.wallet_id || '',
            externalId: selectedOffer.seller.external_id,
            tokensSold: quantity,
            pricePerToken: selectedOffer.price_per_token
          }
        ],
        // Si tu API de Kravata necesita el banco aquí, puedes agregarlo
        // bank: bankName
      };
      
      console.log("Datos de orden validados. Preparando solicitud:", orderData);
      
      // Crear la orden en Kravata
      const kravataOrderResponse = await createOrder(orderData);
      
      // Crear registro de la orden en Supabase
      await createSupabaseOrder({
        buyer_external_id: user.externalId,
        buyer_wallet_id: user.walletId,
        offer_id: offerId,
        quantity,
        total_price: selectedOffer.price_per_token * quantity,
        status: 'pending',
        transaction_id: kravataOrderResponse.transactionId
      });
      
      // Actualizar la cantidad de tokens disponibles en la oferta
      const newQuantity = selectedOffer.quantity - quantity;
      
      if (newQuantity <= 0) {
        // Marcar oferta como vendida si no quedan tokens
        await updateOfferStatus(offerId, 'sold');
        // Actualizar ofertas en el estado
        setOffers(prev => prev.filter(o => o.id !== offerId));
      } else {
        // Actualizar cantidad en la oferta
        await updateOfferStatus(offerId, 'active', newQuantity);
        // Recargar todas las ofertas
        const updatedOffers = await getActiveOffers();
        setOffers(updatedOffers);
      }
      
      // Recargar balance del usuario
      if (refreshBalance) {
        await refreshBalance();
      }
      
      // Cerrar el modal
      setBuyModalOpen(false);
      
      // Devolver el ID de transacción para su uso con PSE
      return kravataOrderResponse.transactionId;
      
    } catch (err) {
      console.error("Error processing purchase:", err);
      throw new Error(err instanceof Error ? err.message : "Error al procesar la compra");
    }
  };
  
  // Renderizar contenido basado en estado de carga
  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
               style={{ borderColor: '#8CCA6E', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-400">Cargando marketplace...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Marketplace de Tokens Inmobiliarios</h1>
          
          {user.isLoggedIn && (
            <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-400">
                  ID: <span className="font-mono">{maskExternalId(user.externalId)}</span>
                  <span className="ml-1 text-xs text-gray-500">(oculto por seguridad)</span>
                </p>
                <p className="text-sm text-gray-400">Balance: <span style={{ color: '#8CCA6E' }} className="font-bold">{user.balance} tokens</span></p>
              </div>
              <button
                onClick={refreshBalance}
                disabled={isLoading}
                className="px-3 py-1 text-sm font-medium text-white rounded-md transition-all"
                style={{ 
                  background: isLoading ? 'rgba(58, 141, 140, 0.5)' : 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                  backgroundSize: '200% auto',
                }}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300">
            {error}
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Tokens Disponibles</h2>
          
          {tokens.length === 0 ? (
            <Card className="p-8 text-center bg-gray-800 text-gray-400">
              <p>No hay tokens disponibles en el marketplace.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map(token => {
                const tokenOffers = getOffersForToken(token.id);
                
                // Solo mostrar tokens que tienen ofertas activas
                if (tokenOffers.length === 0) return null;
                
                return (
                  <TokenCard
                    key={token.id}
                    token={token}
                    offers={tokenOffers}
                    isOwner={isTokenOwner(token.token_address)}
                    onBuy={handleBuyToken}
                    view="marketplace" // Especificamos explícitamente que estamos en el marketplace
                  />
                );
              })}
            </div>
          )}
        </div>
        
        {/* Modal para comprar tokens */}
        {selectedOffer && (
          <BuyTokenModal
            isOpen={buyModalOpen}
            onClose={() => setBuyModalOpen(false)}
            offer={selectedOffer}
            buyerExternalId={user.externalId}
            buyerWalletId={user.walletId}
            buyerWalletAddress={user.walletAddress || ''} // Agregamos el wallet address
            onSubmit={handleProcessPurchase}
          />
        )}
      </div>
    </div>
  );
}