"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  getTokens, 
  getOffersBySeller,
  getSellerByExternalId,
  createOrUpdateSeller,
  Token, 
  Offer,
  createOffer,
  updateOfferStatus
} from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import SellTokenModal from "../components/marketplace/SellTokenModal";
import { Button, Card } from "../components/ui";
import { formatCurrency } from "../lib/formatters";
import { useRouter } from "next/navigation";
import UserTransactionHistory from "../components/features/transactions/UserTransactionHistory";
import UserTokensSection from "../components/features/tokens/UserTokensSection";
import { TokenBalance } from "../types";

export default function DashboardPage() {
  const { user, refreshBalance, isLoading } = useAuth();
  const router = useRouter();
  
  const [tokens, setTokens] = useState<Token[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  
  // Redireccionar si no está logueado
  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push('/');
    }
  }, [user.isLoggedIn, router]);
  
  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      if (!user.isLoggedIn) return;
      
      try {
        setLoadingData(true);
        
        // Cargar tokens y ofertas
        const tokensData = await getTokens();
        setTokens(tokensData);
        
        // Cargar datos del usuario
        await loadUserData();
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoadingData(false);
      }
    }
    
    loadData();
  }, [user.isLoggedIn, user.externalId]);
  
  // Cargar información del usuario y sus ofertas
  const loadUserData = async () => {
    if (!user.externalId) return;
    
    try {
      // Sincronizar datos del vendedor en Supabase
      const seller = await createOrUpdateSeller({
        external_id: user.externalId,
        wallet_id: user.walletId,
        wallet_address: user.walletAddress
      });
      
      // Cargar ofertas del usuario
      if (seller && seller.id) {
        const offersData = await getOffersBySeller(seller.id);
        setMyOffers(offersData);
      }
      
      // Actualizar balance
      await refreshBalance();
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Error al cargar los datos del usuario");
    }
  };
  
  // Manejar la venta de tokens
  const handleSellToken = (token: Token) => {
    setSelectedToken(token);
    setSellModalOpen(true);
  };
  
  // Crear una nueva oferta
  const handleCreateOffer = async (quantity: number, pricePerToken: number, tokenAddress?: string) => {
    if (!user.walletId) return;
    
    try {
      // Obtener o crear el vendedor
      const seller = await getSellerByExternalId(user.externalId);
      
      if (!seller) {
        throw new Error("No se pudo encontrar o crear el vendedor");
      }
      
      // Si se proporciona un tokenAddress específico, buscar el token por su dirección
      let tokenToSell = selectedToken;
      
      if (tokenAddress && (!selectedToken || selectedToken.token_address !== tokenAddress)) {
        const foundToken = tokens.find(t => t.token_address.toLowerCase() === tokenAddress.toLowerCase());
        if (foundToken) {
          tokenToSell = foundToken;
        } else {
          throw new Error("No se encontró el token en el marketplace");
        }
      }
      
      if (!tokenToSell) {
        throw new Error("No se seleccionó un token válido");
      }
      
      // Crear la oferta en Supabase
      const newOffer = await createOffer({
        seller_id: seller.id,
        token_id: tokenToSell.id,
        quantity,
        price_per_token: pricePerToken,
        status: 'active'
      });
      
      // Actualizar ofertas en el estado
      setMyOffers(prev => [...prev, newOffer]);
      
      // Recargar datos del usuario para actualizar balance
      await loadUserData();
      
    } catch (err) {
      console.error("Error creating offer:", err);
      throw new Error("Error al crear la oferta");
    }
  };
  
  // Cancelar una oferta
  const handleCancelOffer = async (offerId: string) => {
    try {
      await updateOfferStatus(offerId, 'cancelled');
      
      // Actualizar ofertas en el estado
      setMyOffers(prev => prev.map(offer => 
        offer.id === offerId ? { ...offer, status: 'cancelled' } : offer
      ));
      
      // Recargar datos del usuario
      await loadUserData();
    } catch (err) {
      console.error("Error cancelling offer:", err);
      setError("Error al cancelar la oferta");
    }
  };
  
  // Renderizar contenido basado en estado de carga
  if (!user.isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h1>
        <p className="text-gray-400 mb-8">Debes iniciar sesión para acceder a esta página.</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-sm font-medium text-white rounded-md transition-all shadow-md hover:shadow-lg"
          style={{ 
            background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
            backgroundSize: '200% auto',
          }}
        >
          Volver al Inicio
        </button>
      </div>
    );
  }
  
  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
               style={{ borderColor: '#8CCA6E', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Mi Cuenta</h1>
          <p className="text-gray-400">Gestiona tus tokens y ofertas en el marketplace</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="rounded-full p-3"
                 style={{ background: 'linear-gradient(135deg, #3A8D8C 0%, #8CCA6E 100%)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">ID: {user.externalId}</p>
              <p className="text-xl font-bold text-white">{user.balance} <span style={{ color: '#8CCA6E' }}>Tokens</span></p>
              <p className="text-xs text-gray-500 truncate max-w-xs">
                {user.walletAddress.slice(0, 10)}...{user.walletAddress.slice(-8)}
              </p>
            </div>
          </div>
          
          <button 
            onClick={refreshBalance} 
            disabled={isLoading}
            className="mt-3 w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-all shadow-md hover:shadow-lg"
            style={{ 
              background: isLoading ? 'rgba(58, 141, 140, 0.5)' : 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
              backgroundSize: '200% auto',
            }}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Balance'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300">
          {error}
        </div>
      )}
      
      {/* Mis Tokens */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Mis Tokens</h2>
          <Link href="/marketplace">
            <button 
              className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-md hover:shadow-lg transition-all"
              style={{ 
                background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                backgroundSize: '200% auto',
              }}
            >
              Ver Marketplace
            </button>
          </Link>
        </div>
        
        {user.tokens.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-400">No posees tokens en tu billetera.</p>
          </Card>
        ) : (
          <UserTokensSection 
            tokens={user.tokens} 
            marketplaceTokens={tokens} // Pasa los tokens del marketplace
            onSellToken={(token: TokenBalance) => {
              // Buscar el token en la lista de tokens disponibles
              const marketplaceToken = tokens.find(t => 
                t.token_address.toLowerCase() === token.tokenAddress.toLowerCase()
              );
              
              if (marketplaceToken) {
                handleSellToken(marketplaceToken);
              } else {
                setError("Este token no está disponible en el marketplace actualmente");
              }
            }}
          />
        )}
      </section>
      
      {/* Mis Ofertas */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Mis Ofertas en el Mercado</h2>
        
        {myOffers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-400">No tienes ofertas activas en el marketplace.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Token</th>
                  <th className="px-6 py-3">Cantidad</th>
                  <th className="px-6 py-3">Precio por Token</th>
                  <th className="px-6 py-3">Valor Total</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 rounded-tr-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {myOffers.map(offer => (
                  <tr key={offer.id} className="bg-gray-900">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {offer.token?.image_url && (
                          <div className="h-10 w-10 relative mr-3 rounded-lg overflow-hidden">
                            <Image 
                              src={offer.token.image_url} 
                              alt={offer.token?.name || 'Token'} 
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{offer.token?.name || 'Token'}</p>
                          <p className="text-xs text-gray-400">{offer.token?.token_address.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{offer.quantity}</td>
                    <td className="px-6 py-4 text-white">{formatCurrency(offer.price_per_token)}</td>
                    <td className="px-6 py-4 text-white">{formatCurrency(offer.quantity * offer.price_per_token)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        offer.status === 'active' 
                          ? 'bg-[#3A8D8C]/20 text-[#8CCA6E]' 
                          : offer.status === 'sold' 
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-gray-700 text-gray-300'
                      }`}>
                        {offer.status === 'active' ? 'Activa' : 
                         offer.status === 'sold' ? 'Vendida' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {offer.status === 'active' && (
                        <button 
                          onClick={() => handleCancelOffer(offer.id)} 
                          className="px-3 py-1 text-xs font-medium text-white rounded-md bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      
      {/* Historial de Transacciones */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white mb-4">Historial de Transacciones</h2>
        <UserTransactionHistory externalId={user.externalId} />
      </section>
      
      {/* Modal para vender tokens */}
      {selectedToken && (
        <SellTokenModal
          isOpen={sellModalOpen}
          onClose={() => setSellModalOpen(false)}
          token={selectedToken}
          maxQuantity={user.balance}
          onSubmit={handleCreateOffer}
        />
      )}
    </div>
  );
}