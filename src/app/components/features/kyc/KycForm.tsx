"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
import { getKycForm } from '../../../lib/api';

interface KycFormProps {
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
}

export default function KycForm({ onSuccess, onError }: KycFormProps) {
  const [externalId, setExternalId] = useState("test-user-001");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await getKycForm(externalId);
      onSuccess(data);
      
      if (data.kycLink) {
        window.open(data.kycLink, '_blank');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        variant="primary"
        fullWidth
        loading={loading}
      >
        Get KYC Form
      </Button>
    </form>
  );
}