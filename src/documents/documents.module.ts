import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsHeaderModel } from './model/documentsHeader.model';
import { DocumentsRowsModel } from './model/documentsRows.model';

@Module({
  imports: [SequelizeModule.forFeature([DocumentsHeaderModel, DocumentsRowsModel])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {
}
