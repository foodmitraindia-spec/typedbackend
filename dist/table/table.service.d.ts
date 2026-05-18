import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';
export declare class TableService {
    private repo;
    constructor(repo: Repository<Table>);
    create(data: any): Promise<Table[]>;
    findAll(restaurantId?: string): Promise<Table[]>;
    update(id: string, data: any): Promise<Table | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
