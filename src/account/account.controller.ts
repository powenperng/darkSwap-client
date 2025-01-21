import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { MyAssetsDto } from './dto/asset.dto';
import { BaseDto } from '../common/dto/base.dto';
import { ApiGenericResponse } from 'src/common/response.interface';

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
