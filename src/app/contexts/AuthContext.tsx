"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWalletBalance, checkKycStatus } from '../lib/api';
import { TokenBalance } from '../types';

// Definir la estructura del contexto de autenticación
interface AuthContextType {
  user: {
    isLoggedIn: boolean;
    externalId: string;
    walletId: string;
    walletAddress: string;
    balance: number;  // Mantenemos balance como número para compatibilidad
    tokens: TokenBalance[];  // Añadimos array de tokens
    kycStatus: string | null;
  };
  login: (externalId: string) => Promise<void>;
  logout: () => void;
  refreshBalance: () => Promise<void>;
  checkKycStatus: () => Promise<string>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para acceder al contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Props para el proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Componente proveedor de autenticación
export function AuthProvider({ children }: AuthProviderProps) {
  // Estado del usuario
  const [user, setUser] = useState({
    isLoggedIn: false,
    externalId: '',
    walletId: '',
    walletAddress: '',
    balance: 0,
    tokens: [] as TokenBalance[],
    kycStatus: null as string | null,
  });

  // Efecto para recuperar la sesión al cargar
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setUser({
          ...parsedAuth,
          isLoggedIn: true
        });
      } catch (err) {
        console.error('Error parsing stored auth:', err);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // Función para iniciar sesión
  const login = async (externalId: string) => {
    try {
      // Obtener balance de la billetera
      const walletData = await getWalletBalance(externalId);
      
      // Verificar si la respuesta tiene la nueva estructura o la antigua
      const tokens = Array.isArray(walletData.balance) ? walletData.balance : [];
      const balance = Array.isArray(walletData.balance) 
        ? walletData.balance.reduce((sum, token) => sum + Number(token.amount), 0) 
        : walletData.balance;
      
      // Actualizar estado del usuario
      const userData = {
        externalId: walletData.externalId,
        walletId: walletData.walletId,
        walletAddress: walletData.walletAddress,
        balance: balance,
        tokens: tokens,
        kycStatus: null
      };
      
      setUser({
        ...userData,
        isLoggedIn: true
      });
      
      // Guardar en localStorage
      localStorage.setItem('auth', JSON.stringify(userData));
      
      // Verificar estado KYC
      await checkUserKycStatus();
    } catch (err) {
      console.error('Error during login:', err);
      throw err;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser({
      isLoggedIn: false,
      externalId: '',
      walletId: '',
      walletAddress: '',
      balance: 0,
      tokens: [],
      kycStatus: null
    });
    localStorage.removeItem('auth');
  };

  // Función para actualizar balance
  const refreshBalance = async () => {
    if (!user.externalId) return;
    
    try {
      const walletData = await getWalletBalance(user.externalId);
      
      // Verificar si la respuesta tiene la nueva estructura o la antigua
      const tokens = Array.isArray(walletData.balance) ? walletData.balance : [];
      const balance = Array.isArray(walletData.balance) 
        ? walletData.balance.reduce((sum, token) => sum + Number(token.amount), 0) 
        : walletData.balance;
      
      // Actualizar estado del usuario
      setUser(prev => ({
        ...prev,
        walletId: walletData.walletId,
        walletAddress: walletData.walletAddress,
        balance,
        tokens
      }));
      
      // Actualizar en localStorage
      localStorage.setItem('auth', JSON.stringify({
        externalId: user.externalId,
        walletId: walletData.walletId,
        walletAddress: walletData.walletAddress,
        balance,
        tokens,
        kycStatus: user.kycStatus
      }));
    } catch (err) {
      console.error('Error refreshing balance:', err);
      throw err;
    }
  };

  // Función para verificar estado KYC
  const checkUserKycStatus = async (): Promise<string> => {
    if (!user.externalId) return 'unknown';
    
    try {
      const kycData = await checkKycStatus(user.externalId);
      
      const status = kycData.status || 'unknown';
      
      // Actualizar estado del usuario
      setUser(prev => ({
        ...prev,
        kycStatus: status
      }));
      
      // Actualizar en localStorage
      localStorage.setItem('auth', JSON.stringify({
        externalId: user.externalId,
        walletId: user.walletId,
        walletAddress: user.walletAddress,
        balance: user.balance,
        tokens: user.tokens,
        kycStatus: status
      }));
      
      return status;
    } catch (err) {
      console.error('Error checking KYC status:', err);
      return 'error';
    }
  };

  // Contexto a proporcionar
  const value = {
    user,
    login,
    logout,
    refreshBalance,
    checkKycStatus: checkUserKycStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}