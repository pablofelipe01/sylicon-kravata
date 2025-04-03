"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
import { getOrderDetail } from '../../../lib/api';
import { OrderDetail as OrderDetailType } from '../../../types';

interface OrderDetailProps {
  onSuccess: (data: OrderDetailType) => void;
  onError: (error: string) => void;
}

export default function OrderDetail({ onSuccess, onError }: OrderDetailProps) {
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId) {
      onError("Transaction ID is required");
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await getOrderDetail(transactionId);
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
          id="transactionId"
          label="Transaction ID:"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="e.g. b7a741d5-30c5-49c5-81e1-53a4740b66ba"
          required
        />
        
        <Button 
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
        >
          Get Order Details
        </Button>
      </form>
    </div>
  );
}

// Componente para mostrar los detalles de la orden
export function OrderDetailView({ data }: { data: OrderDetailType }) {
  // Asegúrate de que data no sea null
  if (!data) {
    return <p className="text-red-500 dark:text-red-400">No data available</p>;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Order Details</h3>
      
      <div className="space-y-3">
        {data.transactionId && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</p>
            <p className="text-sm break-all">{data.transactionId}</p>
          </div>
        )}
        
        {/* Renderizar otros campos de datos de manera segura */}
        {Object.entries(data).map(([key, value]) => {
          if (key === 'transactionId') return null; // Ya lo mostramos arriba
          
          return (
            <div key={key}>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </p>
              <p className="text-sm break-all">
                {value === null 
                  ? 'N/A' 
                  : (typeof value === 'object' 
                      ? (value === null ? 'N/A' : JSON.stringify(value)) 
                      : String(value)
                    )
                }
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}