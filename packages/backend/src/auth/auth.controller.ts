import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;
}

class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "Créer un compte" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter et obtenir un token JWT' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
