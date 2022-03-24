import { Model, Repository } from "sequelize-typescript";
import { Attributes, Order, Transaction, WhereOptions } from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";

export interface IDataSuccessResult<T> {
  isSuccess: true;
  result: T | undefined;
}

export interface IDataErrorResult {
  isSuccess: false;
  error: Error | unknown;
}

interface IBaseRepo<ModelClass, ModelDTO> {
  table: Repository<ModelClass>;
  mapTableToDTO: (model: ModelClass) => ModelDTO;
}

type CommonCommanderOpts<CommandReturnType> = {
  requestId?: string;
  command: () => Promise<CommandReturnType>;
};

export class BaseRepository<ModelClass extends Model<ModelClass, ModelDTO>, ModelDTO extends { id: number }> {
  private table: Repository<ModelClass>;
  private tableName: string;
  private mapTableToDTO: (model: ModelClass) => ModelDTO;

  constructor({ table, mapTableToDTO }: IBaseRepo<ModelClass, ModelDTO>) {
    if (!table) {
      const error = "Missing table model!";
      console.warn(error);
      throw new Error(error);
    }

    this.table = table;
    this.tableName = table.tableName || typeof table;
    this.mapTableToDTO = mapTableToDTO;
  }

  private commit = async <CommandReturnType>({ command, requestId }: CommonCommanderOpts<CommandReturnType>) => {
    try {
      const res = await command();
      return withResult<CommandReturnType>(res);
    } catch (error) {
      console.error("Error executing command", { err: error, requestId, tableName: this.tableName });
      return withError(error);
    }
  };

  public create = async ({ tableDTO, transaction, requestId }: { tableDTO: Omit<ModelDTO, "id"> & { id: number }; transaction?: Transaction; requestId?: string }) => {
    return this.commit<ModelDTO>({
      requestId,
      command: () => this.table.create({
        ...tableDTO,
        id: tableDTO.id || 0,
      } as unknown as MakeNullishOptional<ModelClass["_creationAttributes"]>,
      { transaction })
        .then(this.mapTableToDTO)
    });
  };

  public getAll = async ({ requestId, order, where }: { order?: Order; requestId?: string; where?: Partial<ModelDTO> } = {}) => {
    return this.commit<ModelDTO[]>({
      requestId,
      command: () => this.table.findAll({ where: where as unknown as WhereOptions<Attributes<ModelClass>>, order })
        .then(e => e?.map(this.mapTableToDTO))
    });
  };

}

export const withResult = <T>(data: T | undefined): IDataSuccessResult<T> => ({ isSuccess: true, result: data });
export const withError = (error: Error | unknown): IDataErrorResult => ({ isSuccess: false, error });
