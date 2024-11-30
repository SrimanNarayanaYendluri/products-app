import { Product } from "../schemas/productSchema";
import { ValidatedCreateProduct, ValidatedUpdateProduct } from "../validations/schemas/vProductSchema"
import { ValidatedCreateUser } from "../validations/schemas/vCreateUserSchema";
import { DBTableRow } from "./db.types";

export type PaginationInfo = {
  total_records: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
};

export type PaginatedResp<T extends DBTableRow> = {
  pagination_info: PaginationInfo,
  records: T[];
};

export type CreateProductResponse = {
  name: string;
  description: string | null | undefined;
  product_code: string;
  price: number;
  quantity: number;
  is_active: boolean | null | undefined;
  created_at: Date | null | undefined;
  updated_at: Date | null | undefined;
};


export type  getAllProductsRespnseData = {
  pagination_info: PaginationInfo;
  records: Partial<Product>[]; 
};

export type InsertUserResponse = {
  id: number;
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}
export type AppResponseData = CreateProductResponse
  | InsertUserResponse
  | getAllProductsRespnseData

export type SuccessResponseData = {
  status: number;
  success: true;
  message: string;
  data?: AppResponseData;
};

export type UserActivity = "user:create-user"

export type ProductActivity = "product:create-product" | "product:update-product"

export type AppActivity = UserActivity | ProductActivity

export type ValidatedRequest = ValidatedCreateUser | ValidatedCreateProduct | ValidatedUpdateProduct