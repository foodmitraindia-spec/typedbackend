import { Restaurant } from '../../restaurant/entities/restaurant.entity';
export declare class Category {
    id: string;
    name: string;
    restaurantId: string;
    restaurant: Restaurant;
    createdAt: Date;
    updatedAt: Date;
}
