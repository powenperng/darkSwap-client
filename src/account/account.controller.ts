import { Body, Controller, Post } from '@nestjs/common';
import { ApiGenericResponse } from '../common/response.interface';
import { BaseDto } from '../common/dto/base.dto';
import { AccountService } from './account.service';
import { MyAssetsDto } from './dto/asset.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  // @Get('/:wallet')
  // async getAssets(@Param('wallet') wallet: string): Promise<MyAssetsDto[]> {
  //   return this.accountService.getAssets(wallet);
  // }

  @Post()
  @ApiGenericResponse(MyAssetsDto)
  async getAssetsByChainIdAndWallet(@Body() baseDto: BaseDto): Promise<MyAssetsDto> {
    return this.accountService.getAssetsByChainId(baseDto.wallet, baseDto.chainId);
  }
}
