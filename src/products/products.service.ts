import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto';
import { ProductEntity } from './entity';

@Injectable()
export class ProductsService {

  public constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
  ) {
  }

  public async findAll(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  public async findOne(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Can not find product by id: ${id}`);
    }
  }

  public async filerProducts(filer: string): Promise<any> {
    const filterParams = JSON.parse(filer);
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (filterParams.name) {
      queryBuilder.andWhere(`product.name Like '${filterParams.name}' `);
    }

    if (filterParams.description) {
      queryBuilder.andWhere(`product.name Like '${filterParams.description}' `);
    }

    if (filterParams.price) {
      queryBuilder.andWhere(`product.name Like '${filterParams.price}' `);
    }

    const [product, count] = await queryBuilder.getManyAndCount();
    return [...product, count];
  }

  public async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = new ProductEntity();
      product.name = createProductDto.name;
      product.description = createProductDto.description;
      product.price = createProductDto.price;

      return await this.productRepository.save(product);
    } catch (error) {
      throw new HttpException(error, 500);
    }

  }

  public async update(id: string, createProductDto: CreateProductDto): Promise<ProductEntity> {
    try{
      const product = await this.productRepository.findOne(id);

      if (createProductDto.name) {
        product.name = createProductDto.name;
      }
      if (createProductDto.description) {
        product.description = createProductDto.description;
      }
      if (createProductDto.price) {
        product.price = createProductDto.price;
      }

      return this.productRepository.save(product);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  public async delete(id: string): Promise<{ message: string }> {

    try {
      // Начать траназакцию
      const product = await this.productRepository.findOne(id);

      if (product) {
        throw new NotFoundException('Cannot find product for deleting');
      }

      await this.productRepository.delete(id);

      // Закомитить траназакцию
      return { message: 'Deleted successfully' };
    } catch (error) {
      // Роллбэк траназакции
      console.error(error);
      throw error instanceof NotFoundException ? error : new HttpException(error, 500);
    }

  }

}
