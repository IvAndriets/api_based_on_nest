import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { ProductEntity } from './products/entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER || 'api_based_on_test',
    password: process.env.POSTGRES_PASSWORD || 'api_based_on_test',
    database: process.env.POSTGRES_DATABASE || 'api_based_on_test',
    entities: [
      ProductEntity,
    ],
    synchronize: true,
  }), ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
