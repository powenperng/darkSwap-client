import { Body, Controller, Post } from '@nestjs/common';
import { DarkpoolContext } from '../common/context/darkpool.context';
import { TokenService } from '../common/token/token.service';
import { BasicService } from './basic.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { BaseDto } from '../common/dto/base.dto';

@Controller('basic')
export class BasicController {
  constructor(private readonly basicService: BasicService) { }

  @Post('deposit')
  async deposit(@Body() depositDto: DepositDto) {
    const context = await DarkpoolContext.createDarkpoolContext(depositDto.chainId, depositDto.wallet)
    const token = await TokenService.getTokenByChainId(depositDto.chainId, depositDto.asset);
    await this.basicService.deposit(context, token, BigInt(depositDto.amount));
    return { message: 'success' };
  }

  @Post('withdraw')
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    const context = await DarkpoolContext.createDarkpoolContext(withdrawDto.chainId, withdrawDto.wallet)
    const token = await TokenService.getTokenByChainId(withdrawDto.chainId, withdrawDto.asset);
    await this.basicService.withdraw(context, token, BigInt(withdrawDto.amount), withdrawDto.receiptAddress);
    return { message: 'success' };
  }

  @Post('mintAccessToken')
  async mintAccessToken(@Body() baseDto: BaseDto) {
    return { message: 'success' };
  }
}
