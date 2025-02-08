import { LgtbClient } from "@/app/clients/LgtbClient";
import { PRICES_SOLJUP_API } from "@/lib/routes";
import { HeadPrices } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await LgtbClient.get<HeadPrices[]>(PRICES_SOLJUP_API);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching price data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
