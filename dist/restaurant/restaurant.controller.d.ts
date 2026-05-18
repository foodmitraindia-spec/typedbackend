import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    findAll(): Promise<import("./entities/restaurant.entity").Restaurant[]>;
    create(createRestaurantDto: any): Promise<import("./entities/restaurant.entity").Restaurant>;
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
    findOne(id: string): Promise<import("./entities/restaurant.entity").Restaurant | null>;
    updateSettings(id: string, data: any): Promise<import("./entities/restaurant.entity").Restaurant | null>;
    getRestaurantAnalytics(id: string): Promise<{
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
    getDetailedAnalytics(id: string, timeframe: string): Promise<{
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
    getExplorerAnalytics(id: string): Promise<{
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
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
