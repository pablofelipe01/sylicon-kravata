"use client";

import { useState } from 'react';
import { Input, Button } from '../../ui';
import { checkKycStatus } from '../../../lib/api';

interface KycStatusProps {
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
}

export default function KycStatus({ onSuccess, onError }: KycStatusProps) {
  const [externalId, setExternalId] = useState("test-user-001");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await checkKycStatus(externalId);
      onSuccess(data);
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
        variant="secondary"
        fullWidth
        loading={loading}
      >
        Check KYC Status
      </Button>
    </form>
  );
}