import { BaseDto } from '../../common/dto/base.dto';

export class SettlementDto extends BaseDto {
    orderId: string;
    txHashSettled: string;
  } 