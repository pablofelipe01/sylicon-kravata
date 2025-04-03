import { NextRequest, NextResponse } from "next/server";

// Handler para el endpoint de detalle de orden
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json({ error: "transactionId is required" }, { status: 400 });
    }

    // Log para debugging
    console.log(`Requesting order details for transactionId: ${transactionId}`);
    
    // URL para el endpoint de detalle de orden
    const orderDetailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/liquidity/order/detail?transactionId=${transactionId}`;
    console.log(`Making request to: ${orderDetailUrl}`);

    // Realiza la solicitud a la API de Kravata
    const response = await fetch(orderDetailUrl, {
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
    console.error("Error requesting order details:", error);
    return NextResponse.json(
      { 
        error: "Failed to retrieve order details", 
        details: error.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
}