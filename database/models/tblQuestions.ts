import { Default, Column, DataType, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import TblCategories from "./tblCategories";
import TblLanguages from "./tblLanguages";

@Table({ tableName: "tblQuestions", timestamps: false })
export class TblQuestions extends Model {

  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true, type: DataType.BIGINT })
  declare public id: number;

  @ForeignKey(() => TblCategories)
  @Default(1)
  @Column({ allowNull: true, type: DataType.BIGINT })
  declare public categoryId: number;

  @ForeignKey(() => TblLanguages)
  @Default(1)
  @Column({ allowNull: true, type: DataType.BIGINT })
  declare public languageId: number;

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
