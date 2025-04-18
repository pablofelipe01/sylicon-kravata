// scripts/updateAndInsertTokens.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Verificación de variables necesarias
console.log('Verificando variables de entorno...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Not set ✗');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Not set ✗');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Las variables de entorno para Supabase no están configuradas correctamente');
  console.error('Por favor asegúrate de que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY están definidas en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Información de tokens para actualizar
const TOKENS_TO_UPDATE = [
  {
    token_address: "0x2a156afbfaf97b2f465d5e723847b0b4401d3b0b",
    symbol: "WBC",
    name: "WBC",
    metadata: "ipfs://QmRCvTkQtuzkGdBpJNuua1kuB4aypP6mtNAiJkU9oKzWMp/0",
    blockchain: "MATIC",
    standard: "ERC1155",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. WBC"
  },
  {
    token_address: "0x55ccb858fdafd4a533fa2c16f69e8aedf47749ca",
    symbol: "POPSY",
    name: "Popsy",
    metadata: "ipfs://QmbndL9rpnW8Uz4K7ZWskMLsm2s9nW3dEgdf7zpqtfKj3u/0",
    blockchain: "MATIC",
    standard: "ERC1155",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. Popsy"
  },
  {
    token_address: "0x66f299cde8e75bd1a989297c7fe142f3a11c6652",
    symbol: "TKM",
    name: "Test Kravata Main",
    metadata: "ipfs://QmVhRtsTi7hMiPhEdiGmCR4EoPVgNPqUd7D3ncSBboDNqc/0",
    blockchain: "MATIC",
    standard: "ERC1155",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. Test Kravata Main"
  },
  {
    token_address: "0x6997c7e13842b629bdf920d6b1389546b9bbbe53",
    symbol: "PISOQUINTO",
    name: "Piso Quinto",
    metadata: "ipfs://QmbPjS1B1hX8KpupwHqVcsZFRgT8gGrxJLM5c1LDZhGsFJ/0",
    blockchain: "MATIC",
    standard: "ERC1155",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. Piso Quinto"
  },
  {
    token_address: "0x6a4cf2b6e687405ccaa0bb37ee6387a8f484c280",
    symbol: "SFI401",
    name: "SFI 401/404",
    metadata: "ipfs://QmTx6Vx6aNkshd5tUT8K2iejJQFfhboZA8AiFP18MTR9sZ/0",
    blockchain: "MATIC",
    standard: "ERC1155",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. SFI 401/404"
  },
  {
    token_address: "0xf123a057264e2f4daebe9abb5c0dd77cb07eaa40",
    symbol: "LOGICII",
    name: "Logic II",
    metadata: "ipfs://QmdTz6amTZSwc61jUmU6zZReQQPK9erVVyPebtw2Las7YV/0",
    blockchain: "MATIC",
    standard: "ERC1155",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. Logic II"
  },
  {
    token_address: "0xfc6b686096c4cefc6b011f36782617c4171956f7",
    symbol: "GRUPOCAPITAL",
    name: "Grupo Capital",
    metadata: "ipfs://QmZPQiHFW6LX7s8TgqcHxwnnkubmz5nY6EzmMyXk9pxNJw/0",
    blockchain: "MATIC",
    standard: "ERC1155",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. Grupo Capital"
  },
  {
    token_address: "0xfea4e571a457a670743c1dfd4cdb0e20cc13cd99",
    symbol: "MAQUILAZONAF",
    name: "Maquila Zona Franca",
    metadata: "ipfs://QmUL3dCD45FheuxM6WHUeHnAGp7a5c8goqSd2CpQX5FdZw/0",
    blockchain: "MATIC",
    standard: "ERC1155",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. Maquila Zona Franca"
  },
  // Tokens existentes que ya están en tu sistema
  {
    token_address: "0xfd5e7724f360ec5461214e06254ec6eb4fdfa41d",
    symbol: "ISII",
    name: "Inmobiliaria Sylicon II",
    metadata: "ipfs://QmVhRtsTi7hMiPhEdiGmCR4EoPVgNPqUd7D3ncSBboDNqc/0",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. Inmobiliaria Sylicon II"
  },
  {
    token_address: "0xcbfe1e937e309709b320972dddc67cb118a69053",
    symbol: "ISIII",
    name: "Inmobiliaria Sylicon III",
    metadata: "ipfs://QmRCvTkQtuzkGdBpJNuua1kuB4aypP6mtNAiJkU9oKzWMp/0",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. Inmobiliaria Sylicon III"
  },
  {
    token_address: "0x69aa2ed12e241e0ea19e0061b99976d3fb7e5d4f",
    symbol: "SYL",
    name: "TEST_Kravata",
    metadata: "ipfs://QmbndL9rpnW8Uz4K7ZWskMLsm2s9nW3dEgdf7zpqtfKj3u/0",
    description: "Token que representa una fracción de propiedad inmobiliaria tokenizada. TEST_Kravata"
  }
];

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

    // Lista predefinida basada en lo que viste en la captura de pantalla
    console.log('No se pudieron determinar las columnas automáticamente, usando lista predefinida');
    return ['id', 'name', 'token_address', 'protocol', 'description', 'image_url', 'symbol', 'metadata'];
  } catch (error) {
    console.error('Error general al obtener columnas:', error);
    return [];
  }
}

