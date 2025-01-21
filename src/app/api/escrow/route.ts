import { Connection, PublicKey } from "@solana/web3.js";
import { StakeEscrow } from "@/lib/Models";
import { formatTokenAmount } from "@/lib/utils";
import { m3m3_PROGRAM_ID } from "@/lib/utils";
import { config } from "@config/config";

export async function POST(request: Request) {
  try {
    const { wallet, selectedVault } = await request.json();
    const connection = new Connection(
      config.solana.mainnet as string,
      "confirmed"
    );

    const accounts = await connection.getProgramAccounts(m3m3_PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 8,
            bytes: wallet,
          },
        },
      ],
    });

    const tokenADecimals = await getTokenDecimals(
      connection,
      new PublicKey(selectedVault.token_a_mint)
    );

    const returnData = accounts
      .map(({ account }) => {
        const decoded = StakeEscrow.decode(account.data);
        if (decoded.vault.equals(new PublicKey(selectedVault.vault_address))) {
          return {
            wallet_pubkey: wallet,
            vault_pubkey: decoded.vault.toBase58(),
            total_staked_amount: formatTokenAmount(
              Number(decoded.stakeAmount),
              tokenADecimals
            ),
            total_claimed: {
              token_a: formatTokenAmount(
                Number(decoded.feeAClaimedAmount),
                tokenADecimals
              ),
              sol: formatTokenAmount(Number(decoded.feeBClaimedAmount), 9),
            },
          };
        }
        return undefined;
      })
      .filter((data) => data !== undefined);

    return Response.json(returnData[0] || null);
  } catch (error) {
    console.error("Error fetching escrow data:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getTokenDecimals(
  connection: Connection,
  mint: PublicKey
): Promise<number> {
  const tokenInfo = await connection.getParsedAccountInfo(mint);

  if (tokenInfo.value && tokenInfo.value.data) {
    const data = tokenInfo.value.data as {
      parsed: { info: { decimals: number } };
    };
    if (
      data.parsed &&
      data.parsed.info &&
      typeof data.parsed.info.decimals === "number"
    ) {
      return data.parsed.info.decimals;
    }
  }

  return 9;
}
