import { BaseDto } from '../../common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class OrderDto extends BaseDto {
    id?: number;
    @ApiProperty()
    orderId: string;
    @ApiProperty()
    assetPairId: string;
    @ApiProperty()
    orderDirection: number;
    @ApiProperty()
    orderType: number;
    @ApiProperty()
    timeInForce: number;
    @ApiProperty()
    stpMode: number;
    @ApiProperty()
    price: string;
    @ApiProperty()
    amountOut: bigint;
    @ApiProperty()
    amountIn: bigint;
    @ApiProperty() 
    @IsOptional()
    partialAmountIn?: bigint;
    status?: number;
    publicKey?: string;
    noteCommitment?: bigint;
    nullifier?: bigint;
    txHashCreated?: string;
    txHashSettled?: string;
} 