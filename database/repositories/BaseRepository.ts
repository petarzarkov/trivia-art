import { Model, Repository } from "sequelize-typescript";
import { Attributes, Order, Transaction, WhereOptions } from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";
import { HotLogger } from "hot-utils";
import { withError, withResult } from "@contracts/APIResults";

const log = HotLogger.createLogger("@db/BaseRepo");
interface IBaseRepo<ModelClass, ModelDTO> {
  table: Repository<ModelClass>;
  mapTableToDTO: (model: ModelClass) => ModelDTO;
}

type CommonCommanderOpts<CommandReturnType> = {
  requestId?: string;
  command: () => Promise<CommandReturnType>;
};

export class BaseRepository<ModelClass extends Model<ModelClass, ModelDTO>, ModelDTO extends { id: number }> {
  public table: Repository<ModelClass>;
  public tableName: string;
  public mapTableToDTO: (model: ModelClass) => ModelDTO;

  constructor({ table, mapTableToDTO }: IBaseRepo<ModelClass, ModelDTO>) {
    if (!table) {
      const error = "Missing table model!";
      log.warn(error);
      throw new Error(error);
    }

    this.table = table;
    this.tableName = table.tableName || typeof table;
    this.mapTableToDTO = mapTableToDTO;
  }

  public commit = async <CommandReturnType>({ command, requestId }: CommonCommanderOpts<CommandReturnType>) => {
    try {
      const res = await command();
      return withResult<CommandReturnType>(res);
    } catch (error) {
      log.error("Error executing command", { err: <Error>error, requestId, tableName: this.tableName });
      return withError(error);
    }
  };

  public create = async ({ dto, transaction, requestId }: { dto: Omit<ModelDTO, "id"> & { id?: number }; transaction?: Transaction; requestId?: string }) => {
    return this.commit<ModelDTO | null>({
      requestId,
      command: () => this.table.create({
        ...dto,
        id: dto.id,
      } as unknown as MakeNullishOptional<ModelClass["_creationAttributes"]>,
      { transaction })
        .then(r => r ? this.mapTableToDTO(r) : null)
    });
  };

  public getAll = async ({ requestId, order, where }: { order?: Order; requestId?: string; where?: Partial<ModelDTO> } = {}) => {
    return this.commit<ModelDTO[] | null>({
      requestId,
      command: () => this.table.findAll({ where: where as unknown as WhereOptions<Attributes<ModelClass>>, order })
        .then(e => e.length ? e?.map(this.mapTableToDTO) : null)
    });
  };

  public getLast = async ({ requestId }: { requestId?: string } = {}) => {
    return this.commit<ModelDTO | null>({
      requestId,
      command: () => this.table.findOne({ order: [["id", "DESC"]] })
        .then(r => r && this.mapTableToDTO(r))
    });
  };

  public getById = async ({ id, requestId }: { id: number; requestId?: string }) => {
    return this.commit<ModelDTO | null>({
      requestId,
      command: () => this.table.findOne({ where: { id } })
        .then(r => r && this.mapTableToDTO(r))
    });
  };

  public findOne = async ({ where, order, requestId }: { where: Partial<ModelDTO>; order?: Order; requestId?: string }) => {
    return this.commit<ModelDTO | null>({
      requestId,
      command: () => this.table.findOne({ where: where as unknown as WhereOptions<Attributes<ModelClass>>, order })
        .then(r => r && this.mapTableToDTO(r))
    });
  };

}
