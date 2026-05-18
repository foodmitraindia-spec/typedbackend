import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(restaurantId?: string): Promise<import("./entities/user.entity").User[]>;
    create(createUserDto: any): Promise<import("./entities/user.entity").User[]>;
    updatePassword(id: string, data: {
        password: string;
    }): Promise<import("./entities/user.entity").User | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
