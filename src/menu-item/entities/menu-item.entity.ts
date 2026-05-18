import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Category } from '../../category/entities/category.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) description: string;
  @Column('float') price: number;
  @Column({ nullable: true }) image: string;
  @Column({ default: true }) isAvailable: boolean;
  @Column() categoryId: string;
  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' }) category: Category;
  @Column() restaurantId: string;
  @ManyToOne(() => Restaurant, r => r.menuItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' }) restaurant: Restaurant;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}