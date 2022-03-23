import { Default, Column, DataType, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import TblCategories from "./tblCategories";

@Table({ tableName: "tblQuestions", timestamps: true })
export class TblQuestions extends Model {

  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true, type: DataType.BIGINT })
  declare public id: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  @ForeignKey(() => TblCategories)
  @Default(1)
  public categoryId: number;

  @Column({ allowNull: false, type: DataType.STRING(1024), unique: true })
  public question: string;

  @Column({ allowNull: false, type: DataType.STRING(256) })
  public correctAnswer: string;

  @Column({ allowNull: false, type: DataType.JSONB })
  public incorrectAnswers: string[];

  @Column({ allowNull: true, type: DataType.STRING(12), unique: true })
  @Default("en")
  public language: string;
}

export default TblQuestions;
