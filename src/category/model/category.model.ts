import { Table, Column, CreatedAt, UpdatedAt, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UUIDV4 } from 'sequelize';

@Table({ timestamps: true })
export class CategoryModel extends Model{

  @Column({ primaryKey: true, type: DataTypes.UUID, defaultValue: UUIDV4 })
  public id: string;

  @Column( { type: DataTypes.STRING, allowNull:false, validate: {len: [1, 200]}})
  public name: string;

  @Column( { type: DataTypes.STRING, allowNull:false, validate: {len: [1, 200]}})
  public description: string;

  @CreatedAt
  public created_at: Date;

  @UpdatedAt
  public updated_at: Date;
}
