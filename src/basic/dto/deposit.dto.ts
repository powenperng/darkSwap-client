import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../../common/dto/base.dto";

export class DepositDto extends BaseDto {
  @ApiProperty()
  asset: string;
  @ApiProperty()
  amount: bigint;
} 