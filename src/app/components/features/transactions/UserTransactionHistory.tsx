"use client";

import { useState, useEffect } from 'react';
import { getTransactionHistory } from '@/app/lib/api';
import { TransactionHistory } from '@/app/types';
import { formatCurrency } from '@/app/lib/formatters';

interface UserTransactionHistoryProps {
  externalId: string;
}

export default function UserTransactionHistory({ externalId }: UserTransactionHistoryProps) {
  const [transactionData, setTransactionData] = useState<TransactionHistory | null>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tokenFilter, setTokenFilter] = useState<string>('all');
  
  // Lista única de tokens para el filtro de tokens
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);

  useEffect(() => {
    async function loadTransactions() {
      if (!externalId) return;
      
      try {
        setLoading(true);
        const data = await getTransactionHistory(externalId);
        
        // Añadido para depuración: Ver los datos crudos de la API
        console.log("Datos crudos de transacciones:", JSON.stringify(data, null, 2));
        
        setTransactionData(data);
        
        // Inicializar las transacciones filtradas con todas las transacciones
        if (data && data.transactions) {
          setFilteredTransactions(data.transactions);
          
          // Extraer la lista única de tokens para el filtro
          const tokens = data.transactions
            .map(t => t.token)
            .filter((value, index, self) => 
              value && self.indexOf(value) === index
            )
            .sort();
          
          setAvailableTokens(tokens || []);
        }
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError(err instanceof Error ? err.message : "Error al cargar el historial de transacciones");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [externalId]);

  // Efecto para aplicar filtros cuando cambian los criterios
  useEffect(() => {
    if (!transactionData || !transactionData.transactions) return;
    
    let filtered = [...transactionData.transactions];
    
    // Filtrar por fechas
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.registerDate);
        return transactionDate >= fromDate;
      });
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      // Ajustar la fecha "hasta" para incluir todo el día
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.registerDate);
        return transactionDate <= toDate;
      });
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.status === statusFilter
      );
    }
    
    // Filtrar por rol (compra/venta)
    if (roleFilter !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.role === roleFilter
      );
    }
    
    // Filtrar por token específico
    if (tokenFilter !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.token === tokenFilter
      );
    }
    
    // Filtrar por búsqueda de texto (en tokens y posiblemente otros campos)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => {
        const tokenName = getTokenName(transaction.token || "").toLowerCase();
        const transactionId = (transaction.transactionId || "").toLowerCase();
        // Incluir más campos en la búsqueda si es necesario
        return tokenName.includes(query) || transactionId.includes(query);
      });
    }
    
    setFilteredTransactions(filtered);
  }, [transactionData, dateFrom, dateTo, statusFilter, roleFilter, tokenFilter, searchQuery]);

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setStatusFilter('all');
    setRoleFilter('all');
    setTokenFilter('all');
    setSearchQuery('');
    
    if (transactionData && transactionData.transactions) {
      setFilteredTransactions(transactionData.transactions);
    }
  };

  // Función para formatear fechas de forma segura
  const formatDate = (dateString: string) => {
    try {
      // Intentar crear un objeto Date válido
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return "Fecha no disponible";
      }
      
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha no disponible";
    }
  };

  // Función para mapear nombres de tokens
  const getTokenName = (tokenSymbol: string) => {
    // Mapa completo de símbolos de tokens a nombres más descriptivos
    const tokenMap: {[key: string]: string} = {
      // Tokens originales
      'SYL': 'Sylicon',
      'ISII': 'Inmobiliario Sylicon II',
      'ISIIl': 'Inmobiliario Sylicon III',
      'TKM': 'Token Market',
      
      // Nuevos tokens de la base de datos
      'WBC': 'WBC',
      'GRUPOCAPITAL': 'Grupo Capital',
      'ISIII': 'Inmobiliaria Sylicon III',
      'PISOQUINTO': 'Piso Quinto',
      'SFI': 'SFI 401404',
      'SFI401404': 'SFI 401404',
      'POPSY': 'Popsy',
      'MAQUILAZONAF': 'Maquila Zona Franca',
      'LOGICII': 'Logic II',
      'TCM': 'Test Kravata Main',
      'TEST_KRAVATA': 'TEST_Kravata'
    };
    
    return tokenMap[tokenSymbol] || tokenSymbol;
  };

  // Función para obtener el estilo del estado
  const getStatusStyle = (status: string) => {
    const statusMap: {[key: string]: string} = {
      'INITIATED': 'bg-green-800/40 text-yellow-200',
      'PENDING': 'bg-yellow-900/40 text-yellow-300',
      'COMPLETED': 'bg-green-900/40 text-green-300',
      'CANCELLED': 'bg-red-900/40 text-red-300'
    };
    
    return statusMap[status] || 'bg-gray-700 text-gray-300';
  };

  // Función para obtener el texto del estado en español
  const getStatusText = (status: string) => {
    const statusMap: {[key: string]: string} = {
      'INITIATED': 'Iniciada',
      'PENDING': 'En Proceso',
      'COMPLETED': 'Completada',
      'CANCELLED': 'Cancelada'
    };
    
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300 mb-4">
        {error}
      </div>
    );
  }

  // Si no hay datos o no hay transacciones
  if (!transactionData || !transactionData.transactions || transactionData.transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="px-6 py-4 bg-gray-900">
          <h3 className="text-lg font-semibold text-white">Historial de Transacciones</h3>
        </div>
        <div className="p-6 text-center text-gray-400">
          No hay transacciones para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4 bg-gray-900">
        <h3 className="text-lg font-semibold text-white">Historial de Transacciones</h3>
      </div>
      
      {/* Panel de filtros */}
      <div className="p-4 bg-gray-850 border-b border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Filtro de fecha desde */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          
          {/* Filtro de fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          
          {/* Filtro de estado */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              <option value="all">Todos</option>
              <option value="INITIATED">Iniciada</option>
              <option value="PENDING">En Proceso</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>
          
          {/* Filtro de rol */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Tipo
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              <option value="all">Todos</option>
              <option value="buyer">Compras</option>
              <option value="seller">Ventas</option>
            </select>
          </div>
          
          {/* Filtro por token específico */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Token
            </label>
            <select
              value={tokenFilter}
              onChange={(e) => setTokenFilter(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              <option value="all">Todos los tokens</option>
              {availableTokens.map(token => (
                <option key={token} value={token}>
                  {getTokenName(token)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Búsqueda por texto */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Búsqueda por texto..."
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="mt-4 flex justify-between">
          <div className="text-sm text-gray-400">
            {filteredTransactions.length} transacciones encontradas
          </div>
          <button
            onClick={clearFilters}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      
      {/* Tabla de transacciones */}
      <div className="overflow-x-auto">
        {filteredTransactions.length > 0 ? (
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((transaction) => {
                // Determinar estilo basado en el rol (comprador/vendedor)
                const roleStyles = 
                  transaction.role === 'buyer' ? 'bg-green-900/40 text-green-300' : 
                  transaction.role === 'seller' ? 'bg-blue-900/40 text-blue-300' : 
                  'bg-gray-700 text-gray-300';
                
                // Formatear el rol
                const roleText = 
                  transaction.role === 'buyer' ? 'Compra' : 
                  transaction.role === 'seller' ? 'Venta' : 
                  transaction.role;
                
                // Calcular valores de precio y total
                const price = transaction.averageRate && transaction.averageRate > 0 
                  ? transaction.averageRate 
                  : (transaction.pricePerToken && transaction.pricePerToken > 0 
                      ? transaction.pricePerToken 
                      : 0);
                  
                const total = transaction.totalAmount && transaction.totalAmount > 0
                  ? transaction.totalAmount
                  : price * (transaction.amount || 0);
                
                // Obtener nombre más descriptivo del token
                const tokenName = getTokenName(transaction.token || "");
                
                // Obtener estilo para el estado
                const statusStyle = getStatusStyle(transaction.status || "");
                
                // Obtener texto del estado
                const statusText = getStatusText(transaction.status || "");
                
                return (
                  <tr key={transaction.transactionId} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(transaction.registerDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyles}`}>
                        {roleText}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {tokenName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.amount || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatCurrency(price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatCurrency(total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.status && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                          {statusText}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-400">
            No se encontraron transacciones con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}