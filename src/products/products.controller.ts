import { Controller, Body, Get, Post, Patch, Delete, Param, Query } from '@nestjs/common';
import { CreateProductDto } from './dto';
import { ProductsService } from './products.service';
import { ProductEntity } from './entity';
import { SearchParams } from '../interfaces';

@Controller('products')
export class productsController {

  public constructor(
    private readonly productsService: ProductsService,
  ) {
  }

  @Get()
  public getProducts(@Query() query: SearchParams): Promise<{ products: ProductEntity[], count: number }> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  public getProduct(@Param('id') id: string): Promise<ProductEntity> {
    return this.productsService.findOne(id);
  }

  @Post()
  public addProduct(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  public changeProduct(@Param('id') id: string, @Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productsService.update(id, createProductDto);
  }

  @Delete(':id')
  public deleteProduct(@Param('id') id: string): Promise<{ message: string }> {

    return this.productsService.delete(id);
  }
}
