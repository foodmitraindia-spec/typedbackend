"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const table_entity_1 = require("../table/entities/table.entity");
const restaurant_entity_1 = require("../restaurant/entities/restaurant.entity");
let OrderService = class OrderService {
    orderRepo;
    orderItemRepo;
    tableRepo;
    restaurantRepo;
    constructor(orderRepo, orderItemRepo, tableRepo, restaurantRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.tableRepo = tableRepo;
        this.restaurantRepo = restaurantRepo;
    }
    async create(data) {
        const tableId = data.tableId;
        const restaurantId = data.restaurantId;
        let order = null;
        if (tableId) {
            const table = await this.tableRepo.findOne({ where: { id: tableId } });
            if (table && table.status === 'OCCUPIED' && table.currentOrderId) {
                order = await this.orderRepo.findOne({ where: { id: table.currentOrderId } });
            }
        }
        if (!order) {
            const newOrder = this.orderRepo.create({
                tableId,
                restaurantId,
                status: 'PENDING',
                totalAmount: 0,
                discountAmount: 0,
                taxAmount: 0,
                finalAmount: 0,
            });
            order = await this.orderRepo.save(newOrder);
        }
        const orderItems = data.items.map((item) => this.orderItemRepo.create({
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes,
        }));
        await this.orderItemRepo.save(orderItems);
        const restaurant = await this.restaurantRepo.findOne({ where: { id: restaurantId } });
        const gstPercent = restaurant?.gstPercentage || 5.0;
        const items = await this.orderItemRepo.find({ where: { orderId: order.id } });
        const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = subtotal * (gstPercent / 100);
        const final = subtotal + tax;
        await this.orderRepo.update(order.id, {
            totalAmount: subtotal,
            taxAmount: tax,
            finalAmount: final,
        });
        if (tableId) {
            await this.tableRepo.update(tableId, {
                status: 'OCCUPIED',
                currentOrderId: order.id
            });
        }
        return this.findOne(order.id);
    }
    async completePayment(id, data) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order)
            throw new Error('Order not found');
        await this.orderRepo.update(id, {
            status: 'COMPLETED',
            paymentMethod: data.paymentMethod || 'CASH'
        });
        if (order.tableId) {
            await this.tableRepo.update(order.tableId, {
                status: 'EMPTY',
                currentOrderId: null
            });
        }
        return this.findOne(id);
    }
    async findAllByRestaurant(restaurantId, startDate, endDate) {
        const where = { restaurantId };
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : new Date('2000-01-01');
            const end = endDate ? new Date(endDate) : new Date();
            if (endDate) {
                end.setHours(23, 59, 59, 999);
            }
            where.createdAt = (0, typeorm_2.Between)(start, end);
        }
        return this.orderRepo.find({
            where,
            relations: ['items', 'items.menuItem', 'table'],
            order: { createdAt: 'DESC' }
        });
    }
    async findAll() {
        return this.orderRepo.find({
            relations: ['items', 'items.menuItem', 'table'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        return this.orderRepo.findOne({
            where: { id },
            relations: ['items', 'items.menuItem', 'table', 'restaurant']
        });
    }
    async updateStatus(id, status) {
        await this.orderRepo.update(id, { status });
        return this.findOne(id);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __param(3, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map