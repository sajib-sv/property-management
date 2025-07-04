import { Expose, Type } from 'class-transformer';

export class NewsEntity {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  thumbnail: string;

  @Expose()
  location: string;

  @Expose()
  content: JSON;

  @Expose()
  @Type(() => Date)
  firstPublishedAt: Date;

  @Expose()
  isPublished: boolean;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}
