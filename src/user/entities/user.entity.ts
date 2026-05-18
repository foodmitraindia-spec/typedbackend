import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @Column() name: string;
  @Column({ default: 'STAFF' }) role: string;
  @Column({ nullable: true }) restaurantId: string;
  @ManyToOne(() => Restaurant, restaurant => restaurant.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' }) restaurant: Restaurant;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}