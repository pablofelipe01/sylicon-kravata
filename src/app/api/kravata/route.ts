// En /api/kravata/route.ts
import { NextRequest, NextResponse } from "next/server";

// Handler for POST formkyc endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { externalId, kycType } = body;

    if (!externalId) {
      return NextResponse.json({ error: "externalId is required" }, { status: 400 });
    }

    console.log(`Solicitando formulario KYC para externalId: ${externalId}, tipo: ${kycType || 'inicial'}`);

    // Construir el body para la API de Kravata
    const kravataRequestBody: unknown = { externalId };
    
    // Solo añadir kycType si está presente
    if (kycType) {
      kravataRequestBody.kycType = kycType;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/compliance/onboarding/formkyc`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.KRAVATA_API_KEY || "",
        },
        body: JSON.stringify(kravataRequestBody),
      }
    );

    console.log(`Respuesta de Kravata FormKYC API: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error de Kravata API:`, errorText);
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Datos de formulario KYC:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling Kravata API for formkyc:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Handler for GET status endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const externalId = searchParams.get("externalId");

    if (!externalId) {
      return NextResponse.json({ error: "externalId is required" }, { status: 400 });
    }

    console.log(`Verificando estado KYC para externalId: ${externalId}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/compliance/onboarding/status?externalId=${externalId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.KRAVATA_API_KEY || "",
        },
      }
    );

    console.log(`Respuesta de Kravata Status API: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error de Kravata API:`, errorText);
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Datos completos de Kravata status:", JSON.stringify(data, null, 2));
    
    // Mapear campos para mantener consistencia con lo que espera el frontend
    const mappedData = {
      ...data,
      status: data.complianceStatus === 'approved' ? 'completed' : 
              data.complianceStatus === 'in_review' ? 'pending' : 
              data.complianceStatus === 'rejected' ? 'rejected' : 
              data.complianceStatus
    };
    
    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Error calling Kravata API for status:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}