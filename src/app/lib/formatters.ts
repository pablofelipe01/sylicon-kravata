/**
 * Formatea una fecha a un formato legible
 * @param dateString - Cadena de fecha ISO
 * @returns Fecha formateada
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  /**
   * Formatea un valor numérico a formato de moneda
   * @param value - Valor numérico
   * @param currency - Código de moneda (por defecto COP)
   * @returns Valor formateado como moneda
   */
  export const formatCurrency = (value: number, currency: string = 'COP'): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(value);
  };
  
  /**
   * Trunca una dirección de billetera para mostrarla más corta
   * @param address - Dirección completa
   * @param charCount - Número de caracteres a mostrar al inicio y final
   * @returns Dirección truncada
   */
  export const truncateAddress = (address: string, charCount: number = 6): string => {
    if (!address) return '';
    if (address.length <= charCount * 2) return address;
    
    return `${address.substring(0, charCount)}...${address.substring(address.length - charCount)}`;
  };