import { NextRequest, NextResponse } from "next/server";

// Handler para el endpoint de historial de transacciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const externalId = searchParams.get("externalId");

    if (!externalId) {
      return NextResponse.json({ error: "externalId is required" }, { status: 400 });
    }

    // Log para debugging
    console.log(`Requesting transaction history for externalId: ${externalId}`);
    
    // URL para el endpoint de transacciones
    const transactionsUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/liquidity/users/transactions?externalId=${externalId}`;
    console.log(`Making request to: ${transactionsUrl}`);

    // Realiza la solicitud a la API de Kravata
    const response = await fetch(transactionsUrl, {
      method: "GET",
      headers: {
        "x-api-key": process.env.KRAVATA_API_KEY || "",
        "Content-Type": "application/json"
      },
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
    console.error("Error requesting transaction history:", error);
    return NextResponse.json(
      { 
        error: "Failed to retrieve transaction history", 
        details: error.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
}