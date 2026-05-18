"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const restaurant_entity_1 = require("./entities/restaurant.entity");
const user_entity_1 = require("../user/entities/user.entity");
const order_entity_1 = require("../order/entities/order.entity");
const table_entity_1 = require("../table/entities/table.entity");
const category_entity_1 = require("../category/entities/category.entity");
const menu_item_entity_1 = require("../menu-item/entities/menu-item.entity");
const bcrypt = __importStar(require("bcrypt"));
let RestaurantService = class RestaurantService {
    resRepository;
    dataSource;
    constructor(resRepository, dataSource) {
        this.resRepository = resRepository;
        this.dataSource = dataSource;
    }
    async create(data) {
        const { name, address, adminEmail, adminPassword } = data;
        return this.dataSource.transaction(async (manager) => {
            const restaurant = manager.create(restaurant_entity_1.Restaurant, { name, address });
            const savedRes = await manager.save(restaurant_entity_1.Restaurant, restaurant);
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const user = manager.create(user_entity_1.User, {
                email: adminEmail,
                password: hashedPassword,
                name: 'Restaurant Admin',
                role: 'ADMIN',
                restaurantId: savedRes.id
            });
            await manager.save(user_entity_1.User, user);
            return savedRes;
        });
    }
    async findAll() {
        const restaurants = await this.resRepository.find({ order: { createdAt: 'DESC' } });
        const userRepo = this.dataSource.getRepository(user_entity_1.User);
        for (const res of restaurants) {
            res.users = await userRepo.find({ where: { restaurantId: res.id, role: 'ADMIN' }, take: 1 });
        }
        return restaurants;
    }
    async findOne(id) {
        const restaurant = await this.resRepository.findOne({ where: { id } });
        if (!restaurant)
            return null;
        const tableRepo = this.dataSource.getRepository(table_entity_1.Table);
        const categoryRepo = this.dataSource.getRepository(category_entity_1.Category);
        const menuItemRepo = this.dataSource.getRepository(menu_item_entity_1.MenuItem);
        restaurant.tables = await tableRepo.find({ where: { restaurantId: id } });
        restaurant.categories = await categoryRepo.find({ where: { restaurantId: id } });
        restaurant.menuItems = await menuItemRepo.find({ where: { restaurantId: id } });
        return restaurant;
    }
    async updateSettings(id, data) {
        await this.resRepository.update(id, {
            gstNumber: data.gstNumber,
            gstPercentage: parseFloat(data.gstPercentage) || 5.0,
            address: data.address,
            phone: data.phone
        });
        return this.findOne(id);
    }
    async remove(id) {
        return this.resRepository.delete(id);
    }
    async getGlobalAnalytics() {
        const orderRepo = this.dataSource.getRepository(order_entity_1.Order);
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
    async getRestaurantAnalytics(restaurantId) {
        const orderRepo = this.dataSource.getRepository(order_entity_1.Order);
        const tableRepo = this.dataSource.getRepository(table_entity_1.Table);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await orderRepo.find({
            where: {
                restaurantId,
                status: 'COMPLETED',
                createdAt: (0, typeorm_2.Between)(today, new Date())
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
    async getDetailedAnalytics(restaurantId, timeframe = '7days') {
        const orderRepo = this.dataSource.getRepository(order_entity_1.Order);
        const now = new Date();
        const startDate = new Date();
        if (timeframe === 'today') {
            startDate.setHours(0, 0, 0, 0);
        }
        else if (timeframe === '30days') {
            startDate.setDate(now.getDate() - 30);
        }
        else if (timeframe === '7days') {
            startDate.setDate(now.getDate() - 7);
        }
        else if (timeframe === 'year') {
            startDate.setFullYear(now.getFullYear(), 0, 1);
        }
        else {
            startDate.setMonth(now.getMonth() - 1);
        }
        const orders = await orderRepo.find({
            where: {
                restaurantId,
                status: 'COMPLETED',
                createdAt: (0, typeorm_2.Between)(startDate, now)
            },
            relations: ['items', 'items.menuItem', 'items.menuItem.category']
        });
        const salesByDay = {};
        const salesByCategory = {};
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
    async getExplorerAnalytics(restaurantId) {
        const orderRepo = this.dataSource.getRepository(order_entity_1.Order);
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const yearlyOrders = await orderRepo.find({
            where: {
                restaurantId,
                status: 'COMPLETED',
                createdAt: (0, typeorm_2.Between)(startOfYear, now)
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
        const monthlyOrders = yearlyOrders.filter(o => o.createdAt >= startOfMonth && o.createdAt <= endOfMonth);
        const calendarData = {};
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
};
exports.RestaurantService = RestaurantService;
exports.RestaurantService = RestaurantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], RestaurantService);
//# sourceMappingURL=restaurant.service.js.map