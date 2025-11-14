# Core API Endpoint Patterns

## REST API Design

### Standard CRUD Endpoints

```
GET    /resources           # List all
GET    /resources/:id       # Get one
POST   /resources           # Create
PUT    /resources/:id       # Update (full)
PATCH  /resources/:id       # Update (partial)
DELETE /resources/:id       # Delete
```

### Example: Brand Management Endpoints

```typescript
// modules/brand/brand.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { ListBrandsQueryDto } from './dto/list-brands-query.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async findAll(
    @Query() query: ListBrandsQueryDto,
  ): Promise<BrandResponseDto[]> {
    return this.brandService.findAll(query);
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
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.brandService.remove(id);
  }
}
```

## DTO Patterns

### Request DTO (Create)

```typescript
// dto/create-brand.dto.ts
import {
  IsString,
  IsUrl,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
```

### Request DTO (Update)

```typescript
// dto/update-brand.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
// All fields from CreateBrandDto become optional
```

### Query DTO (List with Filters)

```typescript
// dto/list-brands-query.dto.ts
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListBrandsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort_by?: string;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}
```

### Response DTO

```typescript
// dto/brand-response.dto.ts
export class BrandResponseDto {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
```

### Nested DTOs

```typescript
// dto/create-product.dto.ts
import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsArray } from 'class-validator';

class ProductVariantDto {
  @IsString()
  sku: string;

  @IsNumber()
  price: number;

  @IsNumber()
  inventory_quantity: number;
}

export class CreateProductDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];
}
```

## Validation Decorators

### Common Validators

```typescript
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEmail,
  IsUrl,
  IsUUID,
  IsDate,
  IsEnum,
  IsArray,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  Matches,
  ValidateNested,
} from 'class-validator';

export class ExampleDto {
  // String validators
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  // Email
  @IsEmail()
  email: string;

  // URL
  @IsUrl()
  website: string;

  // Number validators
  @IsNumber()
  @Min(0)
  @Max(1000)
  price: number;

  // Boolean
  @IsBoolean()
  is_active: boolean;

  // Enum
  @IsEnum(['active', 'inactive', 'pending'])
  status: string;

  // UUID
  @IsUUID('4')
  id: string;

  // Date
  @IsDate()
  @Type(() => Date)
  created_at: Date;

  // Optional field
  @IsOptional()
  @IsString()
  description?: string;

  // Array
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  // Regex pattern
  @Matches(/^[A-Z0-9]+$/)
  code: string;

  // Nested object
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

### Custom Validators

```typescript
// validators/is-positive-price.validator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPositivePrice(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPositivePrice',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'number' && value > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a positive number`;
        },
      },
    });
  };
}

// Usage
export class CreateProductDto {
  @IsPositivePrice()
  price: number;
}
```

## Service Patterns

### Basic Service

```typescript
// brand.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';

@Injectable()
export class BrandService {
  private brands: BrandResponseDto[] = [];

  async findAll(): Promise<BrandResponseDto[]> {
    return this.brands;
  }

  async findOne(id: string): Promise<BrandResponseDto> {
    const brand = this.brands.find((b) => b.id === id);

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async create(createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    const brand: BrandResponseDto = {
      id: `brand_${Date.now()}`,
      ...createBrandDto,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.brands.push(brand);
    return brand;
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    const brand = await this.findOne(id);

    Object.assign(brand, updateBrandDto);
    brand.updated_at = new Date();

    return brand;
  }

  async remove(id: string): Promise<void> {
    const index = this.brands.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    this.brands.splice(index, 1);
  }
}
```

### Service with External API Integration

```typescript
// brand.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { ProductApiService } from '../../services/product-api.service';

@Injectable()
export class BrandService {
  async create(createBrandDto: CreateBrandDto) {
    // Call MedusaJS backend
    const result = await ProductApiService.createBrand({
      name: createBrandDto.name,
      logo_url: createBrandDto.logo_url,
    });

    return result;
  }

  async findAll() {
    return ProductApiService.getBrands();
  }
}
```

## Error Handling

### Built-in HTTP Exceptions

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

// 404 Not Found
throw new NotFoundException('Brand not found');

// 400 Bad Request
throw new BadRequestException('Invalid data');

// 401 Unauthorized
throw new UnauthorizedException('Invalid credentials');

// 403 Forbidden
throw new ForbiddenException('Access denied');

// 409 Conflict
throw new ConflictException('Brand already exists');

// 500 Internal Server Error
throw new InternalServerErrorException('Something went wrong');
```

### Custom Exception

```typescript
// exceptions/brand-exists.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BrandAlreadyExistsException extends HttpException {
  constructor(brandName: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Brand '${brandName}' already exists`,
        error: 'BrandAlreadyExists',
      },
      HttpStatus.CONFLICT,
    );
  }
}

// Usage
throw new BrandAlreadyExistsException(createBrandDto.name);
```

### Try-Catch Pattern

```typescript
async create(createBrandDto: CreateBrandDto) {
  try {
    const result = await ProductApiService.createBrand(createBrandDto);
    return result;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new ConflictException('Brand already exists');
    }
    throw new InternalServerErrorException('Failed to create brand');
  }
}
```

## Response Formatting

### Success Response

```typescript
// Standard response
{
  "id": "brand_123",
  "name": "Canon",
  "logo_url": "https://example.com/logo.png",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}

