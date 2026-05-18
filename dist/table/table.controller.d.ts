import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
export declare class TableController {
    private readonly tableService;
    constructor(tableService: TableService);
    create(createTableDto: CreateTableDto): Promise<import("./entities/table.entity").Table[]>;
    findAll(restaurantId: string): Promise<import("./entities/table.entity").Table[]>;
    update(id: string, updateTableDto: any): Promise<import("./entities/table.entity").Table | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
