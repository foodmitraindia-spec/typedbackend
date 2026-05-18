import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Table } from '../table/entities/table.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Table) private tableRepo: Repository<Table>,
    @InjectRepository(Restaurant) private restaurantRepo: Repository<Restaurant>
  ) {}

  async create(data: any) {
    const tableId = data.tableId;
    const restaurantId = data.restaurantId;

    let order: Order | null = null;
    if (tableId) {
      const table = await this.tableRepo.findOne({ where: { id: tableId } });
      if (table && table.status === 'OCCUPIED' && table.currentOrderId) {
        order = await this.orderRepo.findOne({ where: { id: table.currentOrderId } });
      }
    }

    if (!order) {
      const newOrder = this.orderRepo.create({
        tableId,
        restaurantId,
        status: 'PENDING',
        totalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        finalAmount: 0,
      });
      order = await this.orderRepo.save(newOrder);
    }

    // Add new items
    const orderItems = data.items.map((item: any) => this.orderItemRepo.create({
      orderId: order!.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes,
    }));
    await this.orderItemRepo.save(orderItems);

    // Recalculate totals
    const restaurant = await this.restaurantRepo.findOne({ where: { id: restaurantId } });
    const gstPercent = restaurant?.gstPercentage || 5.0;

    const items = await this.orderItemRepo.find({ where: { orderId: order!.id } });
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * (gstPercent / 100);
    const final = subtotal + tax;

    await this.orderRepo.update(order!.id, {
      totalAmount: subtotal,
      taxAmount: tax,
      finalAmount: final,
    });

    // Update Table Status
    if (tableId) {
      await this.tableRepo.update(tableId, {
        status: 'OCCUPIED',
        currentOrderId: order!.id
      });
    }

    return this.findOne(order!.id);
  }

  async completePayment(id: string, data: any) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new Error('Order not found');

    await this.orderRepo.update(id, {
      status: 'COMPLETED',
      paymentMethod: data.paymentMethod || 'CASH'
    });

    if (order.tableId) {
      await this.tableRepo.update(order.tableId, {
        status: 'EMPTY',
        currentOrderId: null
      });
    }

    return this.findOne(id);
  }

  async findAllByRestaurant(restaurantId: string, startDate?: string, endDate?: string) {
    const where: any = { restaurantId };
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date('2000-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      if (endDate) {
        end.setHours(23, 59, 59, 999);
      }
      where.createdAt = Between(start, end);
    }

    return this.orderRepo.find({
      where,
      relations: ['items', 'items.menuItem', 'table'],
      order: { createdAt: 'DESC' }
    });
  }

  async findAll() {
    return this.orderRepo.find({
      relations: ['items', 'items.menuItem', 'table'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string) {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.menuItem', 'table', 'restaurant']
    });
  }

  async updateStatus(id: string, status: any) {
    await this.orderRepo.update(id, { status });
    return this.findOne(id);
  }
}