import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(createAuthDto: any) {
    // Logic for user login
    return { message: 'User logged in successfully', data: createAuthDto };
  }

  userRegister() {
    // Logic for user registration
    return { message: 'User registered successfully' };
  }
  sellerRegister(createAuthDto: any) {
    // Logic for seller registration
    return { message: 'Seller registered successfully', data: createAuthDto };
  }

  verify(createAuthDto: any) {
    // Logic for verification
    return { message: 'Verification successful', data: createAuthDto };
  }
}
