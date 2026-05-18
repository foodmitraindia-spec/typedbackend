import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto): Promise<import("./entities/order.entity").Order | null>;
    findAll(restaurantId: string, startDate?: string, endDate?: string): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("./entities/order.entity").Order | null>;
    updateStatus(id: string, status: any): Promise<import("./entities/order.entity").Order | null>;
    completePayment(id: string, data: any): Promise<import("./entities/order.entity").Order | null>;
}
