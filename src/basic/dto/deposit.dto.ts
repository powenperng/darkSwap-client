import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../../common/dto/base.dto";
import { IsEthereumAddress } from "src/common/decorators/is-ethereum-address.decorator";
import { IsNotEmpty } from "class-validator";
import { IsBigIntString } from "src/common/decorators/is-bigint-string.decorator";

export class DepositDto extends BaseDto {
  @ApiProperty()
  @IsEthereumAddress()
  asset: string;
  @ApiProperty({
    description: 'Amount with decimals',
    type: 'string',
  })
  @IsBigIntString()
  @IsNotEmpty()
  amount: bigint;
}