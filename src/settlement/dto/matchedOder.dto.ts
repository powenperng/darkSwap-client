
export class MatchedOrderDto {
    orderId: string;
    chainId: number;
    assetPairId: string;
    orderDirection: number;
    isMaker: boolean;
    makerAmount: bigint;
    makerMatchedAmount: bigint;
    takerMatchedAmount: bigint;
    makerPublicKey: string;
    takerPublicKey: string;
    makerSwapMessage: string;
    takerSwapMessage: string;
}