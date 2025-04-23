import React from 'react';
import Image from 'next/image';
import { TokenBalance } from '@/app/types';
import { Button, Card } from '@/app/components/ui';
import { truncateAddress } from '@/app/lib/formatters';

interface UserTokensSectionProps {
  tokens: TokenBalance[];
  onSellToken: (token: TokenBalance) => void;
  marketplaceTokens?: unknown[]; // Acepta tokens del marketplace para buscar imágenes
}

export default function UserTokensSection({ 
  tokens, 
  onSellToken, 
  marketplaceTokens = [] 
}: UserTokensSectionProps) {
  if (!tokens.length) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-400">No posees tokens en tu billetera.</p>
      </Card>
    );
  }
  
  // Función para encontrar la imagen de un token en el marketplace
  const getTokenImage = (tokenAddress: string) => {
    const foundToken = marketplaceTokens.find(t => 
      t.token_address.toLowerCase() === tokenAddress.toLowerCase()
    );
    
    return foundToken?.image_url || null;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokens.map((token, index) => {
        const tokenImage = getTokenImage(token.tokenAddress);
        
        return (
          <div key={`${token.tokenAddress}-${index}`} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {/* Contenedor de imagen sin padding lateral y a ancho completo */}
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
                  {Number(token.amount) > 0 && (
                    <Button
                      onClick={() => onSellToken(token)}
                      variant="success"
                      size="sm"
                    >
                      Vender
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}