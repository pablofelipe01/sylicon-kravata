// lib/tokenMapping.ts

// Mapeo de direcciones de tokens a símbolos reconocidos por Kravata
export const TOKEN_ADDRESS_TO_SYMBOL: Record<string, string> = {
    "0xfd5e7724f360ec5461214e06254ec6eb4fdfa41d": "ISII",
    "0xcbfe1e937e309709b320972dddc67cb118a69053": "ISIII",
    "0x69aa2ed12e241e0ea19e0061b99976d3fb7e5d4f": "SYL",
    // Añadir más tokens según sea necesario
  };
  
  /**
   * Obtiene el símbolo correcto para un token basado en su dirección
   * @param tokenAddress La dirección del token
   * @param fallbackName Nombre a usar si no se encuentra mapeo
   * @returns El símbolo del token o el fallback
   */
  export function getTokenSymbol(tokenAddress?: string, fallbackName?: string): string {
    if (!tokenAddress) {
      return fallbackName || 'TKN';
    }
    
    // Normalizar la dirección (asegurar que está en minúsculas)
    const normalizedAddress = tokenAddress.toLowerCase();
    
    // Buscar en el diccionario
    if (TOKEN_ADDRESS_TO_SYMBOL[normalizedAddress]) {
      return TOKEN_ADDRESS_TO_SYMBOL[normalizedAddress];
    }
    
    // Si no se encuentra, usar el fallback proporcionado o un valor por defecto
    return fallbackName || 'TKN';
  }