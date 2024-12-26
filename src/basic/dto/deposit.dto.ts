import { BaseDto } from './base.dto';

export class DepositDto extends BaseDto {
  asset: string;
  amount: number;
} 