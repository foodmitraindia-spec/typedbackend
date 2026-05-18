import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Table } from '../table/entities/table.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
export declare class OrderService {
    private orderRepo;
    private orderItemRepo;
    private tableRepo;
    private restaurantRepo;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>, tableRepo: Repository<Table>, restaurantRepo: Repository<Restaurant>);
    create(data: any): Promise<Order | null>;
    completePayment(id: string, data: any): Promise<Order | null>;
    findAllByRestaurant(restaurantId: string, startDate?: string, endDate?: string): Promise<Order[]>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order | null>;
    updateStatus(id: string, status: any): Promise<Order | null>;
}
