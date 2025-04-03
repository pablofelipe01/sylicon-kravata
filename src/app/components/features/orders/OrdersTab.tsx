"use client";

import { useState } from 'react';
import OrderDetail, { OrderDetailView } from './OrderDetail';
import OrderForm, { OrderCreationResponse } from './OrderForm';
import { OrderDetail as OrderDetailType, CreateOrderResponse } from '../../../types';

interface OrdersTabProps {
  setApiResponse: (data: unknown) => void;
  setError: (error: string | null) => void;
}

export default function OrdersTab({ setApiResponse, setError }: OrdersTabProps) {
  const [activeSection, setActiveSection] = useState<'detail' | 'create'>('detail');
  const [orderDetailData, setOrderDetailData] = useState<OrderDetailType | null>(null);
  const [orderCreationData, setOrderCreationData] = useState<CreateOrderResponse | null>(null);

  const handleDetailSuccess = (data: OrderDetailType) => {
    setError(null);
    setOrderDetailData(data);
    setApiResponse(data);
  };

  const handleCreateSuccess = (data: CreateOrderResponse) => {
    setError(null);
    setOrderCreationData(data);
    setApiResponse(data);
  };

  const handleError = (error: string) => {
    setError(error);
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveSection('detail')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeSection === 'detail'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Check Order Details
        </button>
        <button
          onClick={() => setActiveSection('create')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeSection === 'create'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Create New Order
        </button>
      </div>

      {activeSection === 'detail' ? (
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Order Details</h3>
          <OrderDetail 
            onSuccess={handleDetailSuccess}
            onError={handleError}
          />
          {orderDetailData && <OrderDetailView data={orderDetailData} />}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Create New Order</h3>
          <OrderForm 
            onSuccess={handleCreateSuccess}
            onError={handleError}
          />
          {orderCreationData && <OrderCreationResponse data={orderCreationData} />}
        </div>
      )}
    </div>
  );
}