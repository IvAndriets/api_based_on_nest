import { Controller, Body, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { CreateProductDto } from './dto';
import { ProductsService } from './products.service';
import { ProductEntity } from './entity';

@Controller('products')
export class ProductsController {

  public constructor(
    private readonly productsService: ProductsService,
  ) {
  }

  @Get()
  public getProducts(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
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
