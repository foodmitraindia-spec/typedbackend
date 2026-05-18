import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuItemService {
  constructor(@InjectRepository(MenuItem) private repo: Repository<MenuItem>) {}

  async create(data: any) {
    return this.repo.save(this.repo.create(data));
  }

  async findAll(restaurantId?: string, categoryId?: string) {
    const where: any = {};
    if (restaurantId) where.restaurantId = restaurantId;
    if (categoryId) where.categoryId = categoryId;
    return this.repo.find({ where, relations: ['category'] });
  }

  async update(id: string, data: any) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }
}