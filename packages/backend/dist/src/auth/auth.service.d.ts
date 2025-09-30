import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(email: string, password: string, name?: string): Promise<{
        access_token: string;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
    signUser(userId: number, email: string, name?: string): {
        access_token: string;
    };
}
