import { Injectable } from '@nestjs/common';
import { DepositService, Token, WithdrawService ,BatchJoinSplitService, SplitService, isAddressCompliant, DarkPool} from '@thesingularitynetwork/singularity-sdk';
import { DarkpoolContext } from '../common/context/darkpool.context';
import { DatabaseService } from '../common/db/database.service';
import { NoteBatchJoinSplitService } from 'src/common/noteBatchJoinSplit.service';
import { Note } from '@thesingularitynetwork/darkpool-v1-proof';

@Injectable()
export class BasicService {

  private static instance: BasicService;
  private dbService: DatabaseService;
  private noteBatchJoinSplitService: NoteBatchJoinSplitService;

  public constructor() {
    this.dbService = DatabaseService.getInstance();
    this.noteBatchJoinSplitService = NoteBatchJoinSplitService.getInstance();
  }

  // Method to deposit funds
  async deposit(darkPoolContext: DarkpoolContext, asset: Token, amount: bigint) {
    const depositService = new DepositService(darkPoolContext.darkPool);
    const { context, outNotes } = await depositService.prepare(
      asset.address, amount, darkPoolContext.walletAddress, darkPoolContext.signature);

    const id = await this.dbService.addNote(
      darkPoolContext.chainId, 
      darkPoolContext.publicKey, 
      darkPoolContext.walletAddress, 
      0, 
      outNotes[0].note,
      outNotes[0].rho, 
      outNotes[0].asset,
      outNotes[0].amount,
      3,
      '')
    await depositService.generateProof(context);
    const tx = await depositService.execute(context);
    await this.dbService.updateNoteTransactionAndStatus(id, tx);
  }

  // Method to withdraw funds
  async withdraw(darkPoolContext: DarkpoolContext, asset: Token, amount: bigint, receiptAddress : string) {
    
    if (!isAddressCompliant(receiptAddress, darkPoolContext.darkPool)) {
      throw new Error("Receipt address is not compliant")
    }

    const withdrawService = new WithdrawService(darkPoolContext.darkPool);

    const notes = await this.dbService.getNotesByAsset(asset.address, darkPoolContext.chainId);

    const notesToProcess = notes.map(note => {
      return {
        note: note.noteCommitment,
        rho: note.rho,
        asset: note.asset,
        amount: note.amount
      } as Note;
    });

    const noteToWithdraw = await this.noteBatchJoinSplitService.notesJoinSplit(notesToProcess, darkPoolContext, amount);
    if (noteToWithdraw === null){
      throw new Error("Insufficient funds");
    }

    const { context: withdrawContext } = await withdrawService.prepare(
      noteToWithdraw, receiptAddress, darkPoolContext.signature);
    await withdrawService.generateProof(withdrawContext);
    await withdrawService.executeAndWaitForResult(withdrawContext);
  }
}
