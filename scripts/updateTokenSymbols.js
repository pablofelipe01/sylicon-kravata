// scripts/updateTokens.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Las variables de entorno para Supabase no están configuradas correctamente');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeo completo de tokens con toda la información
const TOKENS_INFO = [
  {
    token_address: "0x2a156afbfaf97b2f465d5e723847b0b4401d3b0b",
    symbol: "WBC",
    name: "WBC",
    metadata: "ipfs://QmRCvTkQtuzkGdBpJNuua1kuB4aypP6mtNAiJkU9oKzWMp/0",
    blockchain: "MATIC",
    standard: "ERC1155"
  },
  {
    token_address: "0x55ccb858fdafd4a533fa2c16f69e8aedf47749ca",
    symbol: "POPSY",
    name: "Popsy",
    metadata: "ipfs://QmbndL9rpnW8Uz4K7ZWskMLsm2s9nW3dEgdf7zpqtfKj3u/0",
    blockchain: "MATIC",
    standard: "ERC1155"
  },
  {
    token_address: "0x66f299cde8e75bd1a989297c7fe142f3a11c6652",
    symbol: "TKM",
    name: "Test Kravata Main",
    metadata: "ipfs://QmVhRtsTi7hMiPhEdiGmCR4EoPVgNPqUd7D3ncSBboDNqc/0",
    blockchain: "MATIC",
    standard: "ERC1155"
  },
  {
    token_address: "0x6997c7e13842b629bdf920d6b1389546b9bbbe53",
    symbol: "PISOQUINTO",
    name: "Piso Quinto",
    metadata: "ipfs://QmbPjS1B1hX8KpupwHqVcsZFRgT8gGrxJLM5c1LDZhGsFJ/0",
    blockchain: "MATIC",
    standard: "ERC1155"
  },
  {
    token_address: "0x6a4cf2b6e687405ccaa0bb37ee6387a8f484c280",
    symbol: "SFI401",
    name: "SFI 401/404",
    metadata: "ipfs://QmTx6Vx6aNkshd5tUT8K2iejJQFfhboZA8AiFP18MTR9sZ/0",
    blockchain: "MATIC",
    standard: "ERC1155"
  },
  {
    token_address: "0xf123a057264e2f4daebe9abb5c0dd77cb07eaa40",
    symbol: "LOGICII",
    name: "Logic II",
    metadata: "ipfs://QmdTz6amTZSwc61jUmU6zZReQQPK9erVVyPebtw2Las7YV/0",
    blockchain: "MATIC",
    standard: "ERC1155"
  },
  {
    token_address: "0xfc6b686096c4cefc6b011f36782617c4171956f7",
    symbol: "GRUPOCAPITAL",
    name: "Grupo Capital",
    metadata: "ipfs://QmZPQiHFW6LX7s8TgqcHxwnnkubmz5nY6EzmMyXk9pxNJw/0",
    blockchain: "MATIC",
    standard: "ERC1155"
  },
  {
    token_address: "0xfea4e571a457a670743c1dfd4cdb0e20cc13cd99",
    symbol: "MAQUILAZONAF",
    name: "Maquila Zona Franca",
    metadata: "ipfs://QmUL3dCD45FheuxM6WHUeHnAGp7a5c8goqSd2CpQX5FdZw/0",
    blockchain: "MATIC",
    standard: "ERC1155"
  },
  // Tokens originales que ya tenías
  {
    token_address: "0xfd5e7724f360ec5461214e06254ec6eb4fdfa41d",
    symbol: "ISII",
    name: "Inmobiliaria Sylicon II",
    metadata: "ipfs://QmVhRtsTi7hMiPhEdiGmCR4EoPVgNPqUd7D3ncSBboDNqc/0",
    blockchain: "ERC1155",
    standard: "ERC1155"
  },
  {
    token_address: "0xcbfe1e937e309709b320972dddc67cb118a69053",
    symbol: "ISIII",
    name: "Inmobiliaria Sylicon III",
    metadata: "ipfs://QmRCvTkQtuzkGdBpJNuua1kuB4aypP6mtNAiJkU9oKzWMp/0",
    blockchain: "ERC1155",
    standard: "ERC1155"
  },
  {
    token_address: "0x69aa2ed12e241e0ea19e0061b99976d3fb7e5d4f",
    symbol: "SYL",
    name: "TEST_Kravata",
    metadata: "ipfs://QmbndL9rpnW8Uz4K7ZWskMLsm2s9nW3dEgdf7zpqtfKj3u/0",
    blockchain: "ERC1155",
    standard: "ERC1155"
  }
];

async function updateTokens() {
  console.log('Actualizando información de tokens...');
  
  for (const tokenInfo of TOKENS_INFO) {
    const { token_address, symbol, name, metadata, blockchain, standard } = tokenInfo;
    
    console.log(`Procesando token ${token_address} (${symbol})`);
    
    // Verificar si el token ya existe
    const { data: existingToken, error: checkError } = await supabase
      .from('tokens')
      .select('*')
      .eq('token_address', token_address)
      .maybeSingle();
    
    if (checkError) {
      console.error(`Error al verificar token ${token_address}:`, checkError);
      continue;
    }
    
    if (existingToken) {
      // Actualizar token existente
      console.log(`Actualizando token existente: ${token_address}`);
      
      const { error: updateError } = await supabase
        .from('tokens')
        .update({ 
          symbol, 
          name, 
          metadata,
          // Solo actualizamos blockchain y standard si no causa conflictos con tu esquema
          // blockchain, 
          // standard
        })
        .eq('token_address', token_address);
      
      if (updateError) {
        console.error(`Error al actualizar token ${token_address}:`, updateError);
      } else {
        console.log(`Token ${token_address} actualizado correctamente`);
      }
    } else {
      // Insertar nuevo token
      console.log(`Insertando nuevo token: ${token_address}`);
      
      const { error: insertError } = await supabase
        .from('tokens')
        .insert({ 
          token_address, 
          symbol, 
          name, 
          metadata,
          blockchain,
          standard,
          // Si necesitas más campos, agrégalos aquí
        });
      
      if (insertError) {
        console.error(`Error al insertar token ${token_address}:`, insertError);
      } else {
        console.log(`Token ${token_address} insertado correctamente`);
      }
    }
  }
}

// Ejecutar la actualización
updateTokens()
  .then(() => {
    console.log('Actualización de tokens completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el proceso:', error);
    process.exit(1);
  });