import { Table } from 'sequelize-typescript';
import { DataTypes, Model, UUIDV4 } from 'sequelize';
import { Column } from 'sequelize-typescript';

@Table({ timestamps: true })
export class WaybillModel extends Model {
  @Column({ primaryKey: true, type: DataTypes.UUID, defaultValue: UUIDV4 })
  public id: string;

  @Column({ type: DataTypes.STRING, allowNull: false, validate: { len: [1, 200] } })
  public name: string;

}
