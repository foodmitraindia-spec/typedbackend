import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Table } from '../../table/entities/table.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ nullable: true }) tableId: string;
  @ManyToOne(() => Table, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'tableId' }) table: Table;
  @Column() restaurantId: string;
  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' }) restaurant: Restaurant;
  @Column({ default: 'PENDING' }) status: string;
  @Column('float') totalAmount: number;
  @Column('float', { default: 0 }) discountAmount: number;
  @Column('float', { default: 0 }) taxAmount: number;
  @Column('float') finalAmount: number;
  @Column({ nullable: true }) paymentMethod: string;
  @OneToMany(() => OrderItem, item => item.order, { cascade: true }) items: OrderItem[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}