import { Default, Column, DataType, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import TblCategories from "./tblCategories";
import TblLanguages from "./tblLanguages";

@Table({ tableName: "tblQuestions", timestamps: true })
export class TblQuestions extends Model {

  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true, type: DataType.BIGINT })
  declare public id: number;

  @Column({ allowNull: true, type: DataType.BIGINT })
  @ForeignKey(() => TblCategories)
  @Default(1)
  public categoryId: number;

  @Column({ allowNull: true, type: DataType.BIGINT })
  @ForeignKey(() => TblLanguages)
  @Default(1)
  public languageId: number;

  @Column({ allowNull: false, type: DataType.STRING(1024), unique: true })
  public question: string;

  @Column({ allowNull: true, type: DataType.STRING(64) })
  @Default("easy")
  public difficulty: string;

  @Column({ allowNull: false, type: DataType.STRING(256) })
  public correctAnswer: string;

  @Column({ allowNull: false, type: DataType.ARRAY(DataType.STRING) })
  public incorrectAnswers: string[];
}

export default TblQuestions;
