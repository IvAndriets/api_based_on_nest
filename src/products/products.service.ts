import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateProductDto } from './dto';
import { ProductEntity } from './entity';

@Injectable()
export class ProductsService {

  public constructor(
    private readonly connection: Connection,
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
      const product: ProductEntity = await queryRunner.manager.findOne<ProductEntity>(id);

      if (createProductDto.name) {
        product.name = createProductDto.name;
      }

      if (createProductDto.description) {
        product.description = createProductDto.description;
      }

      if (createProductDto.price) {
        product.price = createProductDto.price;
      }

      const updatedProduct = await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      return updatedProduct;
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
      const product: ProductEntity = await queryRunner.manager.findOne<ProductEntity>(id);


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
