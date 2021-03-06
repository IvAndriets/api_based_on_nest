import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentsHeaderDto } from './create-documents-header.dto';

export class UpdateDocumentsDto extends PartialType(CreateDocumentsHeaderDto) {}
