import { Default, Column, DataType, Model, PrimaryKey, Table, HasOne } from "sequelize-typescript";
import TblCategories from "./tblCategories";
import TblLanguages from "./tblLanguages";

@Table({
  tableName: "tblQuestions",
  timestamps: false
})
export class TblQuestions extends Model {

  @PrimaryKey
  @Column({ autoIncrement: false, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare public id: string;

  @HasOne(() => TblCategories, { foreignKey: "id", sourceKey: "categoryId", as: "tblCategories" })
  @Column({ allowNull: false, type: DataType.UUID })
  declare public categoryId: string;

  @HasOne(() => TblLanguages, { foreignKey: "id", sourceKey: "languageId", as: "tblLanguages" })
  @Column({ allowNull: false, type: DataType.UUID })
  declare public languageId: string;

  @Column({ allowNull: false, type: DataType.STRING(1024), unique: true })
  declare public question: string;

  @Default("easy")
  @Column({ allowNull: true, type: DataType.STRING(64) })
  declare public difficulty: string;

  @Column({ allowNull: false, type: DataType.STRING(256) })
  declare public correctAnswer: string;

  @Column({ allowNull: false, type: DataType.ARRAY(DataType.STRING) })
  declare public incorrectAnswers: string[];
}

export default TblQuestions;
