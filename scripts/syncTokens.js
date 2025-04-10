// scripts/syncTokens.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Verificación de variables necesarias
console.log('Checking environment variables...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Not set ✗');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Not set ✗');
console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL ? 'Set ✓' : 'Not set ✗');
console.log('KRAVATA_API_KEY:', process.env.KRAVATA_API_KEY ? 'Set ✓' : 'Not set ✗');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Las variables de entorno para Supabase no están configuradas correctamente');
  console.error('Por favor asegúrate de que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY están definidas en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// URL y clave de API de Kravata
const KRAVATA_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://7lydmigox7.execute-api.us-east-2.amazonaws.com/sylicon-test';
const KRAVATA_API_KEY = process.env.KRAVATA_API_KEY || '';

if (!KRAVATA_API_KEY) {
  console.warn('WARNING: KRAVATA_API_KEY no está definida. Es posible que las solicitudes a la API de Kravata fallen.');
}

// Lista de externalIds de prueba
const TEST_USERS = ['test001', 'test002', 'test003', 'test004'];

// Mapeo de direcciones de tokens a símbolos
const TOKEN_ADDRESS_TO_SYMBOL = {
  "0xfd5e7724f360ec5461214e06254ec6eb4fdfa41d": "ISII",
  "0xcbfe1e937e309709b320972dddc67cb118a69053": "ISIII",
  "0x69aa2ed12e241e0ea19e0061b99976d3fb7e5d4f": "SYL",
};

// Función para determinar el símbolo correcto basado en la dirección del token
function getTokenSymbol(tokenAddress, tokenName) {
  if (tokenAddress && TOKEN_ADDRESS_TO_SYMBOL[tokenAddress.toLowerCase()]) {
    return TOKEN_ADDRESS_TO_SYMBOL[tokenAddress.toLowerCase()];
  }
  
  // Si no hay mapeo y tenemos un nombre, generar un símbolo basado en el nombre
  if (tokenName) {
    const words = tokenName.split(' ');
    if (words.length > 1) {
      return words.map(w => w[0]).join('').toUpperCase();
    }
    return tokenName.substring(0, 3).toUpperCase();
  }
  
  return 'TKN';
}

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
 * Consulta la estructura de la tabla para determinar las columnas disponibles
 */
async function getTableColumns(tableName) {
  try {
    // Esta consulta obtiene las columnas de la tabla
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.error(`Error al consultar tabla ${tableName}:`, error);
      return [];
    }

    // Si hay datos, extrae las claves del primer objeto
    if (data && data.length > 0) {
      return Object.keys(data[0]);
    }

    // Si no hay datos, intenta obtener la información de otra manera
    console.log('No se encontraron datos para determinar columnas, consultando otro token...');
    const { data: sampleData, error: sampleError } = await supabase
      .from(tableName)
      .select('*')
      .neq('id', 0)  // Una condición que probablemente sea verdadera para cualquier registro
      .limit(1);

    if (sampleError) {
      console.error('Error al consultar datos de muestra:', sampleError);
      return [];
    }

    if (sampleData && sampleData.length > 0) {
      return Object.keys(sampleData[0]);
    }

    // Si aún no hay datos, usa una lista hardcoded basada en lo que has visto
    console.log('No se pudieron determinar las columnas automáticamente, usando lista predefinida');
    return ['id', 'name', 'token_address', 'protocol', 'description', 'image_url', 'symbol'];
  } catch (error) {
    console.error('Error general al obtener columnas:', error);
    return [];
  }
}

/**
 * Sincroniza un token en la base de datos de Supabase
 */
async function syncTokenToSupabase(token, externalId, availableColumns) {
  try {
    if (!token || !token.tokenAddress) {
      console.error('Token no válido, falta tokenAddress', token);
      return;
    }

    console.log(`Procesando token: ${token.name} (${token.tokenAddress})`);

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

    // Imagen aleatoria entre las existentes
    const randomImage = `/Token${Math.floor(Math.random() * 3) + 1}.webp`;
    
    // Obtener el símbolo correcto del token
    const tokenSymbol = getTokenSymbol(token.tokenAddress, token.name);
    console.log(`Asignando símbolo: ${tokenSymbol} para token: ${token.name}`);
    
    // Datos completos del token
    const completeTokenData = {
      name: token.name || 'Token sin nombre',
      symbol: tokenSymbol,
      token_address: token.tokenAddress,
      protocol: token.standard || 't155',
      blockchain: token.blockchain || 'MATIC-AMOY',
      description: `Token que representa una fracción de propiedad inmobiliaria tokenizada. ${token.name}`,
      image_url: randomImage,
      metadata: token.metadata || ''
    };

    // Filtrar solo las columnas que existen en la tabla
    const tokenData = {};
    for (const column of availableColumns) {
      if (column in completeTokenData) {
        tokenData[column] = completeTokenData[column];
      }
    }

    console.log('Insertando token con datos:', JSON.stringify(tokenData, null, 2));

    // Insertar nuevo token
    const { data, error } = await supabase
      .from('tokens')
      .insert(tokenData);

    if (error) {
      console.error(`Error al sincronizar token ${token.name}:`, error);
      return;
    }

    console.log(`Token ${token.name} (${token.tokenAddress}) sincronizado correctamente`);
  } catch (error) {
    console.error(`Error general al sincronizar token ${token?.tokenAddress || 'desconocido'}:`, error);
  }
}

/**
 * Función principal que sincroniza todos los tokens de todos los usuarios de prueba
 */
async function syncAllTokens() {
  console.log('Iniciando sincronización de tokens...');
  
  // Obtener las columnas disponibles en la tabla tokens
  console.log('Obteniendo estructura de la tabla tokens...');
  const availableColumns = await getTableColumns('tokens');
  console.log('Columnas disponibles:', availableColumns);
  
  // Para cada usuario de prueba
  for (const externalId of TEST_USERS) {
    // Obtener tokens del usuario
    const tokens = await getWalletBalance(externalId);
    
    if (tokens.length === 0) {
      console.log(`No se encontraron tokens para el usuario ${externalId}`);
      continue;
    }
    
    // Sincronizar cada token
    for (const token of tokens) {
      await syncTokenToSupabase(token, externalId, availableColumns);
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