import { LgtbClient } from "@/app/clients/LgtbClient";
import { PRICES_SOLJUP_API } from "@/lib/routes";
import { HeadPrices } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Making SOL/JUP request...");
    const response = await LgtbClient.get<HeadPrices[]>(PRICES_SOLJUP_API);

    // Verify data structure before returning
    if (!Array.isArray(response.data)) {
      console.warn("Response data is not an array:", response.data);
      // Maybe need to transform the data?
      return NextResponse.json(response.data);
    }

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error with full details:", {
        message: error.message,
        response: error.cause,
        status: error.stack,
      });
    } else {
      console.error("Unknown error:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
