import { Table, Column, Model } from 'sequelize-typescript';
import { DataTypes, UUIDV4 } from 'sequelize';

@Table({ timestamps: true })
export class DocumentsHeaderModel extends Model {

  @Column({ primaryKey: true, type: DataTypes.UUID, defaultValue: UUIDV4 })
  public id: string;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 200] } })
  public active: boolean;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 200] } })
  public author: string;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 200] } })
  public type: string;

}
