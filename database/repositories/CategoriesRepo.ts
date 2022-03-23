import { TblCategories } from "../models";
import { BaseRepository } from "./BaseRepository";

export type CategoriesDTO = Pick<TblCategories, "id" | "category" | "previewName">;

function mapTableToDTO(model: TblCategories): CategoriesDTO {
  return {
    id: model.id,
    category: model.category,
    previewName: model.previewName
  };
}

export const CategoriesRepo = new BaseRepository({
  table: TblCategories,
  mapTableToDTO,
});
