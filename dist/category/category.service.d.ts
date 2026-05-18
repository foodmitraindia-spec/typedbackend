import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoryService {
    private catRepo;
    constructor(catRepo: Repository<Category>);
    create(data: any): Promise<Category[]>;
    findAll(restaurantId?: string): Promise<Category[]>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
