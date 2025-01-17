import { Body, Controller, Get, Post } from '@nestjs/common';
import { ethers } from 'ethers';
import { DarkpoolContext } from 'src/common/context/darkpool.context';
import { TokenService } from 'src/common/token/token.service';
import { BasicService } from './basic.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('basic')
export class BasicController {
  constructor(private readonly basicService: BasicService) { }

  @Post('deposit')
  async deposit(@Body() depositDto: DepositDto) {
    const context = await DarkpoolContext.createDarkpoolContext(depositDto.chainId, depositDto.wallet)
    const token = await TokenService.getTokenByChainId(depositDto.chainId, depositDto.asset);
    await this.basicService.deposit(context, token, depositDto.amount);
    return { message: 'success' };
  }

  @Post('withdraw')
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    const context = await DarkpoolContext.createDarkpoolContext(withdrawDto.chainId, withdrawDto.wallet)
    const token = await TokenService.getTokenByChainId(withdrawDto.chainId, withdrawDto.asset);
    await this.basicService.withdraw(context, token, withdrawDto.amount, withdrawDto.receiptAddress);
    return { message: 'success' };
  }

  @Get('syncNoteStatus')
  async syncNoteStatus() {
    return this.basicService.syncNoteStatus();
  }
}