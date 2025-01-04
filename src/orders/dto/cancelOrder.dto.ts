import { BaseDto } from '../../common/dto/base.dto';

export class CancelOrderDto extends BaseDto {
    orderId: string;
    nullifier: bigint;  
  } 