import { object, pipe, nullable, minValue, nonEmpty, number, string, InferOutput, optional, nonNullable, boolean } from "valibot";
import { NAME_REQUIRED, NAME_IS_STRING, PRODUCT_CODE_REQUIRED, PRODUCT_CODE_IS_STRING, PRICE_REQUIRED, PRICE_IS_NUMBER, QUANTITY_IS_NUMBER, QUANTITY_IS_REQUIRED } from "../../constants/appMessages";

export const VCreateProductSchema = object({
    name: pipe(
        string(NAME_IS_STRING),
        nonEmpty(NAME_REQUIRED)
    ),
    description: optional(string()),
    product_code: pipe(
        string(PRODUCT_CODE_IS_STRING),
        nonEmpty(PRODUCT_CODE_REQUIRED)
    ),
    price: pipe(
        nonNullable(nullable(number(PRICE_IS_NUMBER)), PRICE_REQUIRED),
        minValue(0, PRICE_IS_NUMBER)
    ),
    quantity: pipe(
        nonNullable(nullable(number(QUANTITY_IS_NUMBER)), QUANTITY_IS_REQUIRED),
        minValue(0, QUANTITY_IS_NUMBER)
    ),

    is_active: optional(
        boolean()
    ),
    created_at: optional(
        string()
    ),
    updated_at: optional(
        string()
    ),
});


export const VUpdateProductSchema = object({
  name: pipe(
    string(NAME_IS_STRING),
    nonEmpty(NAME_REQUIRED)
  ),
  description: optional(string()),
  product_code: pipe(
    string(PRODUCT_CODE_IS_STRING),
    nonEmpty(PRODUCT_CODE_REQUIRED)
  ),
  price: pipe(
    nonNullable(nullable(number(PRICE_IS_NUMBER)), PRICE_REQUIRED),
    minValue(0, PRICE_IS_NUMBER)
  ),
  quantity: pipe(
    nonNullable(nullable(number(QUANTITY_IS_NUMBER)), QUANTITY_IS_REQUIRED),
    minValue(0, QUANTITY_IS_NUMBER)
  ),
  is_active: optional(boolean()),
  updated_at: optional(string()) 
});




export type ValidatedUpdateProduct = InferOutput<typeof VUpdateProductSchema>;

export type ValidatedCreateProduct = InferOutput<typeof VCreateProductSchema>;
