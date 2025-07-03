import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@project/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    return { message: 'User logged in successfully', data: user };
  }

  async userRegister(dto: RegisterUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        image: dto.image,
        language: dto.language,
        accountType: dto.accountType,
        isEmailVerified: false,
        otpCode: this.generateOtp(),
        otpExpireTime: this.generateOtpExpiry(),
      },
    });

    return { message: 'User registered successfully', data: user };
  }

  async sellerRegister(dto: RegisterSellerDto) {
    // Create user first
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        image: dto.image,
        language: dto.language,
        accountType: dto.accountType,
        isEmailVerified: false,
        otpCode: this.generateOtp(),
        otpExpireTime: this.generateOtpExpiry(),
      },
    });

    const seller = await this.prisma.seller.create({
      data: {
        userId: user.id,
        verificationStatus: 'PENDING',
        companyName: dto.companyName,
        subscriptionType: dto.subscriptionType ?? 'FREE',
        companyWebsite: dto.companyWebsite,
        phone: dto.phone,
        address: dto.address,
        country: dto.country,
        state: dto.state,
        city: dto.city,
        zip: dto.zip,
        document: dto.document,
      },
    });

    return {
      message: 'Seller registered successfully',
      data: { user, seller },
    };
  }

  async verify(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.otpCode !== dto.otpCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    if (user.otpExpireTime < new Date()) {
      throw new BadRequestException('OTP code has expired');
    }

    const verifiedUser = await this.prisma.user.update({
      where: { email: dto.email },
      data: { isEmailVerified: true },
    });

    return { message: 'Email verified successfully', data: verifiedUser };
  }

  private generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit code
  }

  private generateOtpExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    return expiry;
  }
}
