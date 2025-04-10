// scripts/updateTokenSymbols.js
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

// Mapeo de direcciones de tokens a símbolos
const TOKEN_ADDRESS_TO_SYMBOL = {
  "0xfd5e7724f360ec5461214e06254ec6eb4fdfa41d": "ISII",
  "0xcbfe1e937e309709b320972dddc67cb118a69053": "ISIII",
  "0x69aa2ed12e241e0ea19e0061b99976d3fb7e5d4f": "SYL",
};

async function updateTokenSymbols() {
  console.log('Actualizando símbolos de tokens...');
  
  for (const [address, symbol] of Object.entries(TOKEN_ADDRESS_TO_SYMBOL)) {
    console.log(`Actualizando token ${address} con símbolo ${symbol}`);
    
    const { data, error } = await supabase
      .from('tokens')
      .update({ symbol: symbol })
      .eq('token_address', address);
    
    if (error) {
      console.error(`Error al actualizar token ${address}:`, error);
    } else {
      console.log(`Token ${address} actualizado correctamente`);
    }
  }
}

// Ejecutar la actualización
updateTokenSymbols()
  .then(() => {
    console.log('Actualización de símbolos completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el proceso:', error);
    process.exit(1);
  });