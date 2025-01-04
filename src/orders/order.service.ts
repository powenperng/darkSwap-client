import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { Note } from '@thesingularitynetwork/darkpool-v1-proof';
import { DatabaseService } from '../common/db/database.service';
import { DarkpoolContext } from '../common/context/darkpool.context';
import { CreateMakerOrderService, CancelOrderService} from '@thesingularitynetwork/singularity-sdk';
import { NoteBatchJoinSplitService } from 'src/common/noteBatchJoinSplit.service';
import axios from 'axios';

@Injectable()
export class OrderService {
  // Method to create an order
  async createOrder(orderDto: OrderDto, darkPoolContext: DarkpoolContext) {
    const createMakerOrderService = new CreateMakerOrderService(darkPoolContext.darkPool);

    const dbservice = DatabaseService.getInstance();
    const assetPair = await dbservice.getAssetPairById(orderDto.assetPairId);
    const outAsset = orderDto.orderDirection === 0 ? assetPair.assetB : assetPair.assetA;
    const notes = await dbservice.getNotesByAsset(outAsset, darkPoolContext.chainId);
    const notesToProcess = notes.map(note => {
      return {
        note: note.noteCommitment,
        rho: note.rho,
        asset: note.asset,
        amount: note.amount
      } as Note;
    });

    const noteForOrder = await NoteBatchJoinSplitService.notesJoinSplit(notesToProcess, darkPoolContext, orderDto.amountOut); 
    const {context, outNotes} = await createMakerOrderService.prepare(noteForOrder,darkPoolContext.signature);
    await createMakerOrderService.generateProof(context);
    const tx = await createMakerOrderService.execute(context);
    orderDto.status = 0;
    orderDto.nullifier = BigInt(context.proof.outNullifier);
    orderDto.txHashCreated = tx;

    await dbservice.addOrderByDto(orderDto);
    await axios.post(`${process.env.BOOKNODE_API_URL}/createOrder`, orderDto,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOOKNODE_API_KEY}`
      }
    });
  }

  // Method to cancel an order
  async cancelOrder(cancelOrderDto: OrderDto, darkPoolContext: DarkpoolContext) {
    const dbservice = DatabaseService.getInstance();
    const cancelOrderService = new CancelOrderService(darkPoolContext.darkPool);

    const note = await dbservice.getNoteByCommitment(cancelOrderDto.noteCommitment);
    const noteToProcess = {
      note: note.noteCommitment,
      rho: note.rho,
      asset: note.asset,
      amount: note.amount
    } as Note;

    const {context, outNotes} = await cancelOrderService.prepare(noteToProcess, darkPoolContext.signature);
    await cancelOrderService.generateProof(context);
    await cancelOrderService.execute(context);
    await dbservice.cancelOrder(cancelOrderDto.orderId);
    await axios.post(`${process.env.BOOKNODE_API_URL}/cancelOrder`, cancelOrderDto,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOOKNODE_API_KEY}`
      }
    });
  }
  // Method to get orders by status and page
  getOrdersByStatusAndPage(status: number, page: number, limit: number): Promise<OrderDto[]> {
    const dbservice = DatabaseService.getInstance();
    return dbservice.getOrdersByStatusAndPage(status, page, limit);
  }
}