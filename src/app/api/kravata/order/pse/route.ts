import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");
    const bankName = searchParams.get("bankName");
    const bankCode = searchParams.get("bankCode");

    if (!transactionId) {
      return NextResponse.json(
        { error: "transactionId is required" },
        { status: 400 }
      );
    }

    console.log(`=== INICIO DEBUG PSE ===`);
    console.log(`TransactionId: ${transactionId}`);
    console.log(`Banco: ${bankName || 'No especificado'} (Código: ${bankCode || 'No especificado'})`);
    
    // Construir URL con todos los parámetros
    let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/liquidity/order/pse?transactionId=${transactionId}`;
    
    // Agregar nombre y código del banco si están presentes
    if (bankName && bankCode) {
      apiUrl += `&bankName=${encodeURIComponent(bankName)}&bankCode=${encodeURIComponent(bankCode)}`;
    }
    
    console.log(`URL completa: ${apiUrl}`);
    console.log(`API Key presente: ${!!process.env.KRAVATA_API_KEY}`);
    console.log(`API Key (primeros 4 chars): ${process.env.KRAVATA_API_KEY?.substring(0, 4)}...`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-key": process.env.KRAVATA_API_KEY || "",
      },
    });

    console.log(`Status de respuesta: ${response.status}`);

    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorBody = await response.text();
        console.error(`Cuerpo del error de Kravata: ${errorBody}`);
        errorDetails = errorBody;
      } catch (e) {
        console.error("No se pudo leer el cuerpo del error");
      }

      console.log(`=== FIN DEBUG PSE (ERROR) ===`);

      return NextResponse.json(
        { 
          error: `API request failed with status ${response.status}`,
          details: errorDetails
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Respuesta exitosa:", data);
    console.log(`=== FIN DEBUG PSE (OK) ===`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error completo:", error);
    console.log(`=== FIN DEBUG PSE (EXCEPTION) ===`);
    
    return NextResponse.json(
      { 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}