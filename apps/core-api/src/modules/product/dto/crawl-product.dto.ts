import { IsUrl, IsNotEmpty } from 'class-validator';

export class CrawlProductDto {
  @IsNotEmpty()
  @IsUrl()
  url!: string;
}
