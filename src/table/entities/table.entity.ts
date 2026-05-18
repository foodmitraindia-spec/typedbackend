import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() number: string;
  @Column('int', { default: 4 }) capacity: number;
  @Column({ default: 'EMPTY' }) status: string;
  @Column({ nullable: true }) currentOrderId: string | null;
  @Column() restaurantId: string;
  @ManyToOne(() => Restaurant, r => r.tables, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' }) restaurant: Restaurant;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}