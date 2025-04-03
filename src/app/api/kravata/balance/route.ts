import { NextRequest, NextResponse } from "next/server";

// Handler para el endpoint de balance de billetera
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const externalId = searchParams.get("externalId");

    if (!externalId) {
      return NextResponse.json({ error: "externalId is required" }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/liquidity/users/balance?externalId=${externalId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.KRAVATA_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling Kravata API for wallet balance:", error);
    return NextResponse.json(
      { error: "Failed to retrieve wallet balance" },
      { status: 500 }
    );
  }
}