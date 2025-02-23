import { LgtbClient } from "@/app/clients/LgtbClient";
import { STAKE_API } from "@/lib/routes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await LgtbClient.get(STAKE_API);

    if (!response.data) {
      return NextResponse.json({ error: "No data received" }, { status: 404 });
    }
    console.log("Raw response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching stake percentage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
