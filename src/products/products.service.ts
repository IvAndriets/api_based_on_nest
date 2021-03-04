import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto';
import { ProductModel } from './model';
import { Sequelize, Transaction } from 'sequelize';
import { FindAndCountOptions } from 'sequelize/types';
import { removeFalsyValues } from '../utils';


@Injectable()
export class ProductsService {

  public constructor(
    @InjectModel(ProductModel) private productModel: typeof ProductModel,
    private readonly sequelize: Sequelize,
  ) {
  }

  public async findAll(queryParam: FindAndCountOptions): Promise<{ rows: ProductModel[]; count: number }> {
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
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const product = new ProductModel({ ...createProductDto });
      await product.save({ transaction });
      await transaction.commit();

      return product;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 500);
    }

  }

  public async update(id: string, createProductDto: CreateProductDto): Promise<ProductModel> {
    const transaction: Transaction = await this.sequelize.transaction();


    try {
      const product = await this.productModel.findByPk(id);

      if (!product) {
        throw new NotFoundException('Could not find a product');
      }

      product.set(removeFalsyValues(createProductDto));

      const savedProduct = await product.save({ transaction });
      await product.reload({ transaction });
      await transaction.commit();

      return savedProduct;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 500);
    }
  }

  public async delete(id: string): Promise<{ message: string }> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const product = await this.productModel.findByPk(id);

      if (!product) {
        throw new NotFoundException('Cannot find product for deleting');
      }

      await product.destroy();
      await transaction.commit();
      return { message: 'Deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error instanceof NotFoundException ? error : new HttpException(error, 500);
    }
  }

}
