import { Restaurant } from '../../restaurant/entities/restaurant.entity';
export declare class Table {
    id: string;
    number: string;
    capacity: number;
    status: string;
    currentOrderId: string | null;
    restaurantId: string;
    restaurant: Restaurant;
    createdAt: Date;
    updatedAt: Date;
}
