import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateProductDto } from './dto';
import { ProductEntity } from './entity';
import { SearchParams } from '../interfaces';

@Injectable()
export class ProductsService {

  public constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    private connection: Connection,
  ) {
  }

  public async findAll(query: SearchParams): Promise<{ products: ProductEntity[], count: number }> {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('product').limit(+(query.limit || '5')).offset(+(query.offset || '0'));

      if (query.name) {
        console.log(1);
        queryBuilder.andWhere(`product.name Like'${query.name}' `);
      }

      if (query.description) {
        console.log(2);

        queryBuilder.andWhere(`product.name Like '${query.description}' `);
      }

      if (query.price) {
        console.log(3);

        queryBuilder.andWhere(`product.name Like '${query.price}' `);
      }

      const [product, count] = await queryBuilder.getManyAndCount();
      return { products: [...product], count: count };
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

  // public async filerProducts(filer: string): Promise<any> {
  //   const filterParams = JSON.parse(filer);
  //   const queryBuilder = this.productRepository.createQueryBuilder('product');
  //
  //   if (filterParams.name) {
  //     queryBuilder.andWhere(`product.name Like '${filterParams.name}' `);
  //   }
  //
  //   if (filterParams.description) {
  //     queryBuilder.andWhere(`product.name Like '${filterParams.description}' `);
  //   }
  //
  //   if (filterParams.price) {
  //     queryBuilder.andWhere(`product.name Like '${filterParams.price}' `);
  //   }
  //
  //   const [product, count] = await queryBuilder.getManyAndCount();
  //   return [...product, count];
  // }

  public async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = new ProductEntity();
      product.name = createProductDto.name;
      product.description = createProductDto.description;
      product.price = createProductDto.price;

      const savedProduct = await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }

  }

  public async update(id: string, createProductDto: CreateProductDto): Promise<ProductEntity> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      const savedProduct = await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  public async delete(id: string): Promise<{ message: string }> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Начать траназакцию
      const product = await queryRunner.manager.findOne(id);

      if (product) {
        throw new NotFoundException('Cannot find product for deleting');
      }

      await queryRunner.manager.delete(ProductEntity, id);

      // Закомитить траназакцию
      return { message: 'Deleted successfully' };
    } catch (error) {
      // Роллбэк траназакции
      await queryRunner.rollbackTransaction();
      throw error instanceof NotFoundException ? error : new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

}
