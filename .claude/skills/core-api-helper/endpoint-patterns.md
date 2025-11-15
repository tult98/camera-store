# REST API Endpoint Patterns

## Complete CRUD Implementation

### 1. Define DTOs

**Request DTO with Validation:**

```typescript
// dto/create-brand.dto.ts
import { IsString, IsUrl, IsOptional, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsUrl()
  @IsOptional()
  logo_url?: string;
}
```

**Update DTO:**

```typescript
// dto/update-brand.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
```

**Response DTO:**

```typescript
// dto/brand-response.dto.ts
export class BrandResponseDto {
  id: string;
  name: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}
```

### 2. Implement Controller

```typescript
// brand.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async findAll(): Promise<BrandResponseDto[]> {
    return this.brandService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BrandResponseDto> {
    return this.brandService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    return this.brandService.create(createBrandDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto): Promise<BrandResponseDto> {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.brandService.remove(id);
  }
}
```

### 3. Implement Service

```typescript
// brand.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';

@Injectable()
export class BrandService {
  async findAll(): Promise<BrandResponseDto[]> {
    // Implementation: query database or call external API
    return [];
  }

  async findOne(id: string): Promise<BrandResponseDto> {
    const brand = await this.findBrandById(id);

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async create(createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    // Implementation: save to database
    return {} as BrandResponseDto;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<BrandResponseDto> {
    const brand = await this.findOne(id); // Throws if not found

    // Update logic
    return {} as BrandResponseDto;
  }

  async remove(id: string): Promise<void> {
    const brand = await this.findOne(id); // Throws if not found

    // Delete logic
  }

  private async findBrandById(id: string) {
    // Database query implementation
    return null;
  }
}
```

## Query Parameters

### Pagination

```typescript
// dto/pagination.dto.ts
import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

Controller usage:

```typescript
@Get()
async findAll(@Query() paginationDto: PaginationDto): Promise<BrandResponseDto[]> {
  return this.brandService.findAll(paginationDto);
}
```

### Filtering

```typescript
// dto/brand-filter.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class BrandFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
```

Controller usage:

```typescript
@Get()
async findAll(@Query() filterDto: BrandFilterDto): Promise<BrandResponseDto[]> {
  return this.brandService.findAll(filterDto);
}
```

## Error Handling

### Standard HTTP Exceptions

```typescript
import { BadRequestException, NotFoundException, ConflictException, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';

// 400 Bad Request
throw new BadRequestException('Invalid input data');

// 404 Not Found
throw new NotFoundException(`Brand with ID ${id} not found`);

// 409 Conflict
throw new ConflictException(`Brand '${name}' already exists`);

// 401 Unauthorized
throw new UnauthorizedException('Authentication required');

// 403 Forbidden
throw new ForbiddenException('Insufficient permissions');

// 500 Internal Server Error
throw new InternalServerErrorException('Something went wrong');
```

### Custom Exceptions

```typescript
// exceptions/brand-already-exists.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BrandAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Brand '${name}' already exists`,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT
    );
  }
}
```

Usage in service:

```typescript
async create(createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
  const existing = await this.findByName(createBrandDto.name);

  if (existing) {
    throw new BrandAlreadyExistsException(createBrandDto.name);
  }

  // Create brand
}
```

## Validation Patterns

### Common Validators

```typescript
import { IsString, IsNumber, IsBoolean, IsEmail, IsUrl, IsUUID, IsEnum, IsDate, IsArray, IsOptional, IsNotEmpty, MinLength, MaxLength, Min, Max, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExampleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsNumber()
  @Min(0)
  @Max(1000)
  price: number;

  @IsBoolean()
  is_active: boolean;

  @IsEnum(['draft', 'published', 'archived'])
  status: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @Matches(/^[A-Z]{2}\d{6}$/)
  product_code: string;
}
```

### Custom Validators

```typescript
// validators/is-brand-name.validator.ts
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBrandNameConstraint implements ValidatorConstraintInterface {
  validate(brandName: string) {
    return /^[a-zA-Z0-9\s-]+$/.test(brandName);
  }

  defaultMessage() {
    return 'Brand name can only contain letters, numbers, spaces, and hyphens';
  }
}

export function IsBrandName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBrandNameConstraint,
    });
  };
}
```

Usage:

```typescript
export class CreateBrandDto {
  @IsBrandName()
  name: string;
}
```

## Response Transformation

### Serialization

```typescript
import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  @Transform(({ value }) => value?.toUpperCase())
  name: string;

  @Expose()
  created_at: Date;
}
```

Controller usage:

```typescript
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Get(':id')
async findOne(@Param('id') id: string): Promise<UserResponseDto> {
  return this.userService.findOne(id);
}
```

## File Upload

```typescript
import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('brands')
export class BrandController {
  @Post('upload-logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const url = await this.brandService.uploadLogo(file);
    return { url };
  }
}
```

## Async Operations with Jobs

For long-running operations, return job ID immediately:

```typescript
@Post('crawl')
@HttpCode(HttpStatus.ACCEPTED)
async crawlProduct(@Body() crawlDto: CrawlProductDto): Promise<{ job_id: string }> {
  const jobId = await this.productService.queueCrawl(crawlDto.url);
  return { job_id: jobId };
}

@Get('jobs/:jobId')
async getJobStatus(@Param('jobId') jobId: string): Promise<JobStatusDto> {
  return this.productService.getJobStatus(jobId);
}
```
