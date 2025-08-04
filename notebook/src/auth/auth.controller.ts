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
import { signupSchema, type SignupDto } from './dto/signup.dto';
import { signinSchema, type SigninDto } from './dto/signin.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import type { ResendOtpDto } from './dto/request-otp.dto';
import type { VerifyOtpDto } from './dto/verify-otp.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@/auth/guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(signupSchema))
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UsePipes(new ZodValidationPipe(signinSchema))
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('resend-otp')
  requestOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.email);
  }

  @Post('verify-otp')
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
