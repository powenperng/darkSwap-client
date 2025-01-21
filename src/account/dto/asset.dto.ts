import { ApiResponseProperty } from "@nestjs/swagger";

export class AssetDto {
    @ApiResponseProperty()
    asset: string;
    @ApiResponseProperty()
    amount: string;
    @ApiResponseProperty()
    lockedAmount: string;
}

export class MyAssetsDto {
    @ApiResponseProperty()
    chainId: number;
    @ApiResponseProperty()
    assets: AssetDto[];
}