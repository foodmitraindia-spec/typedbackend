import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(restaurantId?: string): Promise<User[]>;
    create(data: any): Promise<User[]>;
    updatePassword(id: string, newPassword: string): Promise<User | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
