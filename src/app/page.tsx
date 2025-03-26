"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [externalId, setExternalId] = useState("test-user-001");
  const [apiResponse, setApiResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormKyc = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/kravata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ externalId })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setApiResponse(data);
      
      if (data.kycLink) {
        window.open(data.kycLink, '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/kravata?externalId=${externalId}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Sylicon Logo"
            width={150}
            height={40}
            priority
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="externalId" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            External ID:
          </label>
          <input
            type="text"
            id="externalId"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleFormKyc}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Get KYC Form'}
          </button>
          
          <button
            onClick={checkStatus}
            disabled={loading}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {apiResponse && (
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
      </div>
      
      <div className="text-sm text-gray-500">
        © 2025 Sylicon API
      </div>
    </div>
  );
}