import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query('restaurantId') restaurantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    if (restaurantId) {
      return this.orderService.findAllByRestaurant(restaurantId, startDate, endDate);
    }
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.orderService.updateStatus(id, status);
  }

  @Post(':id/complete-payment')
  completePayment(@Param('id') id: string, @Body() data: any) {
    return this.orderService.completePayment(id, data);
  }
}
