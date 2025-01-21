import { ApiResponseProperty } from "@nestjs/swagger";

export class AssetPairDto {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  chainId: number;
  @ApiResponseProperty()
  baseAddress: string;
  @ApiResponseProperty()
  baseSymbol: string;
  @ApiResponseProperty()
  baseDecimal: number;
  @ApiResponseProperty()
  quoteAddress: string;
  @ApiResponseProperty()
  quoteSymbol: string;
  @ApiResponseProperty()
  quoteDecimal: number;
}