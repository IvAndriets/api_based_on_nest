import { Controller, Body, Get, Post, Patch, Delete, Param, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { QueryParam } from '../interfaces';
import { queryParser, removeFalsyValues } from '../utils';
import { FindAndCountOptions } from 'sequelize';
import { CategoryModel } from './model';
import { CreateProductDto } from '../products/dto';


@Controller('categories')
export class CategoryController {
  public constructor(
    private readonly categoryService: CategoryService
  ) {
  }

  @Get()
  public async getCategory(@Query() queryParam: QueryParam): Promise<{ rows: CategoryModel[]; count: number }> {
    const { offset, limit, sort_field, sort, q } = queryParam;

    const search = q ? queryParser(JSON.parse(q)) : null;

    const query: FindAndCountOptions = {
      limit: +limit || 5,
      offset: +offset || 0,
      order: sort_field ? [[sort_field, ['asc', 'desc'].includes(sort.toLowerCase()) ? sort : 'ASC']] : null,
      where: search,
    };

    return this.categoryService.findAll(removeFalsyValues(query));
  }

  @Get(':id')
  public getOneCategory(@Param('id') id: string): Promise<CategoryModel> {
    return this.categoryService.findOne(id);
  }

  @Post()
  public addCategory(@Body() CreateCategoryDto: CreateProductDto): Promise<CategoryModel> {
    return this.categoryService.create(CreateCategoryDto);
  }

  @Patch(':id')
  public changeCategory(@Param('id') id: string, @Body() CreateCategoryDto: CreateProductDto): Promise<CategoryModel> {
    return this.categoryService.update(id, CreateCategoryDto);
  }

  @Delete(':id')
  public deleteCategory(@Param('id') id: string): Promise<{ message: string }> {

    return this.categoryService.delete(id);
  }
}
