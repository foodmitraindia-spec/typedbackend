import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Category } from '../../category/entities/category.entity';
export declare class MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    categoryId: string;
    category: Category;
    restaurantId: string;
    restaurant: Restaurant;
    createdAt: Date;
    updatedAt: Date;
}
