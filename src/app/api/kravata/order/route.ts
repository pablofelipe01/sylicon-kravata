import { NextRequest, NextResponse } from "next/server";

// Tipos para el cuerpo de la solicitud
interface Seller {
  walletId: string;
  externalId: string;
  tokensSold: number;
  pricePerToken: number;
}

interface CreateOrderRequest {
  amount: number;
  token: string;
  methodPay: string;
  recipientId: string;
  recipientWalletId: string;
  tokensReceived: number;
  sellers: Seller[];
}

// Función para obtener el símbolo del token basado en su nombre
// Esto debería configurarse según tus tokens disponibles
function getTokenSymbol(tokenName: string): string {
  const tokenMap: Record<string, string> = {
    "Test Kravata Main": "TKM",
    "WBC": "WBC",
    "Grupo Capital": "GRUPOCAPITAL",
    "Inmobiliaria Sylicon III": "ISIII",
    "TEST_Kravata": "SYL",
    "Piso Quinto": "PISOQUINTO",
    "SFI 401/404": "SFI401",
    "Popsy": "POPSY",
    "Maquila Zona Franca": "MAQUILAZONAF",
    "Inmobiliaria Sylicon II": "ISII",
    "Logic II": "LOGICII"
    // Añade más mapeos según sea necesario
  };
  
  return tokenMap[tokenName] || tokenName;
}

// Handler para el endpoint de creación de orden
export async function POST(request: NextRequest) {
  try {
    // Obtener el cuerpo de la solicitud
    const body = await request.json() as CreateOrderRequest;

    // Validación básica
    if (!body.recipientId || !body.amount || !body.token || !body.methodPay || 
        !body.recipientWalletId || !body.tokensReceived || !body.sellers || 
        !Array.isArray(body.sellers) || body.sellers.length === 0) {
      return NextResponse.json({ 
        error: "Missing required fields in request body" 
      }, { status: 400 });
    }

    // Obtener el símbolo del token correcto basado en el nombre
    const tokenSymbol = getTokenSymbol(body.token);
    
    // Crear el cuerpo de la solicitud con el símbolo del token
    const requestBody = {
      ...body,
      token: tokenSymbol
    };

    // Log para debugging
    console.log(`Creating order with data:`, requestBody);
    
    // URL para el endpoint de creación de orden
    const createOrderUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/liquidity/order`;
    console.log(`Making request to: ${createOrderUrl}`);

    // Realiza la solicitud a la API de Kravata
    const response = await fetch(createOrderUrl, {
      method: "POST",
      headers: {
        "x-api-key": process.env.KRAVATA_API_KEY || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    // Log para debugging
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        console.error(`API Error: ${errorText}`);
      } catch (e) {
        console.error("Could not read error response");
      }
      
      return NextResponse.json(
        { 
          error: `API request failed with status ${response.status}`, 
          details: errorText 
        }, 
        { status: response.status }
      );
    }

    // Procesa la respuesta exitosa
    const data = await response.json();
    console.log("Successful response:", data);
    return NextResponse.json(data);
  } catch (error) {
    // Captura cualquier error no manejado
    console.error("Error creating order:", error);
    return NextResponse.json(
      { 
        error: "Failed to create order", 
        details: error.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
}