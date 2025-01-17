import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { DarkpoolContext } from '../common/context/darkpool.context';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('createOrder')
  async createOrder(@Body() orderDto: OrderDto) {
    const dto: OrderDto = {
      ...orderDto,
      amountOut: BigInt(orderDto.amountOut),
      amountIn: BigInt(orderDto.amountIn),
    }
    const context = await DarkpoolContext.createDarkpoolContext(dto.chainId, dto.wallet)
    return this.orderService.createOrder(dto, context);
  }

  @Post('cancelOrder')
  async cancelOrder(@Body() orderId: string, wallet: string, chainId: number) {
    const context = await DarkpoolContext.createDarkpoolContext(chainId, wallet)
    return this.orderService.cancelOrder(orderId, context);
  }


  @Get('getAllOrders/:status/:page/:limit')
  getAllOrders(@Param('status') status: number, @Param('page') page: number, @Param('limit') limit: number) {
    return this.orderService.getOrdersByStatusAndPage(status, page, limit);
  }

  @Get('getOrderById/:orderId')
  getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Get('getAssetPairs')
  getAssetPairs(@Param('chainId') chainId: number) {
    return this.orderService.getAssetPairs(chainId);
  }

}