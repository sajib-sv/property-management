import { IsString } from 'class-validator';

export class SavePropertyDto {
  @IsString()
  propertyId: string;
}
