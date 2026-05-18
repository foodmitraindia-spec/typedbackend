import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Table } from '../../table/entities/table.entity';
import type { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    tableId: string;
    table: Table;
    restaurantId: string;
    restaurant: Restaurant;
    status: string;
    totalAmount: number;
    discountAmount: number;
    taxAmount: number;
    finalAmount: number;
    paymentMethod: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
