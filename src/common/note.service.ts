import { Note } from '@thesingularitynetwork/darkpool-v1-proof';
import { DarkpoolContext } from './context/darkpool.context';
import { DatabaseService } from './db/database.service';

export class NoteService {
  private static instance: NoteService;
  private dbService: DatabaseService;

  private constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  public static getInstance(): NoteService {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService();
    }
    return NoteService.instance;
  }

  public addNotes(notes: Note[], darkPoolContext: DarkpoolContext) {
    for (const note of notes) {
      this.addNote(note, darkPoolContext);
    }
  }

  public addNote(note: Note, darkPoolContext: DarkpoolContext) {
    this.dbService.addNote(
      darkPoolContext.chainId,
      darkPoolContext.publicKey,
      darkPoolContext.walletAddress,
      0,
      note.note,
      note.rho,
      note.asset,
      note.amount,
      '');
  }

  public setNoteUsed(note: Note, darkPoolContext: DarkpoolContext) {
    this.dbService.updateNoteSpentByWalletAndNoteCommitment(darkPoolContext.walletAddress, darkPoolContext.chainId, note.note);
  }

  public setNotesActive(notes: Note[], darkPoolContext: DarkpoolContext, txHash: string) {
    for (const note of notes) {
      this.setNoteActive(note, darkPoolContext, txHash);
    }
  }

  public setNoteActive(note: Note, darkPoolContext: DarkpoolContext, txHash: string) {
    this.dbService.updateNoteTransactionByWalletAndNoteCommitment (darkPoolContext.walletAddress, darkPoolContext.chainId, note.note, txHash);
  }
}
