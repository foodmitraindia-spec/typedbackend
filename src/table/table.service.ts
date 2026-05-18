import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {
  constructor(@InjectRepository(Table) private repo: Repository<Table>) {}

  async create(data: any) {
    return this.repo.save(this.repo.create(data));
  }

  async findAll(restaurantId?: string) {
    return this.repo.find({ where: restaurantId ? { restaurantId } : {} });
  }

  async update(id: string, data: any) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }
}