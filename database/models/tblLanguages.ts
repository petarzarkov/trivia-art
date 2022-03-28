import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "tblLanguages", timestamps: false })
export class TblLanguages extends Model {

  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true, type: DataType.BIGINT })
  declare public id: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
    unique: true
  })
  declare public lang: string;

  @Column({ allowNull: true, type: DataType.STRING(256) })
  declare public previewName?: string;
}

export default TblLanguages;
