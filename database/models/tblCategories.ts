import { Default, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "tblCategories", timestamps: true })
export class TblCategories extends Model {

  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true, type: DataType.BIGINT })
  declare public id: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
    unique: true
  })
  public category: string;

  @Default("GeneralKnowledge")
  @Column({ allowNull: true, type: DataType.STRING(256) })
  public previewName?: string;
}

export default TblCategories;
