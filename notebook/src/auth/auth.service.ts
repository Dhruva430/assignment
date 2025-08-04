import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        otp,
        expiresAt,
        verified: false,
      },
    });

    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Verify your email',
      template: './verify',
      context: {
        name: dto.name || 'User',
        otp,
      },
    });

    return { message: 'OTP sent to your email for verification' };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('User not found');

    if (user.verified) throw new BadRequestException('Already verified');

    if (user.otp !== otp || user.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        verified: true,
        otp: '',
        expiresAt: '',
      },
    });

    return { message: 'Email verified successfully' };
  }

  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { otp, expiresAt },
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Resend OTP for email verification',
      template: './verify',
      context: {
        name: user.name || 'User',
        otp,
      },
    });

    return { message: 'OTP resent to your email' };
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }
    // if (!user.verified) {
    //   throw new UnauthorizedException('Email not verified');
    // }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid Password');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return {
      token,
    };
  }
}
