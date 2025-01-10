import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty()
  chainId: number;
  @ApiProperty()
  wallet: string;
} 