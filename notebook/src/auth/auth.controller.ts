import {
  Body,
  Controller,
  Post,
  UsePipes,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinSchema, type SigninDto } from './dto/signin.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@/auth/guard/auth.guard';

import { SetPasswordDto } from './dto/set-password.dto';
import type { RequestOtpDto } from './dto/request-otp.dto';
import type { VerifyOtpDto } from './dto/verify-otp.dto';
import { RequestOtpSchema } from './dto/request-otp.dto';
import { VerifyOtpSchema } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(signinSchema))
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('send-otp')
  @UsePipes(new ZodValidationPipe(RequestOtpSchema))
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.email);
  }

  @Post('verify-otp')
  @UsePipes(new ZodValidationPipe(VerifyOtpSchema))
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getCurrentUser(
    @CurrentUser() user: Omit<User, 'password' | 'otp' | 'expiresAt'>,
  ) {
    return user;
  }
}
