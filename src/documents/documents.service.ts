import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentsHeaderDto, UpdateDocumentsDto, CreateDocumentsRowsDto } from './dto';
import { FindAndCountOptions, Sequelize, Transaction } from 'sequelize';
import { DocumentsHeaderModel } from './model/documentsHeader.model';
import { DocumentsRowsModel } from './model/documentsRows.model';
import { InjectModel } from '@nestjs/sequelize';
import { removeFalsyValues } from '../utils';

@Injectable()
export class DocumentsService {

  public constructor(
    @InjectModel(DocumentsHeaderModel) private documentsHeaderModel: typeof DocumentsHeaderModel,
    @InjectModel(DocumentsRowsModel) private documentsRowsModel: typeof DocumentsRowsModel,
    private readonly sequelize: Sequelize,
  ) {
  }

  public async create(createDocumentsHeaderDto: CreateDocumentsHeaderDto, createDocumentsRowsDto: CreateDocumentsRowsDto): Promise<{ header: DocumentsHeaderModel, rows: DocumentsRowsModel }> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const documentHeader = new DocumentsHeaderModel({ ...createDocumentsHeaderDto });
      await documentHeader.save({ transaction });
      const documentRows = new DocumentsRowsModel({ ...createDocumentsRowsDto });
      await documentRows.save({ transaction });
      await transaction.commit();

      return { header: documentHeader, rows: documentRows };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 500);
    }

  }

  public async findAll(queryParam: FindAndCountOptions): Promise<{ rows: DocumentsHeaderModel[]; count: number }> {
    try {
      return this.documentsHeaderModel.findAndCountAll(queryParam);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  public async findOne(id: string): Promise<{ header: DocumentsHeaderModel, rows: DocumentsRowsModel[] }> {

    try {
      return {
        header: await this.documentsHeaderModel.findByPk(id),
        rows: await this.documentsRowsModel.findAll({ where: { documentHeaderId: id } }),
      };
    } catch (error) {
      throw new NotFoundException(`Can not find document by id: ${id}`);
    }
  }

  public async update(id: string, updateDocumentsDto: UpdateDocumentsDto): Promise<DocumentsHeaderModel> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const document = await this.documentsHeaderModel.findByPk(id);

      document.set(removeFalsyValues(updateDocumentsDto));

      const saveDocument = await document.set({ transaction });
      await document.reload({ transaction });
      await transaction.commit();

      return saveDocument;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 500);
    }
  }

  public async remove(id: string): Promise<{ message: string }> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const document = await this.documentsHeaderModel.findByPk(id);

      if (!document) {
        throw new NotFoundException('Cannot find category for deleting');
      }

      await this.documentsRowsModel.destroy({ where: { documentHeaderId: id } });
      await document.destroy();

      await transaction.commit();
      return { message: `This action removes a #${id} document` };
    } catch (error) {
      await transaction.rollback();
      throw error instanceof NotFoundException ? error : new HttpException(error, 500);
    }
  }
}
