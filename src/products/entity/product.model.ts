import { Table, Column, CreatedAt, UpdatedAt, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UUIDV4 } from 'sequelize';

@Table({ timestamps: true })
export class ProductModel extends Model<ProductModel>{

  @Column({ primaryKey: true, type: DataTypes.UUID, defaultValue: UUIDV4 })
  public id: string;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 200] } })
  public name: string;

  @Column({ type: DataTypes.STRING, allowNull: true, validate: { len: [1, 500] } })
  public description: string;

  @Column({ type: DataTypes.INTEGER, allowNull: false, validate: { len: [1, 100] } })
  public price: number;

  @CreatedAt
  public created_at: Date;

  @UpdatedAt
  public updated_at: Date;

}
