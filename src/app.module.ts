import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productsModule } from './products/products.module';
import { ProductEntity } from './products/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USER_NAME || 'api_based_on_test',
    password: 'api_based_on_test',
    database: 'api_based_on_test',
    entities: [
      ProductEntity,
    ],
    synchronize: true,
  }), productsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
