declare class CreateOrderItemDto {
    menuItemId: string;
    quantity: number;
    price: number;
    notes?: string;
}
export declare class CreateOrderDto {
    tableId?: string;
    restaurantId: string;
    totalAmount?: number;
    discountAmount?: number;
    taxAmount?: number;
    finalAmount?: number;
    items: CreateOrderItemDto[];
}
export {};
