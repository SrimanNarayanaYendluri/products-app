import { Context } from "hono";
import { insertProduct } from "../services/db/productServices";
import { validateRequest } from "../validations/validationRequest";
import { ValidatedCreateProduct } from "../validations/schemas/vCreateProductSchema"
import { PRODUCT_VALIDATION_ERROR, PRODUCT_ADD_SUCCESSFULLY } from "../constants/appMessages";
import { sendSuccessResponse } from "../utils/responseUtils"
import BadRequestException from "../exceptions/badRequestException";

class ProductController {

  createProduct = async (c: Context) => {
    try {
      const req = await c.req.json();

      const validatedProduct = await validateRequest<ValidatedCreateProduct>('product:create-product', req, PRODUCT_VALIDATION_ERROR);

      const productData = {
        ...validatedProduct,
        created_at: validatedProduct.created_at ? new Date(validatedProduct.created_at) : undefined,
        updated_at: validatedProduct.updated_at ? new Date(validatedProduct.updated_at) : undefined,
      };
      const createdProduct = await insertProduct(productData);

      return sendSuccessResponse(c, 201, PRODUCT_ADD_SUCCESSFULLY, createdProduct);

    } catch (error: any) {
      throw error;
    }
  };
}

export default ProductController;
