import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentsHeaderDto, CreateDocumentsRowsDto } from './dto';
import { UpdateDocumentsDto } from './dto';
import { QueryParam } from '../interfaces';
import { queryParser, removeFalsyValues } from '../utils';
import { FindAndCountOptions } from 'sequelize';
import { DocumentsHeaderModel } from './model/documentsHeader.model';
import { DocumentsRowsModel } from './model/documentsRows.model';

@Controller('documents')
export class DocumentsController {
  public constructor(private readonly documentService: DocumentsService) {
  }

  @Post()
  public async create(@Body('header') createWaybillDto: CreateDocumentsHeaderDto, @Body('rows') createDocumentsRowsDto: CreateDocumentsRowsDto) {
    return this.documentService.create(createWaybillDto, createDocumentsRowsDto);
  }

  @Get()
  public async findAll(@Query() queryParam: QueryParam): Promise<{ rows: DocumentsHeaderModel[]; count: number }> {
    const { offset, limit, sort_field, sort, q } = queryParam;

    const search = q ? queryParser(JSON.parse(q)) : null;

    const query: FindAndCountOptions = {
      limit: +limit || 5,
      offset: +offset || 0,
      order: sort_field ? [[sort_field, ['asc', 'desc'].includes(sort.toLowerCase()) ? sort : 'ASC']] : null,
      where: search,
    };

    return this.documentService.findAll(removeFalsyValues(query));
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<{ header: DocumentsHeaderModel, rows: DocumentsRowsModel[] }> {
    return this.documentService.findOne(id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateWaybillDto: UpdateDocumentsDto): Promise<DocumentsHeaderModel> {
    return this.documentService.update(id, updateWaybillDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.documentService.remove(id);
  }
}
