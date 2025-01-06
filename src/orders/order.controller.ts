import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { DarkpoolContext } from '../common/context/darkpool.context';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() orderDto: OrderDto) {
    const context = await DarkpoolContext.createDarkpoolContext(orderDto.chainId, orderDto.wallet)
    return this.orderService.createOrder(orderDto, context);
  }

  async cancel(@Body() cancelOrderDto: OrderDto) {
    const context = await DarkpoolContext.createDarkpoolContext(cancelOrderDto.chainId, cancelOrderDto.wallet)
    return this.orderService.cancelOrder(cancelOrderDto, context);
  }


  @Get()
  findAll(@Param('status') status: number, @Param('page') page: number, @Param('limit') limit: number) {
    return this.orderService.getOrdersByStatusAndPage(status, page, limit);
  }

}