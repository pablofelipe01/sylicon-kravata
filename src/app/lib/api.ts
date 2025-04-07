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
    console.log(`Realizando petición a ${endpoint}`, {
      method: options.method || 'GET',
      headers: options.headers,
      bodyLength: options.body ? JSON.stringify(options.body).length : 0
    });

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log(`Respuesta recibida de ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en respuesta de API (${endpoint}):`, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`Datos recibidos de ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error en petición API (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Obtiene el enlace del formulario KYC
 */
export async function getKycForm(externalId: string): Promise<KycFormResponse> {
  console.log('Solicitando formulario KYC para:', externalId);
  
  // Validación del parámetro
  if (!externalId || externalId.trim() === '') {
    throw new Error('externalId is required');
  }
  
  return fetchAPI<KycFormResponse>('/api/kravata', {
    method: 'POST',
    body: JSON.stringify({ externalId: externalId.trim() }),
  });
}

/**
 * Verifica el estado del KYC
 */
export async function checkKycStatus(externalId: string): Promise<KycStatus> {
  console.log('Verificando estado KYC para:', externalId);
  
  // Validación del parámetro
  if (!externalId || externalId.trim() === '') {
    throw new Error('externalId is required');
  }
  
  return fetchAPI<KycStatus>(`/api/kravata?externalId=${encodeURIComponent(externalId.trim())}`, {
    method: 'GET',
  }).then(response => {
    console.log('Respuesta completa de API para checkKycStatus:', response);
    
    // Puedes añadir aquí mapeo de estados si es necesario
    /*
    if (response.status) {
      // Mapeo de estados de Kravata a estados de la aplicación
      const statusMap = {
        'APPROVED': 'completed',
        'REJECTED': 'rejected',
        'PENDING': 'pending'
      };
      
      response.status = statusMap[response.status] || response.status;
    }
    */
    
    return response;
  });
}

/**
 * Obtiene el balance de la billetera
 */
export async function getWalletBalance(externalId: string): Promise<WalletBalance> {
  console.log('Solicitando balance de billetera para:', externalId);
  
  // Validación del parámetro
  if (!externalId || externalId.trim() === '') {
    throw new Error('externalId is required');
  }
  
  return fetchAPI<WalletBalance>(`/api/kravata/balance?externalId=${encodeURIComponent(externalId.trim())}`, {
    method: 'GET',
  });
}

/**
 * Obtiene el historial de transacciones
 */
export async function getTransactionHistory(externalId: string): Promise<TransactionHistory> {
  console.log('Solicitando historial de transacciones para:', externalId);
  
  // Validación del parámetro
  if (!externalId || externalId.trim() === '') {
    throw new Error('externalId is required');
  }
  
  return fetchAPI<TransactionHistory>(`/api/kravata/transactions?externalId=${encodeURIComponent(externalId.trim())}`, {
    method: 'GET',
  });
}

/**
 * Obtiene el detalle de una orden
 */
export async function getOrderDetail(transactionId: string): Promise<OrderDetail> {
  console.log('Solicitando detalle de orden para transacción:', transactionId);
  
  // Validación del parámetro
  if (!transactionId || transactionId.trim() === '') {
    throw new Error('transactionId is required');
  }
  
  return fetchAPI<OrderDetail>(`/api/kravata/order/detail?transactionId=${encodeURIComponent(transactionId.trim())}`, {
    method: 'GET',
  });
}

/**
 * Crea una nueva orden
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  console.log('Creando nueva orden con datos:', orderData);
  
  // Validación básica
  if (!orderData) {
    throw new Error('orderData is required');
  }
  
  return fetchAPI<CreateOrderResponse>('/api/kravata/order', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}