// List response
[
  { "id": "1", "name": "Canon" },
  { "id": "2", "name": "Nikon" }
]

// Paginated response
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```

### Error Response

```typescript
// Validation error (400)
{
  "statusCode": 400,
  "message": [
    "name must be longer than or equal to 2 characters",
    "email must be an email"
  ],
  "error": "Bad Request"
}

// Not found error (404)
{
  "statusCode": 404,
  "message": "Brand with ID 123 not found",
  "error": "Not Found"
}

// Custom error (409)
{
  "statusCode": 409,
  "message": "Brand 'Canon' already exists",
  "error": "BrandAlreadyExists"
}
```

## Advanced Patterns

### Request/Response Interceptors

```typescript
// interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
      })),
    );
  }
}

// Usage in controller
@UseInterceptors(TransformInterceptor)
@Get()
async findAll() {
  return this.brandService.findAll();
}

// Response will be:
{
  "statusCode": 200,
  "data": [...]
}
```

### Async Job Endpoint Pattern

For long-running operations:

```typescript
// Controller returns job ID immediately
@Post('crawl')
@HttpCode(HttpStatus.ACCEPTED)
async crawlProduct(@Body() dto: CrawlProductDto) {
  const jobId = await this.productQueueService.addCrawlJob(dto.url);
  return { jobId };
}

// Client polls for status
@Get('jobs/:jobId')
async getJobStatus(@Param('jobId') jobId: string) {
  return this.productQueueService.getJobStatus(jobId);
}
```

### Pagination Helper

```typescript
// utils/pagination.util.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function paginate<T>(
  items: T[],
  { page, limit }: PaginationParams,
): PaginatedResponse<T> {
  const total = items.length;
  const pages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);

  return {
    data,
    total,
    page,
    limit,
    pages,
  };
}

// Usage in service
async findAll(query: ListBrandsQueryDto) {
  const brands = await this.getAllBrands();
  return paginate(brands, {
    page: query.page || 1,
    limit: query.limit || 20,
  });
}
```

## API Contract Documentation

### Providing Contracts to Frontend

When @admin-dashboard-expert asks about endpoints, provide:

**1. Endpoint Specification:**
```
Method: POST
Path: /brands
```

**2. Request DTO with Validation:**
```typescript
export class CreateBrandDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;  // Required, 2-100 chars

  @IsUrl()
  @IsOptional()
  logo_url?: string;  // Optional, must be valid URL
}
```

**3. Response Format:**
```typescript
{
  id: string;
  name: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}
```

**4. Error Responses:**
```
400 Bad Request - Validation failed
404 Not Found - Brand not found
409 Conflict - Brand already exists
500 Internal Server Error - Server error
```

**5. File Locations:**
```
DTO: apps/core-api/src/modules/brand/dto/create-brand.dto.ts
Controller: apps/core-api/src/modules/brand/brand.controller.ts
Service: apps/core-api/src/modules/brand/brand.service.ts
```

## Testing Endpoints

### Manual Testing

```bash
# GET all brands
curl http://localhost:3001/brands

# GET one brand
curl http://localhost:3001/brands/123

# POST create brand
curl -X POST http://localhost:3001/brands \
  -H "Content-Type: application/json" \
  -d '{"name":"Canon","logo_url":"https://example.com/logo.png"}'

# PUT update brand
curl -X PUT http://localhost:3001/brands/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Canon Inc."}'

# DELETE brand
curl -X DELETE http://localhost:3001/brands/123
```

### Unit Tests

```typescript
// brand.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

describe('BrandController', () => {
  let controller: BrandController;
  let service: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        {
          provide: BrandService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BrandController>(BrandController);
    service = module.get<BrandService>(BrandService);
  });

  describe('findAll', () => {
    it('should return an array of brands', async () => {
      const result = [{ id: '1', name: 'Canon' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll({})).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a brand', async () => {
      const dto = { name: 'Canon', logo_url: 'https://example.com/logo.png' };
      const result = { id: '1', ...dto, created_at: new Date(), updated_at: new Date() };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
    });
  });
});
```

### E2E Tests

```typescript
// brand.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BrandController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/brands (GET)', () => {
    return request(app.getHttpServer())
      .get('/brands')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/brands (POST)', () => {
    return request(app.getHttpServer())
      .post('/brands')
      .send({ name: 'Canon', logo_url: 'https://example.com/logo.png' })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('Canon');
      });
  });

  it('/brands (POST) - validation error', () => {
    return request(app.getHttpServer())
      .post('/brands')
      .send({ name: 'C' })  // Too short
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Best Practices

### ✅ Do's

- Use DTOs for all requests and responses
- Add validation decorators to all DTOs
- Use proper HTTP status codes
- Throw appropriate exceptions
- Return consistent response formats
- Document endpoints clearly
- Write tests for all endpoints

### ❌ Don'ts

- Don't skip validation
- Don't return raw errors to clients
- Don't use `any` types
- Don't put business logic in controllers
- Don't forget error handling
- Don't skip tests

## Summary

- **Controllers** handle HTTP requests and responses
- **DTOs** define request/response structure with validation
- **Services** contain business logic
- **Exceptions** provide consistent error handling
- **Validation** happens automatically via global pipe
- **Testing** ensures reliability
- **Documentation** keeps frontend in sync
