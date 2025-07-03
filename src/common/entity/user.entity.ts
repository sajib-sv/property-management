export class UserEntity {
  id: string;
  name: string;
  email: string;
  image: string;
  language: string;
  accountType: string;
  isEmailVerified: boolean;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
