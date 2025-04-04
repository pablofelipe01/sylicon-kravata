"use client";

import { useState, useEffect } from 'react';
import { getTransactionHistory } from '@/app/lib/api';
import { TransactionHistory } from '@/app/types';
import { formatCurrency } from '@/app/lib/formatters';

interface UserTransactionHistoryProps {
  externalId: string;
}

export default function UserTransactionHistory({ externalId }: UserTransactionHistoryProps) {
  const [transactionData, setTransactionData] = useState<TransactionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      if (!externalId) return;
      
      try {
        setLoading(true);
        const data = await getTransactionHistory(externalId);
        setTransactionData(data);
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError(err instanceof Error ? err.message : "Error al cargar el historial de transacciones");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [externalId]);

  // Función para formatear fechas de forma segura
  const formatDate = (dateString: string) => {
    try {
      // Intentar crear un objeto Date válido
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return "Fecha no disponible";
      }
      
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha no disponible";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300 mb-4">
        {error}
      </div>
    );
  }

  // Si no hay datos o no hay transacciones
  if (!transactionData || !transactionData.transactions || transactionData.transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="px-6 py-4 bg-gray-900">
          <h3 className="text-lg font-semibold text-white">Historial de Transacciones</h3>
        </div>
        <div className="p-6 text-center text-gray-400">
          No hay transacciones para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4 bg-gray-900">
        <h3 className="text-lg font-semibold text-white">Historial de Transacciones</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactionData.transactions.map((transaction) => {
              // Determinar estilo basado en el rol (comprador/vendedor)
              const roleStyles = 
                transaction.role === 'buyer' ? 'bg-green-900/40 text-green-400' : 
                transaction.role === 'seller' ? 'bg-blue-900/40 text-blue-400' : 
                'bg-gray-700 text-gray-300';
              
              // Formatear el rol
              const roleText = 
                transaction.role === 'buyer' ? 'Compra' : 
                transaction.role === 'seller' ? 'Venta' : 
                transaction.role;
              
              return (
                <tr key={transaction.transactionId} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(transaction.registerDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyles}`}>
                      {roleText}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {transaction.token || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {transaction.amount || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatCurrency(transaction.pricePerToken || 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}