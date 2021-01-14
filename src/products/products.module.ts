import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductEntity} from './entity/product.entity';
import {ProductsService} from './products.service';
import {productsController} from './products.controller';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity])],
  providers:[ProductsService],
  controllers:[productsController],
})
export class productsModule {

}
