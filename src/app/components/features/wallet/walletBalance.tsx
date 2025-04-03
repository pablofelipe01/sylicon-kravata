"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
import { getWalletBalance } from '../../../lib/api';
import { truncateAddress } from '../../../lib/formatters';
import { WalletBalance as WalletBalanceType } from '../../../types';

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
  return (
    <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
      <p className="text-blue-800 dark:text-blue-300 font-medium">Wallet Address:</p>
      <p className="text-sm break-all">{data.walletAddress}</p>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
        ({truncateAddress(data.walletAddress)})
      </div>
      
      <p className="text-blue-800 dark:text-blue-300 font-medium">Wallet ID:</p>
      <p className="text-sm mb-2">{data.walletId}</p>
      
      <p className="text-blue-800 dark:text-blue-300 font-medium">Balance:</p>
      <p className="text-2xl font-bold">{data.balance} Tokens</p>
    </div>
  );
}