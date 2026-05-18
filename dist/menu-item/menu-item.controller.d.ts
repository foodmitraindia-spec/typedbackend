import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
export declare class MenuItemController {
    private readonly menuItemService;
    constructor(menuItemService: MenuItemService);
    create(createMenuItemDto: CreateMenuItemDto): Promise<import("./entities/menu-item.entity").MenuItem[]>;
    findAll(restaurantId: string, categoryId?: string): Promise<import("./entities/menu-item.entity").MenuItem[]>;
    update(id: string, updateMenuItemDto: any): Promise<import("./entities/menu-item.entity").MenuItem | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
