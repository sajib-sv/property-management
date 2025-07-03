import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@project/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as bcrypt from 'bcrypt';
import { AppError } from '@project/common/error/handle-errors.app';
import { JWTPayload } from '@project/common/jwt/jwt.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ENVEnum } from '@project/common/enum/env.enum';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { UserEntity } from '@project/common/entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { SellerEntity } from '@project/common/entity/seller.entity';
import { fileDestination } from '@project/common/utils/multer-config.util';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<
    TResponse<{
      user: UserEntity;
      tokens: { accessToken: string; refreshToken: string };
    }>
  > {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new AppError('User not found', 404);
    const isPasswordValid = await this.comparePasswords(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

    const tokens = this.generateJwtTokens({
      sub: user.id,
      email: user.email,
      role: user.accountType,
    });

    const plainUser = plainToInstance(UserEntity, user);

    return successResponse(
      {
        user: plainUser,
        tokens,
      },
      'User logged in successfully',
    );
  }

  @HandleErrors('Failed to register user')
  async userRegister(
    dto: RegisterUserDto,
    image: Express.Multer.File | null = null,
  ): Promise<TResponse<UserEntity>> {
    if (!image) {
      throw new AppError('Image file is required', 400);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const otpAndExpiry = this.generateOtpAndExpiry();
    const hashedOtp = this.hashOtp(otpAndExpiry.otp);

    // * TODO: upload image to cloud storage

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        image: image.filename,
        language: dto.language,
        accountType: dto.accountType,
        isEmailVerified: false,
        otpCode: hashedOtp,
        otpExpireTime: otpAndExpiry.expiryTime,
      },
    });

    // * TODO: Send OTP to user's email

    return successResponse(
      plainToInstance(UserEntity, user),
      'User registered successfully. Please verify your email with the OTP sent to your email address.',
    );
  }

  @HandleErrors('Failed to register user')
  async sellerRegister(
    dto: RegisterSellerDto,
    image: Express.Multer.File,
  ): Promise<
    TResponse<{
      user: UserEntity;
      seller: SellerEntity;
    }>
  > {
    if (!image) {
      throw new AppError('Image file is required', 400);
    }

    // Create user first
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const otpAndExpiry = this.generateOtpAndExpiry();
    const hashedOtp = this.hashOtp(otpAndExpiry.otp);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        image: 'test',
        language: dto.language,
        accountType: dto.accountType,
        isEmailVerified: false,
        otpCode: hashedOtp,
        otpExpireTime: otpAndExpiry.expiryTime,
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

    // * TODO: Send OTP to user's email

    return successResponse(
      {
        user: plainToInstance(UserEntity, user),
        seller: plainToInstance(SellerEntity, seller),
      },
      'User registered successfully. Please verify your email with the OTP sent to your email address.',
    );
  }

  async verify(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new AppError('User not found', 404);

    if (!user.otpCode) {
      throw new AppError('OTP code not found for this user', 404);
    }

    if (!this.compareOtp(dto.otpCode, user.otpCode)) {
      throw new AppError('Invalid OTP code', 400);
    }

    if (user.otpExpireTime < new Date()) {
      throw new AppError('OTP code has expired', 400);
    }

    const verifiedUser = await this.prisma.user.update({
      where: { email: dto.email },
      data: { isEmailVerified: true },
    });

    return successResponse(
      plainToInstance(UserEntity, verifiedUser),
      'Email verified successfully',
    );
  }

  async updateProfileImage(filename: string) {
    // * TODO: Replace with Prisma or DB update logic
    return {
      message: `Updated profile image for user `,
      imageUrl: fileDestination + '/' + filename,
    };
  }

  private generateOtpAndExpiry(): { otp: number; expiryTime: Date } {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);
    return { otp, expiryTime };
  }

  private hashOtp(otp: number): string {
    return bcrypt.hashSync(otp.toString(), 10);
  }

  private compareOtp(inputOtp: number, storedOtp: string): boolean {
    return bcrypt.compareSync(inputOtp.toString(), storedOtp.toString());
  }

  private comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private generateJwtTokens(payload: JWTPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENVEnum.JWT_ACCESS_TOKEN_SECRET),
      expiresIn: this.configService.get<string>(
        ENVEnum.JWT_ACCESS_TOKEN_EXPIRES_IN,
      ),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENVEnum.JWT_REFRESH_TOKEN_SECRET),
      expiresIn: this.configService.get<string>(
        ENVEnum.JWT_REFRESH_TOKEN_EXPIRES_IN,
      ),
    });
    return { accessToken, refreshToken };
  }
}
