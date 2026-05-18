import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { MenuItem } from '../../menu-item/entities/menu-item.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() orderId: string;
  @ManyToOne(() => Order, o => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' }) order: Order;
  @Column() menuItemId: string;
  @ManyToOne(() => MenuItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuItemId' }) menuItem: MenuItem;
  @Column('int') quantity: number;
  @Column('float') price: number;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}