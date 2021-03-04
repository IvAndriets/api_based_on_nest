import { Table, Column, CreatedAt, UpdatedAt, Model, ForeignKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UUIDV4 } from 'sequelize';
import { CategoryModel } from '../../category/model';

@Table({ timestamps: true })
export class ProductModel extends Model {

  @Column({ primaryKey: true, type: DataTypes.UUID, defaultValue: UUIDV4 })
  public id: string;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 200] } })
  public name: string;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 500] } })
  public description: string;

  @Column({ type: DataTypes.INTEGER, allowNull: false, validate: { len: [1, 100] } })
  public price: number;

  @ForeignKey(() => CategoryModel)
  @Column
  public category_id: string;

  @CreatedAt
  public created_at: Date;

  @UpdatedAt
  public updated_at: Date;

}
