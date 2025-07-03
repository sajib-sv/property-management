import { PartialType } from '@nestjs/swagger';
import { RegisterSellerDto } from '@project/auth/dto/register-seller.dto';

export class UpdateProfileDto extends PartialType(RegisterSellerDto) {}
