import { NextRequest, NextResponse } from "next/server";

// Handler for POST formkyc endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { externalId } = body;

    if (!externalId) {
      return NextResponse.json({ error: "externalId is required" }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/compliance/onboarding/formkyc`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.KRAVATA_API_KEY || "",
        },
        body: JSON.stringify({ externalId }),
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
    console.error("Error calling Kravata API:", error);
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/compliance/onboarding/status?externalId=${externalId}`,
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
    console.error("Error calling Kravata API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}