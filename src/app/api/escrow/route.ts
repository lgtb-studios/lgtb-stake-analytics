import { NextRequest, NextResponse } from "next/server";
import { LgtbClient } from "@/app/clients/LgtbClient";
import { ESCROW_API } from "@/lib/routes";

export async function POST(request: NextRequest) {
  try {
    const { wallet, vault, tokenDecimal } = await request.json();
    const response = await LgtbClient.post(ESCROW_API, {
      wallet: wallet,
      vault: vault,
      tokenDecimal: tokenDecimal,
    });
    if (!response.data) {
      return NextResponse.json({ error: "No data received" }, { status: 404 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching escrow data:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
