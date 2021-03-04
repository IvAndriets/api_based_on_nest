import { Controller, Body, Get, Post, Patch, Delete, Param, Query } from '@nestjs/common';
import { CreateProductDto } from './dto';
import { ProductsService } from './products.service';
import { ProductModel } from './model';
import { queryParser, removeFalsyValues } from '../utils';
import { QueryParam } from '../interfaces';
import { FindAndCountOptions } from 'sequelize/types';

@Controller('products')
export class ProductsController {

  public constructor(
    private readonly productsService: ProductsService,
  ) {
  }

  @Get()
  public async getProducts(@Query() queryParam: QueryParam): Promise<{ rows: ProductModel[]; count: number }> {
    const { offset, limit, sort_field, sort, q } = queryParam;

    const search = q ? queryParser(JSON.parse(q)) : null;

    const query: FindAndCountOptions = {
      limit: +limit || 5,
      offset: +offset || 0,
      order: sort_field ? [[sort_field, ['asc', 'desc'].includes(sort.toLowerCase()) ? sort : 'ASC']] : null,
      where: search,
    };

    return this.productsService.findAll(removeFalsyValues(query));
  }

  @Get(':id')
  public getProduct(@Param('id') id: string): Promise<ProductModel> {
    return this.productsService.findOne(id);
  }

  @Post()
  public addProduct(@Body() createProductDto: CreateProductDto): Promise<ProductModel> {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  public changeProduct(@Param('id') id: string, @Body() createProductDto: CreateProductDto): Promise<ProductModel> {
    return this.productsService.update(id, createProductDto);
  }

  @Delete(':id')
  public deleteProduct(@Param('id') id: string): Promise<{ message: string }> {

    return this.productsService.delete(id);
  }
}
