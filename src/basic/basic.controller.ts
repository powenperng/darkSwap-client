import { Body, Controller, Post } from '@nestjs/common';
import { ethers } from 'ethers';
import { DarkpoolContext } from 'src/common/context/darkpool.context';
import { TokenService } from 'src/common/token/token.service';
import { BasicService } from './basic.service';
import { DepositDto } from './dto/deposit.dto';

@Controller('basic')
export class BasicController {
  constructor(private readonly basicService: BasicService) {}

  @Post('deposit')
  async deposit(@Body() depositDto: DepositDto) {
    const context = await DarkpoolContext.createDarkpoolContext(depositDto.chain, depositDto.wallet)
    const token = await TokenService.getTokenByChainId(depositDto.chain, depositDto.asset);
    const amount = ethers.parseUnits(depositDto.amount.toString(), token.decimals);
    await this.basicService.deposit(context, token, amount);
    
    return { message: 'success' };
  }

  @Post('withdraw')
  withdraw() {
    return this.basicService.withdraw();
  }

}