import { Injectable } from '@nestjs/common';
import { DepositService, Token } from '@thesingularitynetwork/singularity-sdk';
import { DarkpoolContext } from 'src/common/context/darkpool.context';

@Injectable()
export class BasicService {
  // Method to deposit funds
  async deposit(darkPoolContext: DarkpoolContext, asset: Token, amount: bigint) {
    const depositService = new DepositService(darkPoolContext.darkPool);
    const { context, outNotes } = await depositService.prepare(asset.address, amount, darkPoolContext.walletAddress, darkPoolContext.signature);
    //FIXME save outNotes to db
    const tx = await depositService.execute(context);
    //FIXME save tx to db and update outNotes status
  }

  // Method to withdraw funds
  withdraw() {
    // Logic to withdraw funds
  }
}