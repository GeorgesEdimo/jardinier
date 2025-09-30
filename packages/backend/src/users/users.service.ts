import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(data: CreateUserInput) {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
