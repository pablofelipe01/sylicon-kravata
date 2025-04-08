// app/lib/initialize-data.ts
import { supabase } from './supabase';
import { getWalletBalance } from './api';
import { TokenBalance } from '../types';

/**
 * Inicializa datos de marketplace de ejemplo si es necesario
 */
export async function initializeMarketplaceData(): Promise<void> {
  try {
    // Verificar si ya hay tokens en la base de datos
    const { data: existingTokens, error } = await supabase
      .from('tokens')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error al verificar tokens existentes:', error);
      return;
    }

    // Si ya hay tokens, no es necesario inicializar
    if (existingTokens && existingTokens.length > 0) {
      console.log('Datos de marketplace ya inicializados');
      return;
    }

    console.log('Inicializando datos de marketplace...');

    // Obtener tokens de usuarios de prueba
    const testUsers = ['test001', 'test002', 'test003', 'test004'];
    let allTokens: TokenBalance[] = [];

    // Recopilar tokens de todos los usuarios de prueba
    for (const externalId of testUsers) {
      try {
        const walletData = await getWalletBalance(externalId);
        
        // Verificar si el balance es un array de tokens o solo un número
        if (typeof walletData.balance === 'object' && Array.isArray(walletData.balance)) {
          allTokens = [...allTokens, ...walletData.balance];
        }
      } catch (error) {
        console.error(`Error al obtener tokens para usuario ${externalId}:`, error);
      }
    }

    // Eliminar duplicados basados en tokenAddress
    const uniqueTokens = allTokens.filter((token, index, self) =>
      index === self.findIndex(t => t.tokenAddress === token.tokenAddress)
    );

    // Insertar tokens únicos en la base de datos
    for (const token of uniqueTokens) {
      try {
        const { error } = await supabase
          .from('tokens')
          .insert({
            name: token.name,
            symbol: token.symbol || '',
            token_address: token.tokenAddress,
            protocol: token.standard,
            blockchain: token.blockchain,
            description: `Token que representa una fracción de propiedad inmobiliaria tokenizada. ${token.name}`,
            image_url: `/Token${Math.floor(Math.random() * 3) + 1}.webp`,
            metadata: token.metadata
          });

        if (error) {
          console.error(`Error al insertar token ${token.name}:`, error);
        } else {
          console.log(`Token ${token.name} inicializado correctamente`);
        }
      } catch (error) {
        console.error(`Error al inicializar token ${token.name}:`, error);
      }
    }

    // Si no hay tokens de la API, crear uno de ejemplo
    if (uniqueTokens.length === 0) {
      const { error } = await supabase
        .from('tokens')
        .insert({
          name: 'Inmobiliario Sylicon',
          symbol: 'SYL',
          token_address: '0x69aA2ED12e241e0EA19e0061b99976d3Fb7e5d4F',
          protocol: 't155',
          blockchain: 'MATIC-AMOY',
          description: 'Token que representa una fracción de propiedad inmobiliaria tokenizada.',
          image_url: '/Token1.webp',
        });

      if (error) {
        console.error('Error al insertar token de ejemplo:', error);
      } else {
        console.log('Token de ejemplo inicializado correctamente');
      }
    }

    console.log('Inicialización de datos de marketplace completada');
  } catch (error) {
    console.error('Error general durante la inicialización de datos:', error);
  }
}