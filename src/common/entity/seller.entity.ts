import { UserEntity } from './user.entity';

export class SellerEntity {
  id: string;
  verificationStatus: string;
  companyName: string;
  subscriptionType?: string;
  companyWebsite: string;
  phone: number;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  document: string;

  // Optional nested user
  user?: UserEntity;

  constructor(partial: Partial<SellerEntity>) {
    Object.assign(this, partial);
  }
}
