import {
  KycFormResponse,
  KycStatus,
  WalletBalance,
  TransactionHistory,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderDetail,
  PseUrlResponse
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
 * @param externalId - ID externo del usuario
 * @param kycType - Tipo de KYC opcional: 'liveness' para el segundo paso
 */
export async function getKycForm(externalId: string, kycType?: 'liveness'): Promise<KycFormResponse> {
  console.log('Solicitando formulario KYC para:', externalId, kycType ? `Tipo: ${kycType}` : 'Tipo: inicial');
  
  // Validación del parámetro
  if (!externalId || externalId.trim() === '') {
    throw new Error('externalId is required');
  }
  
  // Construir el body de la petición
  const requestBody: unknown = { externalId: externalId.trim() };
  
  // Añadir kycType solo si es 'liveness'
  if (kycType === 'liveness') {
    requestBody.kycType = 'liveness';
  }
  
  return fetchAPI<KycFormResponse>('/api/kravata', {
    method: 'POST',
    body: JSON.stringify(requestBody),
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

/**
 * Obtiene la URL de pago PSE para una transacción específica
 * @param transactionId ID de la transacción para la cual obtener la URL de PSE
 * @param bankCode Código del banco seleccionado por el usuario
 * @param bankName Nombre del banco seleccionado por el usuario
 * @returns Objeto con la URL de PSE
 */
export async function getPseUrl(transactionId: string, bankCode?: string, bankName?: string): Promise<PseUrlResponse> {
  console.log('Solicitando URL de PSE para transacción:', transactionId);
  if (bankCode && bankName) {
    console.log(`Banco: ${bankName} (Código: ${bankCode})`);
  }
  
  // Validación del parámetro
  if (!transactionId || transactionId.trim() === '') {
    throw new Error('transactionId is required');
  }
  
  // Construir la URL con el banco si está presente
  let url = `/api/kravata/order/pse?transactionId=${encodeURIComponent(transactionId.trim())}`;
  if (bankCode && bankName) {
    url += `&bankName=${encodeURIComponent(bankName)}&bankCode=${encodeURIComponent(bankCode)}`;
  }
  
  return fetchAPI<PseUrlResponse>(url, {
    method: 'GET',
  });
}