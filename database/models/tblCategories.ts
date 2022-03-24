import { Default, Column, DataType, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import TblLanguages from "./tblLanguages";

@Table({ tableName: "tblCategories", timestamps: false })
export class TblCategories extends Model {

  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true, type: DataType.BIGINT })
  declare public id: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
    unique: true
  })
  declare public category: string;

  @Default("GeneralKnowledge")
  @Column({ allowNull: true, type: DataType.STRING(256) })
  declare public previewName?: string;

  @ForeignKey(() => TblLanguages)
  @Default(1)
  @Column({ allowNull: true, type: DataType.BIGINT })
  declare public languageId: number;
}

export default TblCategories;
