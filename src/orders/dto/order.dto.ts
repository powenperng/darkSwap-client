import { HexString } from 'ethers/lib.commonjs/utils/data';
import { BaseDto } from '../../common/dto/base.dto';

export class OrderDto extends BaseDto {
    id: number;
    orderId: string;
    assetPairId: string;
    orderDirection: number;
    orderType: number;
    timeInForce: number;
    stpMode: number;
    price: string;
    amountOut: bigint;
    amountIn: bigint; 
    partialAmountIn: bigint;
    status: number;
    publicKey: string;
    noteCommitment: bigint;
    nullifier: bigint;
    txHashCreated: string;
    txHashSettled: string;
} 