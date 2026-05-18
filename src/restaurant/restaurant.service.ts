import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { Table } from '../table/entities/table.entity';
import { Category } from '../category/entities/category.entity';
import { MenuItem } from '../menu-item/entities/menu-item.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private resRepository: Repository<Restaurant>,
    private dataSource: DataSource
  ) {}

  async create(data: any) {
    const { name, address, adminEmail, adminPassword } = data;
    
    return this.dataSource.transaction(async (manager) => {
      const restaurant = manager.create(Restaurant, { name, address });
      const savedRes = await manager.save(Restaurant, restaurant);

      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const user = manager.create(User, {
        email: adminEmail,
        password: hashedPassword,
        name: 'Restaurant Admin',
        role: 'ADMIN',
        restaurantId: savedRes.id
      });
      await manager.save(User, user);

      return savedRes;
    });
  }

  async findAll() {
    const restaurants = await this.resRepository.find({ order: { createdAt: 'DESC' } });
    const userRepo = this.dataSource.getRepository(User);
    for (const res of restaurants) {
      res.users = await userRepo.find({ where: { restaurantId: res.id, role: 'ADMIN' }, take: 1 });
    }
    return restaurants;
  }

  async findOne(id: string) {
    const restaurant = await this.resRepository.findOne({ where: { id } });
    if (!restaurant) return null;

    const tableRepo = this.dataSource.getRepository(Table);
    const categoryRepo = this.dataSource.getRepository(Category);
    const menuItemRepo = this.dataSource.getRepository(MenuItem);

    restaurant.tables = await tableRepo.find({ where: { restaurantId: id } });
    restaurant.categories = await categoryRepo.find({ where: { restaurantId: id } });
    restaurant.menuItems = await menuItemRepo.find({ where: { restaurantId: id } });

    return restaurant;
  }

  async updateSettings(id: string, data: any) {
    await this.resRepository.update(id, {
      gstNumber: data.gstNumber,
      gstPercentage: parseFloat(data.gstPercentage) || 5.0,
      address: data.address,
      phone: data.phone
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.resRepository.delete(id);
  }

  async getGlobalAnalytics() {
    const orderRepo = this.dataSource.getRepository(Order);
    
    const completedOrders = await orderRepo.find({ where: { status: 'COMPLETED' } });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.finalAmount, 0);
    const totalOrders = completedOrders.length;

    const restaurants = await this.resRepository.find();
    const formattedSales = [];
    for (const res of restaurants) {
      const completed = await orderRepo.find({ where: { restaurantId: res.id, status: 'COMPLETED' } });
      formattedSales.push({
        id: res.id,
        name: res.name,
        orderCount: completed.length,
        totalRevenue: completed.reduce((sum, o) => sum + o.finalAmount, 0)
      });
    }

    return {
      overview: {
        totalRevenue,
        totalOrders
      },
      restaurantBreakdown: formattedSales
    };
  }

  async getRestaurantAnalytics(restaurantId: string) {
    const orderRepo = this.dataSource.getRepository(Order);
    const tableRepo = this.dataSource.getRepository(Table);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await orderRepo.find({
      where: {
        restaurantId,
        status: 'COMPLETED',
        createdAt: Between(today, new Date())
      }
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.finalAmount, 0);
    const totalTablesCount = await tableRepo.count({ where: { restaurantId } });

    const recentOrders = await orderRepo.find({
      where: { restaurantId },
      relations: ['table'],
      order: { createdAt: 'DESC' },
      take: 5
    });

    return {
      todayRevenue,
      todayOrders: todayOrders.length,
      totalTables: totalTablesCount,
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        tableNumber: o.table?.number,
        totalAmount: o.finalAmount,
        status: o.status,
        time: o.createdAt
      }))
    };
  }

  async getDetailedAnalytics(restaurantId: string, timeframe: string = '7days') {
    const orderRepo = this.dataSource.getRepository(Order);
    const now = new Date();
    const startDate = new Date();

    if (timeframe === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === '30days') {
      startDate.setDate(now.getDate() - 30);
    } else if (timeframe === '7days') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'year') {
      startDate.setFullYear(now.getFullYear(), 0, 1);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    const orders = await orderRepo.find({
      where: {
        restaurantId,
        status: 'COMPLETED',
        createdAt: Between(startDate, now)
      },
      relations: ['items', 'items.menuItem', 'items.menuItem.category']
    });

    const salesByDay: Record<string, number> = {};
    const salesByCategory: Record<string, number> = {};
    let totalRevenue = 0;

    orders.forEach(order => {
      const day = order.createdAt.toLocaleDateString('en-US', { weekday: 'short' });
      salesByDay[day] = (salesByDay[day] || 0) + order.finalAmount;
      totalRevenue += order.finalAmount;

      order.items.forEach(item => {
        if (item.menuItem && item.menuItem.category) {
          const catName = item.menuItem.category.name;
          salesByCategory[catName] = (salesByCategory[catName] || 0) + (item.price * item.quantity);
        }
      });
    });

    const salesData = Object.entries(salesByDay).map(([name, total]) => ({ name, total }));
    const categoryData = Object.entries(salesByCategory).map(([name, value]) => {
      const percentage = (value / (totalRevenue || 1)) * 100;
      return { name, value: Math.round(percentage) };
    });

    return {
      overview: {
        totalRevenue,
        totalOrders: orders.length,
        avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
        newCustomers: Math.round(orders.length * 0.4),
      },
      salesData,
      categoryData
    };
  }

  async getExplorerAnalytics(restaurantId: string) {
    const orderRepo = this.dataSource.getRepository(Order);
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const yearlyOrders = await orderRepo.find({
      where: {
        restaurantId,
        status: 'COMPLETED',
        createdAt: Between(startOfYear, now)
      }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yearlyData = months.map((m, i) => {
      const revenue = yearlyOrders
        .filter(o => o.createdAt.getMonth() === i)
        .reduce((sum, o) => sum + o.finalAmount, 0);
      return { name: m, total: revenue };
    });

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyOrders = yearlyOrders.filter(o => 
      o.createdAt >= startOfMonth && o.createdAt <= endOfMonth
    );

    const calendarData: Record<number, { revenue: number, orders: number }> = {};
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      calendarData[i] = { revenue: 0, orders: 0 };
    }

    monthlyOrders.forEach(o => {
      const day = o.createdAt.getDate();
      calendarData[day].revenue += o.finalAmount;
      calendarData[day].orders += 1;
    });

    const formattedCalendar = Object.entries(calendarData).map(([day, stats]) => ({
      day: parseInt(day),
      revenue: stats.revenue,
      orders: stats.orders
    }));

    return {
      yearlyData,
      calendarData: formattedCalendar,
      stats: {
        totalRevenue: yearlyOrders.reduce((sum, o) => sum + o.finalAmount, 0),
        avgOrder: yearlyOrders.length > 0 ? yearlyOrders.reduce((sum, o) => sum + o.finalAmount, 0) / yearlyOrders.length : 0,
        totalOrders: yearlyOrders.length
      }
    };
  }
}