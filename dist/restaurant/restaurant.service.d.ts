import { Repository, DataSource } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
export declare class RestaurantService {
    private resRepository;
    private dataSource;
    constructor(resRepository: Repository<Restaurant>, dataSource: DataSource);
    create(data: any): Promise<Restaurant>;
    findAll(): Promise<Restaurant[]>;
    findOne(id: string): Promise<Restaurant | null>;
    updateSettings(id: string, data: any): Promise<Restaurant | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    getGlobalAnalytics(): Promise<{
        overview: {
            totalRevenue: number;
            totalOrders: number;
        };
        restaurantBreakdown: {
            id: string;
            name: string;
            orderCount: number;
            totalRevenue: number;
        }[];
    }>;
    getRestaurantAnalytics(restaurantId: string): Promise<{
        todayRevenue: number;
        todayOrders: number;
        totalTables: number;
        recentOrders: {
            id: string;
            tableNumber: string;
            totalAmount: number;
            status: string;
            time: Date;
        }[];
    }>;
    getDetailedAnalytics(restaurantId: string, timeframe?: string): Promise<{
        overview: {
            totalRevenue: number;
            totalOrders: number;
            avgOrderValue: number;
            newCustomers: number;
        };
        salesData: {
            name: string;
            total: number;
        }[];
        categoryData: {
            name: string;
            value: number;
        }[];
    }>;
    getExplorerAnalytics(restaurantId: string): Promise<{
        yearlyData: {
            name: string;
            total: number;
        }[];
        calendarData: {
            day: number;
            revenue: number;
            orders: number;
        }[];
        stats: {
            totalRevenue: number;
            avgOrder: number;
            totalOrders: number;
        };
    }>;
}
