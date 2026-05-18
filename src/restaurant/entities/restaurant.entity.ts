import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) address: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) gstNumber: string;
  @Column('float', { default: 5.0 }) gstPercentage: number;
  
  // Non-relational virtual fields
  users: any[];
  categories: any[];
  tables: any[];
  menuItems: any[];
  orders: any[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}