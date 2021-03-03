import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto';
import { ProductModel } from './entity';
import { Sequelize, Transaction } from 'sequelize';
import { FindAndCountOptions } from 'sequelize/types';


@Injectable()
export class ProductsService {

  public constructor(
    @InjectModel(ProductModel) private productModel: typeof ProductModel,
    private readonly sequelize: Sequelize,
  ) {
  }

  public async findAll(queryParam: FindAndCountOptions):Promise<{ rows: ProductModel[]; count: number }> {
    try {
      return this.productModel.findAndCountAll(queryParam);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  public async findOne(id: string): Promise<ProductModel> {

    try {
      return await this.productModel.findByPk(id);
    } catch (error) {
      throw new NotFoundException(`Can not find product by id: ${id}`);
    }
  }

  public async create(createProductDto: CreateProductDto): Promise<ProductModel> {
    const t:Transaction = await this.sequelize.transaction();

    try {
      const product = new ProductModel();
      console.log(createProductDto);
      product.name = createProductDto.name;
      product.description = createProductDto.description;
      product.price = createProductDto.price;

      const savedProduct = await this.productModel.create(product, {transaction:t});
      await t.commit();

      return savedProduct;
    } catch (error) {
      await t.rollback();
      throw new HttpException(error, 500);
    }

  }

  public async update(id: string, createProductDto: CreateProductDto): Promise<ProductModel> {
    const t:Transaction = await this.sequelize.transaction();


    try {
      const product = await this.productModel.findByPk(id);

      if (!product) {
        throw new NotFoundException('Could not find a product');
      }

      if (createProductDto.name) {
        product.name = createProductDto.name;
      }
      if (createProductDto.description) {
        product.description = createProductDto.description;
      }
      if (createProductDto.price) {
        product.price = createProductDto.price;
      }

      const savedProduct = await product.save({transaction:t});
      await product.reload({transaction:t});
      await t.commit();

      return savedProduct;
    } catch (error) {
      await t.rollback();
      throw new HttpException(error, 500);
    }
  }

  public async delete(id: string): Promise<{ message: string }> {
    const t:Transaction = await this.sequelize.transaction();

    try {
      // Начать траназакцию
      const product = await this.productModel.findByPk(id);

      if (!product) {
        throw new NotFoundException('Cannot find product for deleting');
      }

      await product.destroy();
      await t.commit();
      return { message: 'Deleted successfully' };
    } catch (error) {
      await t.rollback();
      throw error instanceof NotFoundException ? error : new HttpException(error, 500);
    }
  }

}
