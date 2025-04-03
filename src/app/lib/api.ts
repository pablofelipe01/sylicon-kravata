import {
    KycFormResponse,
    KycStatus,
    WalletBalance,
    TransactionHistory,
    CreateOrderRequest,
    CreateOrderResponse,
    OrderDetail
  } from '../types';
  
  /**
   * Función base para realizar peticiones a la API
   */
  async function fetchAPI<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene el enlace del formulario KYC
   */
  export async function getKycForm(externalId: string): Promise<KycFormResponse> {
    return fetchAPI<KycFormResponse>('/api/kravata', {
      method: 'POST',
      body: JSON.stringify({ externalId }),
    });
  }
  
  /**
   * Verifica el estado del KYC
   */
  export async function checkKycStatus(externalId: string): Promise<KycStatus> {
    return fetchAPI<KycStatus>(`/api/kravata?externalId=${externalId}`, {
      method: 'GET',
    });
  }
  
  /**
   * Obtiene el balance de la billetera
   */
  export async function getWalletBalance(externalId: string): Promise<WalletBalance> {
    return fetchAPI<WalletBalance>(`/api/kravata/balance?externalId=${externalId}`, {
      method: 'GET',
    });
  }
  
  /**
   * Obtiene el historial de transacciones
   */
  export async function getTransactionHistory(externalId: string): Promise<TransactionHistory> {
    return fetchAPI<TransactionHistory>(`/api/kravata/transactions?externalId=${externalId}`, {
      method: 'GET',
    });
  }
  
  /**
   * Obtiene el detalle de una orden
   */
  export async function getOrderDetail(transactionId: string): Promise<OrderDetail> {
    return fetchAPI<OrderDetail>(`/api/kravata/order/detail?transactionId=${transactionId}`, {
      method: 'GET',
    });
  }
  
  /**
   * Crea una nueva orden
   */
  export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    return fetchAPI<CreateOrderResponse>('/api/kravata/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }