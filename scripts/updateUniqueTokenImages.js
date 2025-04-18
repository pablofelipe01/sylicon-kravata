// scripts/updateUniqueTokenImages.js
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
    
    // Array de imágenes disponibles
    const availableImages = Array.from({ length: 11 }, (_, i) => `/Token${i + 1}.webp`);
    console.log('Imágenes disponibles:', availableImages);
    
    // Si hay más tokens que imágenes disponibles, advertir
    if (tokens.length > availableImages.length) {
      console.warn(`ADVERTENCIA: Hay más tokens (${tokens.length}) que imágenes disponibles (${availableImages.length}). Algunas imágenes se repetirán.`);
    }
    
    // Shuffle del array de tokens para asignación aleatoria
    const shuffledTokens = [...tokens].sort(() => Math.random() - 0.5);
    
    // Asignar imágenes únicas a cada token
    for (let i = 0; i < shuffledTokens.length; i++) {
      const token = shuffledTokens[i];
      // Calcular el índice de imagen de manera que se distribuya uniformemente
      // Si hay más tokens que imágenes, se repetirán algunas imágenes pero de forma ordenada
      const imageIndex = i % availableImages.length;
      const newImageUrl = availableImages[imageIndex];
      
      console.log(`Asignando imagen ${newImageUrl} a token ${token.id} (${token.symbol || token.name})`);
      
      const { error: updateError } = await supabase
        .from('tokens')
        .update({ image_url: newImageUrl })
        .eq('id', token.id);
      
      if (updateError) {
        console.error(`Error al actualizar imagen para token ${token.id}:`, updateError);
      } else {
        console.log(`✅ Token ${token.id} actualizado correctamente con imagen ${newImageUrl}`);
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