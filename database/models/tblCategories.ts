import { Default, Column, DataType, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import TblLanguages from "./tblLanguages";

@Table({
  tableName: "tblCategories",
  timestamps: false
})
export class TblCategories extends Model {

  @PrimaryKey
  @Column({ autoIncrement: false, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare public id: string;

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
  @Column({ allowNull: false, type: DataType.UUID })
  declare public languageId: string;
}

export default TblCategories;
