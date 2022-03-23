import { Default, Column, DataType, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import TblLanguages from "./tblLanguages";

@Table({ tableName: "tblCategories", timestamps: true })
export class TblCategories extends Model {

  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: false, type: DataType.BIGINT })
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

  @Column({ allowNull: true, type: DataType.BIGINT })
  @ForeignKey(() => TblLanguages)
  @Default(1)
  public languageId: number;
}

export default TblCategories;
