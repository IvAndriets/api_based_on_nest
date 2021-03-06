import { ForeignKey, Table, Column, Model } from 'sequelize-typescript';
import { DataTypes, UUIDV4 } from 'sequelize';
import { DocumentsHeaderModel } from './documentsHeader.model';
import { ProductModel } from '../../products/model';

@Table({ timestamps: true })
export class DocumentsRowsModel extends Model {

  @Column({ primaryKey: true, type: DataTypes.UUID, defaultValue: UUIDV4 })
  public id: string;

  @ForeignKey(() => DocumentsHeaderModel)
  @Column
  public documentHeaderId: string;

  @ForeignKey(() => ProductModel)
  @Column
  public productId: string;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 200] } })
  public quantity: number;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 200] } })
  public price: number;

}
