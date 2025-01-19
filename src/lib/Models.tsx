import * as borsh from '@coral-xyz/borsh'
import { PublicKey } from '@solana/web3.js';

export class StakeEscrow {
    discriminator: Buffer | undefined;
    owner: PublicKey;
    vault: PublicKey;
    fullBalanceIndex: bigint;
    stakeAmount: bigint;
    inTopList: number;
    padding0: number[];
    ongoingTotalPartialUnstakeAmount: bigint;
    createdAt: bigint;
    feeAClaimedAmount: bigint;
    feeBClaimedAmount: bigint;
    feeAPerLiquidityCheckpoint: bigint;
    feeBPerLiquidityCheckpoint: bigint;
    feeAPending: bigint;
    feeBPending: bigint;
    padding: bigint[];

    static borshAccountSchema = borsh.struct([
        borsh.array(borsh.u8(), 8, 'discriminator'),
        borsh.publicKey('owner'),
        borsh.publicKey('vault'),
        borsh.u64('fullBalanceIndex'),
        borsh.u64('stakeAmount'),
        borsh.u8('inTopList'),
        borsh.array(borsh.u8(), 15, 'padding0'),
        borsh.u64('ongoingTotalPartialUnstakeAmount'),
        borsh.i64('createdAt'),
        borsh.u128('feeAClaimedAmount'),
        borsh.u128('feeBClaimedAmount'),
        borsh.u128('feeAPerLiquidityCheckpoint'),
        borsh.u128('feeBPerLiquidityCheckpoint'),
        borsh.u64('feeAPending'),
        borsh.u64('feeBPending'),
        borsh.array(borsh.u128(), 20, 'padding')
    ]);

    constructor(fields: {
        discriminator: Buffer;
        owner: PublicKey;
        vault: PublicKey;
        fullBalanceIndex: bigint;
        stakeAmount: bigint;
        inTopList: number;
        padding0: number[];
        ongoingTotalPartialUnstakeAmount: bigint;
        createdAt: bigint;
        feeAClaimedAmount: bigint;
        feeBClaimedAmount: bigint;
        feeAPerLiquidityCheckpoint: bigint;
        feeBPerLiquidityCheckpoint: bigint;
        feeAPending: bigint;
        feeBPending: bigint;
        padding: bigint[];
    }) {
        this.owner = fields.owner;
        this.vault = fields.vault;
        this.fullBalanceIndex = fields.fullBalanceIndex;
        this.stakeAmount = fields.stakeAmount;
        this.inTopList = fields.inTopList;
        this.padding0 = fields.padding0;
        this.ongoingTotalPartialUnstakeAmount = fields.ongoingTotalPartialUnstakeAmount;
        this.createdAt = fields.createdAt;
        this.feeAClaimedAmount = fields.feeAClaimedAmount;
        this.feeBClaimedAmount = fields.feeBClaimedAmount;
        this.feeAPerLiquidityCheckpoint = fields.feeAPerLiquidityCheckpoint;
        this.feeBPerLiquidityCheckpoint = fields.feeBPerLiquidityCheckpoint;
        this.feeAPending = fields.feeAPending;
        this.feeBPending = fields.feeBPending;
        this.padding = fields.padding;
    }

    static decode(data: Buffer): StakeEscrow {
        return this.borshAccountSchema.decode(data);
    }

    static encode(account: StakeEscrow): Buffer {
        return this.borshAccountSchema.encode(account);
    }
}