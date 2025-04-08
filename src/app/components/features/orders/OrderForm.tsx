"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
import { createOrder, getPseUrl } from '../../../lib/api';
import { Seller, CreateOrderRequest, CreateOrderResponse } from '../../../types';

interface OrderFormProps {
  onSuccess: (data: CreateOrderResponse) => void;
  onError: (error: string) => void;
}

export default function OrderForm({ onSuccess, onError }: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [orderForm, setOrderForm] = useState<CreateOrderRequest>({
    amount: 0,
    token: "SYL",
    methodPay: "PSE",
    recipientId: "",
    recipientWalletId: "",
    tokensReceived: 0,
    sellers: [{
      walletId: "",
      externalId: "",
      tokensSold: 0,
      pricePerToken: 0
    }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await createOrder(orderForm);
      onSuccess(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Manejadores para actualizar el formulario
  const updateOrderForm = (field: keyof CreateOrderRequest, value: unknown) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const updateSellerField = (index: number, field: keyof Seller, value: unknown) => {
    const newSellers = [...orderForm.sellers];
    newSellers[index] = { ...newSellers[index], [field]: value };
    setOrderForm(prev => ({ ...prev, sellers: newSellers }));
  };

  const addSeller = () => {
    setOrderForm(prev => ({
      ...prev,
      sellers: [
        ...prev.sellers,
        {
          walletId: "",
          externalId: `test00${prev.sellers.length + 2}`,
          tokensSold: 1,
          pricePerToken: 50000
        }
      ]
    }));
  };

  const removeSeller = (index: number) => {
    if (orderForm.sellers.length > 1) {
      const newSellers = [...orderForm.sellers];
      newSellers.splice(index, 1);
      setOrderForm(prev => ({ ...prev, sellers: newSellers }));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Input
            label="Recipient ID"
            value={orderForm.recipientId}
            onChange={(e) => updateOrderForm('recipientId', e.target.value)}
            required
          />
          <Input
            label="Recipient Wallet ID"
            value={orderForm.recipientWalletId}
            onChange={(e) => updateOrderForm('recipientWalletId', e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Input
            label="Total Amount (COP)"
            type="number"
            value={orderForm.amount}
            onChange={(e) => updateOrderForm('amount', Number(e.target.value))}
            required
          />
          <Input
            label="Tokens Received"
            type="number"
            value={orderForm.tokensReceived}
            onChange={(e) => updateOrderForm('tokensReceived', Number(e.target.value))}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Input
            label="Token"
            value={orderForm.token}
            onChange={(e) => updateOrderForm('token', e.target.value)}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Payment Method:
            </label>
            <select
              value={orderForm.methodPay}
              onChange={(e) => updateOrderForm('methodPay', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="PSE">PSE</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
        </div>
        
        {/* Sección de vendedores */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Sellers</h4>
            <button
              type="button"
              onClick={addSeller}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
            >
              + Add Seller
            </button>
          </div>
          
          {orderForm.sellers.map((seller, index) => (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md mb-3">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Seller {index + 1}</h5>
                {orderForm.sellers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSeller(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Input
                  label="External ID"
                  value={seller.externalId}
                  onChange={(e) => updateSellerField(index, 'externalId', e.target.value)}
                  required
                  className="mb-0"
                />
                <Input
                  label="Wallet ID"
                  value={seller.walletId}
                  onChange={(e) => updateSellerField(index, 'walletId', e.target.value)}
                  required
                  className="mb-0"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Tokens Sold"
                  type="number"
                  value={seller.tokensSold}
                  onChange={(e) => updateSellerField(index, 'tokensSold', Number(e.target.value))}
                  required
                  className="mb-0"
                />
                <Input
                  label="Price Per Token"
                  type="number"
                  value={seller.pricePerToken}
                  onChange={(e) => updateSellerField(index, 'pricePerToken', Number(e.target.value))}
                  required
                  className="mb-0"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          type="submit"
          variant="success"
          fullWidth
          loading={loading}
        >
          Create Order
        </Button>
      </form>
    </div>
  );
}

// Componente actualizado para mostrar la respuesta de creación de orden
export function OrderCreationResponse({ data }: { data: CreateOrderResponse }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePseRedirect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { pseURL } = await getPseUrl(data.transactionId);
      window.location.href = pseURL;
    } catch (err) {
      setError("No se pudo obtener la URL de pago PSE. Es posible que la sesión haya expirado. Por favor, intente crear una nueva orden.");
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <h3 className="text-lg font-medium mb-2 text-green-800 dark:text-green-200">Order Created Successfully!</h3>
      <p className="font-medium text-green-700 dark:text-green-300">Transaction ID:</p>
      <p className="text-sm break-all mb-4">{data.transactionId}</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={handlePseRedirect}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirigiendo...' : 'Continuar al pago PSE'}
        </button>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Puedes usar este Transaction ID para verificar los detalles de la orden más tarde.
        </p>
      </div>
    </div>
  );
}