"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
import { getTransactionHistory } from '../../../lib/api';
import { formatDate, formatCurrency } from '../../../lib/formatters';
import { Transaction, TransactionHistory as TransactionHistoryType } from '../../../types';

interface TransactionHistoryProps {
  onSuccess: (data: TransactionHistoryType) => void;
  onError: (error: string) => void;
}

export default function TransactionHistory({ onSuccess, onError }: TransactionHistoryProps) {
  const [externalId, setExternalId] = useState("test-user-001");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await getTransactionHistory(externalId);
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
          variant="warning"
          fullWidth
          loading={loading}
        >
          Get Transaction History
        </Button>
      </form>
    </div>
  );
}

// Componente para mostrar la tabla de transacciones
export function TransactionTable({ data }: { data: TransactionHistoryType }) {
  if (!data.transactions || data.transactions.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 mt-4">No transactions found.</p>;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Role</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Token</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Price</th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.transactions.map((tx: Transaction) => (
            <tr key={tx.transactionId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-3 py-2 whitespace-nowrap text-xs">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  tx.role === 'buyer' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {tx.role === 'buyer' ? 'Buy' : 'Sell'}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs">{tx.token}</td>
              <td className="px-3 py-2 whitespace-nowrap text-xs">{tx.amount}</td>
              <td className="px-3 py-2 whitespace-nowrap text-xs">{formatCurrency(tx.pricePerToken)}</td>
              <td className="px-3 py-2 whitespace-nowrap text-xs">{formatDate(tx.registerDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}