"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, Tabs } from "./components/ui";
import KycTab from "./components/features/kyc/KycTab";
import WalletBalance, { WalletInfo } from "./components/features/wallet/WalletBalance";
import TransactionHistory, { TransactionTable } from "./components/features/transactions/TransactionHistory";
import OrdersTab from "./components/features/orders/OrdersTab";
import { WalletBalance as WalletBalanceType, TransactionHistory as TransactionHistoryType } from "./types";

export default function Home() {
  const [activeTab, setActiveTab] = useState('kyc');
  const [apiResponse, setApiResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  // Configuración de pestañas
  const tabs = [
    { label: 'KYC', value: 'kyc' },
    { label: 'Wallet', value: 'wallet' },
    { label: 'Transactions', value: 'transactions' },
    { label: 'Orders', value: 'orders' },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setApiResponse(null);
    setError(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'kyc':
        return <KycTab setApiResponse={setApiResponse} setError={setError} />;
      
      case 'wallet':
        return (
          <div>
            <WalletBalance 
              onSuccess={(data) => {
                setApiResponse(data);
                setError(null);
              }}
              onError={(err) => setError(err)}
            />
            {apiResponse && 'walletAddress' in apiResponse && (
              <WalletInfo data={apiResponse as WalletBalanceType} />
            )}
          </div>
        );
      
      case 'transactions':
        return (
          <div>
            <TransactionHistory 
              onSuccess={(data) => {
                setApiResponse(data);
                setError(null);
              }}
              onError={(err) => setError(err)}
            />
            {apiResponse && 'transactions' in apiResponse && (
              <TransactionTable data={apiResponse as TransactionHistoryType} />
            )}
          </div>
        );
      
      case 'orders':
        return <OrdersTab setApiResponse={setApiResponse} setError={setError} />;
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl mb-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Sylicon Logo"
            width={150}
            height={40}
            priority
          />
        </div>
        
        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        {/* Contenido principal */}
        {renderTabContent()}
        
        {/* Mensajes de error */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Respuesta genérica de API (solo para KYC y otros casos no especiales) */}
        {apiResponse && 
         activeTab === 'kyc' && 
         !('walletAddress' in apiResponse) && 
         !('transactions' in apiResponse) && (
          <div className="mt-4">
            <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Response:</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
            
            {apiResponse.kycLink && (
              <a 
                href={apiResponse.kycLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors text-center w-full"
              >
                Open KYC Form
              </a>
            )}
          </div>
        )}
      </Card>
      
      <div className="text-sm text-gray-500">
        © 2025 Sylicon API
      </div>
    </div>
  );
}