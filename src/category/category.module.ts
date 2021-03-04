import { Module } from '@nestjs/common';
import { CategoryModel } from './model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';


@Module({
  imports: [
    SequelizeModule.forFeature([CategoryModel]),
  ],
  providers: [
    CategoryService,
  ],
  controllers: [
    CategoryController,
  ],
})
export class CategoryModule {

}
