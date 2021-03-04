import { Module } from '@nestjs/common';
import { ProductModel } from './model';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductModel,
    ]),
  ],
  providers: [
    ProductsService,
  ],
  controllers: [
    ProductsController,
  ],
})
export class ProductsModule {
}
