import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({ email, password: hashed, name });
    return this.signUser(user.id, user.email, user.name ?? undefined);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.signUser(user.id, user.email, user.name ?? undefined);
  }

  signUser(userId: number, email: string, name?: string) {
    const payload = { sub: userId, email, name };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
