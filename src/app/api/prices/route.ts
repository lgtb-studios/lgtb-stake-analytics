import { LgtbClient } from "@/app/clients/LgtbClient";
import { PRICES_API } from "@/lib/routes";
import { TokenMetadata } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { mint } = await req.json();
    // Pass mint in the expected format
    const response = await LgtbClient.post<TokenMetadata>(PRICES_API, {
      mint: mint,
    });

    if (!response.data) {
      return NextResponse.json({ error: "No data received" }, { status: 404 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
