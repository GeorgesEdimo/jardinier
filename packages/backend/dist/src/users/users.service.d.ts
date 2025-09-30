import { PrismaService } from '../prisma/prisma.service';
interface CreateUserInput {
    email: string;
    password: string;
    name?: string;
}
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(data: CreateUserInput): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        email: string;
        password: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByEmail(email: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        email: string;
        password: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: number): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        email: string;
        password: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
export {};
