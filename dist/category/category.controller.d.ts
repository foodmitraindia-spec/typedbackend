import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity").Category[]>;
    findAll(restaurantId: string): Promise<import("./entities/category.entity").Category[]>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
