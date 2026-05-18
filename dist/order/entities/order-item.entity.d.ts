import type { Order } from './order.entity';
import { MenuItem } from '../../menu-item/entities/menu-item.entity';
export declare class OrderItem {
    id: string;
    orderId: string;
    order: Order;
    menuItemId: string;
    menuItem: MenuItem;
    quantity: number;
    price: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
