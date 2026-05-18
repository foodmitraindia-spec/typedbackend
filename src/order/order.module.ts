import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Table } from '../table/entities/table.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Table, Restaurant])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}