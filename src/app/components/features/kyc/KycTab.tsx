"use client";

import { useState } from 'react';
import KycForm from './KycForm';
import KycStatus from './KycStatus';

interface KycTabProps {
  setApiResponse: (data: unknown) => void;
  setError: (error: string | null) => void;
}

export default function KycTab({ setApiResponse, setError }: KycTabProps) {
  const handleSuccess = (data: unknown) => {
    setError(null);
    setApiResponse(data);
  };

  const handleError = (error: string) => {
    setError(error);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Get KYC Form</h3>
        <KycForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Check KYC Status</h3>
        <KycStatus 
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}