// Tipos relacionados con KYC
export interface KycStatus {
  complianceStatus?: string; // Puede ser "approved", "approved_no_selling", "in_review", "rejected"
  status?: string; // Campo adicional para compatibilidad
  externalId: string;
  firstName?: string; // Opcional porque puede venir como "pending"
  surname?: string; // Opcional porque puede venir como "pending"
  rejectionReason?: string; // Para casos de rechazo
  // Campos potenciales para tracking de KYC múltiple
  initialKycCompleted?: boolean;
  livenessKycCompleted?: boolean;
  completedKycs?: string[]; // Array de tipos de KYC completados
  kycType?: string;
}

export interface KycFormResponse {
  kycLink: string;
}

// Tipo para un token individual en el balance
export interface TokenBalance {
  amount: string;
  metadata: string;
  blockchain: string;
  name: string;
  standard: string;
  symbol: string;
  tokenAddress: string;
}

// Tipos relacionados con Wallet
export interface WalletBalance {
  walletId: string;
  walletAddress: string;
  externalId: string;
  balance: TokenBalance[] | number; // Compatible con ambos formatos
}

// Tipos relacionados con Transacciones
export interface Transaction {
  transactionId: string;
  role: "buyer" | "seller";
  token: string;
  amount: number;
  pricePerToken: number;
  registerDate: string;
  status?: string; // Estado de la transacción
  type?: string; // Tipo de transacción
}

export interface TransactionHistory {
  transactions: Transaction[];
  externalId?: string;
}

// Tipos relacionados con Órdenes
export interface Seller {
  walletId: string;
  externalId: string;
  tokensSold: number;
  pricePerToken: number;
}

export interface CreateOrderRequest {
  amount: number;
  token: string;
  methodPay: string;
  recipientId: string;
  recipientWalletId: string;
  tokensReceived: number;
  sellers: Seller[];
}

export interface CreateOrderResponse {
  transactionId: string;
  status?: string;
  amount?: number;
  token?: string;
  recipientId?: string;
  createdAt?: string;
  // Añade más campos según la respuesta real de la API
}

export interface OrderDetail {
  transactionId: string;
  amount?: number;
  token?: string;
  status?: string;
  recipientId?: string;
  sellers?: Seller[];
  createdAt?: string;
  updatedAt?: string;
  rawResponse?: string; // Para casos donde la respuesta no es JSON válido
  parseError?: string; // Para errores de parsing
  message?: string; // Para mensajes de estado
}

// Tipo para la respuesta de PSE URL
export interface PseUrlResponse {
  pseURL: string;
  transactionId?: string;
  expiresAt?: string;
}