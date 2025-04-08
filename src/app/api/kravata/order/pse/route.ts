import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { error: "transactionId is required" },
        { status: 400 }
      );
    }

    console.log(`Obteniendo URL de PSE para transactionId: ${transactionId}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/liquidity/order/pse?transactionId=${transactionId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.KRAVATA_API_KEY || "",
        },
      }
    );

    console.log(`Respuesta de Kravata PSE API: ${response.status}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("URL de PSE obtenida:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling Kravata API for PSE URL:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}