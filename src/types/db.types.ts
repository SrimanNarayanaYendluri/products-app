import { User, UsersTable, NewUser } from "../schemas/userSchema";
import { Product, ProductsTable, NewProduct } from "../schemas/productSchema"


export type DBTableRow =
  | User
  | Product

export type DBTable =
  | UsersTable
  | ProductsTable

export type DBNewRecords =
  | NewUser[]
  | NewProduct[]

export type DBNewRecord =
  | NewUser
  | NewProduct

export type WhereQueryData<T extends DBTableRow> = {
  columns: Array<keyof T>;
  values: any[];
};

export type DBTableColumns<T extends DBTableRow> = keyof T;
export type SortDirection = "asc" | "desc";

export type OrderByQueryData<T extends DBTableRow> = {
  columns: Array<DBTableColumns<T>>;
  values: SortDirection[];
};

export type InQueryData<T extends DBTableRow> = {
  key: keyof T;
  values: any[];
};

export type UpdateRecordData<R extends DBTableRow> = Partial<Omit<R, "id" | "created_at" | "updated_at">>;

export type PaginationInfo = {
  total_records: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
};