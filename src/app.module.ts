import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productsModule } from './products/products.module';
import { ProductEntity } from './products/entity';
import {ConfigModule} from '@nestjs/config';

console.log(process.env.POSTGRES_USER);

@Module({
  imports: [ConfigModule.forRoot() ,TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
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