/**
 * Actualizar o insertar información de un token
 */
async function updateOrInsertToken(tokenInfo, availableColumns) {
  const { 
    token_address, 
    symbol, 
    name, 
    metadata, 
    blockchain, 
    standard, 
    description 
  } = tokenInfo;
  
  if (!token_address) {
    console.error('Error: token_address es requerido para actualizar o insertar un token');
    return;
  }
  
  try {
    // Verificar si el token existe
    const { data: existingToken, error: checkError } = await supabase
      .from('tokens')
      .select('*')
      .eq('token_address', token_address)
      .maybeSingle();
    
    if (checkError) {
      console.error(`Error al verificar token ${token_address}:`, checkError);
      return;
    }
    
    // Imagen aleatoria entre las existentes (para nuevos tokens)
    const randomImage = `/Token${Math.floor(Math.random() * 3) + 1}.webp`;
    
    if (existingToken) {
      // Preparar los datos de actualización para token existente
      const updateData = {};
      
      // Solo incluir columnas que existen en la tabla
      if (availableColumns.includes('symbol') && symbol) updateData.symbol = symbol;
      if (availableColumns.includes('name') && name) updateData.name = name;
      if (availableColumns.includes('metadata') && metadata) updateData.metadata = metadata;
      if (availableColumns.includes('blockchain') && blockchain) updateData.blockchain = blockchain;
      if (availableColumns.includes('protocol') && standard) updateData.protocol = standard;
      if (availableColumns.includes('description') && description) updateData.description = description;
      
      if (Object.keys(updateData).length === 0) {
        console.log(`No hay datos para actualizar para el token ${token_address}`);
        return;
      }
      
      // Actualizar token existente
      console.log(`Actualizando token existente: ${token_address} (${symbol || existingToken.symbol})`);
      console.log('Datos a actualizar:', updateData);
      
      const { error: updateError } = await supabase
        .from('tokens')
        .update(updateData)
        .eq('token_address', token_address);
      
      if (updateError) {
        console.error(`Error al actualizar token ${token_address}:`, updateError);
      } else {
        console.log(`Token ${token_address} actualizado correctamente`);
      }
    } else {
      // Preparar los datos para insertar nuevo token
      const insertData = {
        token_address: token_address
      };
      
      // Asignar valores a las columnas existentes
      if (availableColumns.includes('symbol')) insertData.symbol = symbol || 'TKN';
      if (availableColumns.includes('name')) insertData.name = name || 'Token';
      if (availableColumns.includes('metadata')) insertData.metadata = metadata || '';
      if (availableColumns.includes('protocol')) insertData.protocol = standard || 'ERC1155';
      if (availableColumns.includes('blockchain')) insertData.blockchain = blockchain || 'MATIC';
      if (availableColumns.includes('description')) insertData.description = description || `Token que representa una fracción de propiedad inmobiliaria tokenizada.`;
      if (availableColumns.includes('image_url')) insertData.image_url = randomImage;
      
      // Insertar nuevo token
      console.log(`Insertando nuevo token: ${token_address} (${symbol})`);
      console.log('Datos a insertar:', insertData);
      
      const { error: insertError } = await supabase
        .from('tokens')
        .insert(insertData);
      
      if (insertError) {
        console.error(`Error al insertar token ${token_address}:`, insertError);
      } else {
        console.log(`Token ${token_address} insertado correctamente`);
      }
    }
  } catch (error) {
    console.error(`Error al procesar token ${token_address}:`, error);
  }
}

/**
 * Actualiza o inserta la información de todos los tokens
 */
async function updateOrInsertAllTokens() {
  console.log('Iniciando actualización e inserción de tokens...');
  
  // Obtener columnas disponibles
  const availableColumns = await getTableColumns('tokens');
  console.log('Columnas disponibles en la tabla tokens:', availableColumns);
  
  if (!availableColumns.includes('metadata')) {
    console.log('ADVERTENCIA: La columna "metadata" no existe en la tabla. Se recomienda crearla antes de continuar.');
    // Aquí podrías añadir código para crear la columna si es necesario
  }
  
  // Procesar cada token
  for (const tokenInfo of TOKENS_TO_UPDATE) {
    await updateOrInsertToken(tokenInfo, availableColumns);
  }
  
  console.log('Actualización e inserción de tokens completada');
}

// Ejecutar la actualización
updateOrInsertAllTokens()
  .then(() => {
    console.log('Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el proceso:', error);
    process.exit(1);
  });