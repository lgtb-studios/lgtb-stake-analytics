import { config } from "@config/config";

export async function POST(request: Request) {
  try {
    const { mint } = await request.json();

    const metadataResponse = await fetch(config.solana.mainnet as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAsset",
        params: [mint],
      }),
    });

    const metadataData = await metadataResponse.json();

    const priceResponse = await fetch(
      `https://api.jup.ag/price/v2?ids=${mint}`
    );
    const { data } = await priceResponse.json();
    const tokenPrice = data[mint]?.price;

    if (!metadataData.result) {
      return Response.json(
        { error: "No result in API response" },
        { status: 400 }
      );
    }

    return Response.json({
      ...metadataData.result,
      tokenPrice,
    });
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
