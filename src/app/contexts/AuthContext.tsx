"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWalletBalance } from '@/app/lib/api';

// Tipo para el usuario
interface User {
  externalId: string;
  walletId: string;
  walletAddress: string;
  balance: number;
  isLoggedIn: boolean;
}

// Estado inicial del usuario
const initialUser: User = {
  externalId: '',
  walletId: '',
  walletAddress: '',
  balance: 0,
  isLoggedIn: false
};

// Contexto para la autenticación
interface AuthContextType {
  user: User;
  login: (externalId: string) => Promise<void>;
  logout: () => void;
  refreshBalance: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validación de IDs válidos (que pasaron KYC en Kravata)
  const validExternalIds = ['test001', 'test002', 'test003', 'test004'];

  // Comprobar si hay un usuario guardado en localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('sylicon_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Verificar que el ID almacenado es válido
        if (validExternalIds.includes(parsedUser.externalId)) {
          setUser(parsedUser);
          
          // Actualizar el balance al cargar
          refreshUserBalance(parsedUser.externalId);
        } else {
          // Si el ID no es válido, limpiar el almacenamiento
          localStorage.removeItem('sylicon_user');
        }
      } catch (err) {
        console.error('Error al parsear usuario del localStorage:', err);
        localStorage.removeItem('sylicon_user');
      }
    }
  }, []);

  // Función para actualizar el balance del usuario
  const refreshUserBalance = async (externalId: string) => {
    if (!validExternalIds.includes(externalId)) {
      setError('ID no válido para actualizar balance');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const walletData = await getWalletBalance(externalId);
      
      setUser(prev => {
        const updatedUser = {
          ...prev,
          walletId: walletData.walletId,
          walletAddress: walletData.walletAddress,
          balance: walletData.balance,
        };
        
        // Guardar en localStorage
        localStorage.setItem('sylicon_user', JSON.stringify(updatedUser));
        
        return updatedUser;
      });
    } catch (err) {
      console.error('Error al obtener balance:', err);
      setError('Error al obtener información de la billetera');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (externalId: string) => {
    // Validar que el ID es uno de los permitidos
    if (!validExternalIds.includes(externalId)) {
      setError('ID no válido para iniciar sesión');
      throw new Error('ID no válido para iniciar sesión');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Obtener datos de la billetera desde Kravata
      const walletData = await getWalletBalance(externalId);
      
      // Actualizar el usuario
      const newUser = {
        externalId,
        walletId: walletData.walletId,
        walletAddress: walletData.walletAddress,
        balance: walletData.balance,
        isLoggedIn: true
      };
      
      setUser(newUser);
      
      // Guardar en localStorage
      localStorage.setItem('sylicon_user', JSON.stringify(newUser));
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError('Error al iniciar sesión. Verifica tu External ID.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(initialUser);
    localStorage.removeItem('sylicon_user');
  };

  // Función para actualizar el balance
  const refreshBalance = async () => {
    if (!user.externalId) return;
    await refreshUserBalance(user.externalId);
  };

  // Valores del contexto
  const value = {
    user,
    login,
    logout,
    refreshBalance,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}