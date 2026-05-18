import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private catRepo: Repository<Category>) {}

  async create(data: any) {
    return this.catRepo.save(this.catRepo.create(data));
  }

  async findAll(restaurantId?: string) {
    return this.catRepo.find({ where: restaurantId ? { restaurantId } : {} });
  }

  async remove(id: string) {
    return this.catRepo.delete(id);
  }
}