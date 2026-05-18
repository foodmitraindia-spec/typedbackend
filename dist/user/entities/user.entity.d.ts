import { Restaurant } from '../../restaurant/entities/restaurant.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    restaurantId: string;
    restaurant: Restaurant;
    createdAt: Date;
    updatedAt: Date;
}
