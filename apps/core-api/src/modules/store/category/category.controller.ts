import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';
import { createPaginatedResponse } from '../../../common/utils/pagination.util.js';
import { createResourceResponse } from '../../../common/utils/response.util.js';

@Controller('store/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('featured')
  async findFeatured(@Query() pagination: PaginationQueryDto) {
    const { offset = 0, limit = 10 } = pagination;

    const { data, count } = await this.categoryService.findFeaturedCategories({
      offset,
      limit,
    });

    return createPaginatedResponse('categories', data, count, offset, limit);
  }

  @Get('tree')
  async findTree() {
    const categories = await this.categoryService.findCategoryTree();
    return createResourceResponse('categories', categories);
  }
}
