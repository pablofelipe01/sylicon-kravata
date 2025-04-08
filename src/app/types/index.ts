// Tipos relacionados con KYC
export interface KycStatus {
    complianceStatus: string;
    externalId: string;
    firstName: string;
    surname: string;
  }
  
  export interface KycFormResponse {
    kycLink: string;
  }
  
  // Tipos relacionados con Wallet
  export interface WalletBalance {
    walletId: string;
    walletAddress: string;
    externalId: string;
    balance: number;
  }
  
  // Tipos relacionados con Transacciones
  export interface Transaction {
    transactionId: string;
    role: "buyer" | "seller";
    token: string;
    amount: number;
    pricePerToken: number;
    registerDate: string;
  }
  
  export interface TransactionHistory {
    transactions: Transaction[];
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
  }
  
  export interface OrderDetail {
    // Define según la respuesta real de la API
    transactionId: string;
    // Otros campos...
  }

  // Tipo para la respuesta de PSE URL
export interface PseUrlResponse {
  pseURL: string;
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

// Tipo actualizado para la respuesta de balance de billetera
export interface WalletBalance {
  walletId: string;
  walletAddress: string;
  externalId: string;
  balance: TokenBalance[] | number; // Compatible con ambos formatos
}