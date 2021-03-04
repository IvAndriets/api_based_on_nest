import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {CategoryModel} from './model';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import {FindAndCountOptions} from 'sequelize/types';
import { CreateProductDto } from '../products/dto';
import { removeFalsyValues } from '../utils';


@Injectable()
export class CategoryService {

  public constructor(
    @InjectModel(CategoryModel) private categoryModel: typeof CategoryModel,
    private readonly sequelize: Sequelize,
  ) {
  }

  public async findAll(queryParam: FindAndCountOptions): Promise<{ rows: CategoryModel[]; count: number }> {
    try {
      return this.categoryModel.findAndCountAll(queryParam);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  public async findOne(id: string): Promise<CategoryModel> {

    try {
      return await this.categoryModel.findByPk(id);
    } catch (error) {
      throw new NotFoundException(`Can not find category by id: ${id}`);
    }
  }



  public async create(createProductDto: CreateProductDto): Promise<CategoryModel> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const category = new CategoryModel({ ...createProductDto });
      await category.save({ transaction });
      await transaction.commit();

      return category;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 500);
    }

  }

  public async update(id: string, createProductDto: CreateProductDto): Promise<CategoryModel> {
    const transaction: Transaction = await this.sequelize.transaction();


    try {
      const category = await this.categoryModel.findByPk(id);

      if (!category) {
        throw new NotFoundException('Could not find a category');
      }

      category.set(removeFalsyValues(createProductDto));

      const savedProduct = await category.save({ transaction });
      await category.reload({ transaction });
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
      const category = await this.categoryModel.findByPk(id);

      if (!category) {
        throw new NotFoundException('Cannot find category for deleting');
      }

      await category.destroy();
      await transaction.commit();
      return { message: 'Deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error instanceof NotFoundException ? error : new HttpException(error, 500);
    }
  }
}
