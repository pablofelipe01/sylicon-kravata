// scripts/updateTokenImages.js
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

// Función para actualizar las imágenes de los tokens
async function updateTokenImages() {
  try {
    console.log('Obteniendo lista de tokens...');
    
    // Obtener todos los tokens
    const { data: tokens, error } = await supabase
      .from('tokens')
      .select('id, token_address, name, symbol');
    
    if (error) {
      console.error('Error al obtener tokens:', error);
      return;
    }
    
    console.log(`Se encontraron ${tokens.length} tokens para actualizar`);
    
    // Actualizar cada token con una imagen aleatoria del rango ampliado
    for (const token of tokens) {
      // Generar un número aleatorio entre 1 y 11
      const randomNum = Math.floor(Math.random() * 11) + 1;
      const newImageUrl = `/Token${randomNum}.webp`;
      
      console.log(`Actualizando token ${token.id} (${token.symbol || token.name}) con imagen: ${newImageUrl}`);
      
      const { error: updateError } = await supabase
        .from('tokens')
        .update({ image_url: newImageUrl })
        .eq('id', token.id);
      
      if (updateError) {
        console.error(`Error al actualizar imagen para token ${token.id}:`, updateError);
      } else {
        console.log(`✅ Token ${token.id} actualizado correctamente`);
      }
    }
    
    console.log('Actualización de imágenes completada');
  } catch (error) {
    console.error('Error en el proceso:', error);
  }
}

// Ejecutar la actualización
updateTokenImages()
  .then(() => {
    console.log('Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el proceso:', error);
    process.exit(1);
  });