import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import bcrypt from 'bcrypt';

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

  async requestOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (!user) {
      await this.prisma.user.create({
        data: { email, password: '', otp, expiresAt, verified: false },
      });
    } else if (user.verified) {
      return { message: 'Already verified, proceed to login.' };
    } else {
      await this.prisma.user.update({
        where: { email },
        data: { otp, expiresAt },
      });
    }

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP Code',
      template: './verify',
      context: { otp },
    });

    return { message: 'OTP sent to your email.', otp };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'User not found' };
    if (user.verified)
      return { message: 'Already verified, proceed to login.' };
    if (user.otp !== otp) {
      return { message: 'Invalid OTP or OTP expired' };
    }

    await this.prisma.user.update({
      where: { email },
      data: { verified: true, otp: '' },
    });
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { message: 'OTP verified, please set your password.', token };
  }

  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return { message: 'User not found' };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { otp, expiresAt },
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'OTP for email verification',
      template: './verify',
      context: {
        otp,
      },
    });

    return { message: 'OTP resent to your email' };
  }
  async setPassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.verified)
      return { message: 'User not found or not verified' };
    if (user.password)
      return { message: 'Password already set, proceed to login.' };
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    return { message: 'Password set, you can now login.' };
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.verified) {
      throw new UnauthorizedException('Email not verified');
    }

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
