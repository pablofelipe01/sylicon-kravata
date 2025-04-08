// scripts/syncTokens.js
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// URL y clave de API de Kravata
const KRAVATA_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://7lydmigox7.execute-api.us-east-2.amazonaws.com/sylicon-test';
const KRAVATA_API_KEY = process.env.KRAVATA_API_KEY || '';

// Lista de externalIds de prueba
const TEST_USERS = ['test001', 'test002', 'test003', 'test004'];

/**
 * Obtiene el balance de tokens de un usuario desde la API de Kravata
 */
async function getWalletBalance(externalId) {
  try {
    console.log(`Obteniendo balance para usuario: ${externalId}`);
    
    const response = await fetch(
      `${KRAVATA_API_URL}/api/liquidity/users/balance?externalId=${externalId}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': KRAVATA_API_KEY,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener balance: ${response.status}`);
    }

    const data = await response.json();
    
    // Verificar si el balance es un array de tokens o solo un número
    if (Array.isArray(data.balance)) {
      console.log(`El usuario ${externalId} tiene ${data.balance.length} tokens`);
      return data.balance;
    } else {
      console.log(`El usuario ${externalId} tiene un balance simple: ${data.balance}`);
      return [];
    }
  } catch (error) {
    console.error(`Error al obtener balance para ${externalId}:`, error);
    return [];
  }
}

/**
 * Sincroniza un token en la base de datos de Supabase
 */
async function syncTokenToSupabase(token, externalId) {
  try {
    // Verificar si el token ya existe en la base de datos
    const { data: existingToken, error: checkError } = await supabase
      .from('tokens')
      .select('*')
      .eq('token_address', token.tokenAddress)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 es el código para "no se encontraron resultados"
      console.error(`Error al verificar token ${token.tokenAddress}:`, checkError);
      return;
    }

    if (existingToken) {
      console.log(`El token ${token.name} (${token.tokenAddress}) ya existe en la base de datos`);
      return;
    }

    // Insertar nuevo token
    const { data, error } = await supabase
      .from('tokens')
      .insert({
        name: token.name,
        symbol: token.symbol || '',
        token_address: token.tokenAddress,
        protocol: token.standard,
        blockchain: token.blockchain,
        description: `Token que representa una fracción de propiedad inmobiliaria tokenizada. ${token.name}`,
        image_url: `/Token${Math.floor(Math.random() * 3) + 1}.webp`, // Usar imágenes existentes
        metadata: token.metadata
      });

    if (error) {
      console.error(`Error al sincronizar token ${token.name}:`, error);
      return;
    }

    console.log(`Token ${token.name} (${token.tokenAddress}) sincronizado correctamente`);
  } catch (error) {
    console.error(`Error general al sincronizar token ${token.tokenAddress}:`, error);
  }
}

/**
 * Función principal que sincroniza todos los tokens de todos los usuarios de prueba
 */
async function syncAllTokens() {
  console.log('Iniciando sincronización de tokens...');
  
  // Para cada usuario de prueba
  for (const externalId of TEST_USERS) {
    // Obtener tokens del usuario
    const tokens = await getWalletBalance(externalId);
    
    // Sincronizar cada token
    for (const token of tokens) {
      await syncTokenToSupabase(token, externalId);
    }
  }
  
  console.log('Sincronización de tokens completada');
}

// Ejecutar la sincronización
syncAllTokens()
  .then(() => {
    console.log('Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el proceso:', error);
    process.exit(1);
  });