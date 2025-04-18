// Script para verificar la conectividad con la API de producción de Kravata
require('dotenv').config(); // Asegúrate de tener dotenv instalado

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.KRAVATA_API_KEY;

// Función para realizar solicitudes a la API
async function testApiEndpoint(endpoint, method = 'GET', body = null) {
  console.log(`\n🔍 Probando ${method} ${endpoint}`);
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    }
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`URL: ${url}`);
    
    const response = await fetch(url, options);
    console.log(`✅ Status: ${response.status}`);
    
    const data = await response.json();
    console.log('📄 Respuesta:');
    console.log(JSON.stringify(data, null, 2));
    
    return { success: response.ok, data };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Función principal para ejecutar todas las pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas de API de Kravata en producción');
  console.log(`🔗 URL Base: ${API_BASE_URL}`);
  
  // 1. Probar estado KYC (reemplaza con un externalId válido)
  const externalId = 'test-user-123'; // Usa un ID de usuario real
  await testApiEndpoint(`/api/compliance/onboarding/status?externalId=${externalId}`);
  
  // 2. Probar balance de billetera
  await testApiEndpoint(`/api/liquidity/users/balance?externalId=${externalId}`);
  
  // 3. Probar historial de transacciones
  await testApiEndpoint(`/api/liquidity/users/transactions?externalId=${externalId}`);
  
  // 4. Probar detalle de orden (si tienes un ID de transacción)
  // const transactionId = 'transaction-123'; // Reemplaza con un ID válido
  // await testApiEndpoint(`/api/liquidity/order/detail?transactionId=${transactionId}`);
  
  console.log('\n✅ Pruebas completadas');
}

// Ejecutar las pruebas
runTests().catch(err => {
  console.error('Error ejecutando pruebas:', err);
});