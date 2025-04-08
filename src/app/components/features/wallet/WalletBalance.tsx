"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
import { getWalletBalance } from '../../../lib/api';
import { truncateAddress } from '../../../lib/formatters';
import { WalletBalance as WalletBalanceType, TokenBalance } from '../../../types';

interface WalletBalanceProps {
  onSuccess: (data: WalletBalanceType) => void;
  onError: (error: string) => void;
}

export default function WalletBalance({ onSuccess, onError }: WalletBalanceProps) {
  const [externalId, setExternalId] = useState("test-user-001");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await getWalletBalance(externalId);
      onSuccess(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          id="externalId"
          label="External ID:"
          value={externalId}
          onChange={(e) => setExternalId(e.target.value)}
          required
        />
        
        <Button 
          type="submit"
          variant="success"
          fullWidth
          loading={loading}
        >
          Check Wallet Balance
        </Button>
      </form>
    </div>
  );
}

// Componente para mostrar los detalles del balance
export function WalletInfo({ data }: { data: WalletBalanceType }) {
  const [expandedTokenIndex, setExpandedTokenIndex] = useState<number | null>(null);
  
  // Determinar si el balance es un array de tokens o un número simple
  const isMultiToken = Array.isArray(data.balance);
  
  // Calcular el balance total si es un array
  const totalBalance = isMultiToken
    ? data.balance.reduce((sum, token) => sum + Number(token.amount), 0)
    : data.balance;
    
  return (
    <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
      <p className="text-blue-800 dark:text-blue-300 font-medium">Wallet Address:</p>
      <p className="text-sm break-all">{data.walletAddress}</p>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
        ({truncateAddress(data.walletAddress)})
      </div>
      
      <p className="text-blue-800 dark:text-blue-300 font-medium">Wallet ID:</p>
      <p className="text-sm mb-4">{data.walletId}</p>
      
      <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-blue-800 dark:text-blue-300 font-medium">Total Balance:</p>
          <p className="text-xl font-bold">{totalBalance} tokens</p>
        </div>
        
        {isMultiToken && (
          <div className="mt-4">
            <p className="text-blue-800 dark:text-blue-300 font-medium mb-2">Token Details:</p>
            <div className="space-y-2">
              {(data.balance as TokenBalance[]).map((token, index) => (
                <div 
                  key={token.tokenAddress}
                  className="bg-white dark:bg-gray-800 rounded-md overflow-hidden border border-blue-200 dark:border-blue-700"
                >
                  <div 
                    className="p-3 flex justify-between items-center cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
                    onClick={() => setExpandedTokenIndex(expandedTokenIndex === index ? null : index)}
                  >
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {token.symbol ? token.symbol : "No Symbol"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{token.amount} tokens</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{token.standard}</p>
                    </div>
                  </div>
                  
                  {expandedTokenIndex === index && (
                    <div className="p-3 border-t border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-gray-900">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span className="font-medium">Blockchain:</span> {token.blockchain}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span className="font-medium">Token Address:</span> {truncateAddress(token.tokenAddress)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Metadata:</span> {token.metadata}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}