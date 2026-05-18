import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
export declare class MenuItemService {
    private repo;
    constructor(repo: Repository<MenuItem>);
    create(data: any): Promise<MenuItem[]>;
    findAll(restaurantId?: string, categoryId?: string): Promise<MenuItem[]>;
    update(id: string, data: any): Promise<MenuItem | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
