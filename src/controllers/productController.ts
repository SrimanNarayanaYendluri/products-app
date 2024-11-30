import { Context } from "hono";
import { validateRequest } from "../validations/validationRequest";
import { ValidatedCreateProduct, ValidatedUpdateProduct } from "../validations/schemas/vProductSchema"
import { PRODUCT_VALIDATION_ERROR, PRODUCT_ADD_SUCCESSFULLY, PRODUCTS_FETCHED_SUCCESSFULLY, PRODUCT_NOT_FOUND, PRODUCT_DETAILS_FETCHED_SUCCESS, PRODUCT_UPDATE_SUCCESSFULLY, PRODUCT_DELETE_SUCCESSFULLY, PRODUCT_CODE_EXISTS } from "../constants/appMessages";
import { sendSuccessResponse } from "../utils/responseUtils"
import { DBTableColumns, OrderByQueryData, SortDirection, WhereQueryData } from "../types/db.types";
import { Product, products } from "../schemas/productSchema";
import { getPaginatedRecordsConditionally, getRecordById, saveSingleRecord, softDeleteRecordById, updateRecordById } from "../services/db/baseDBService";
import NotFoundException from "../exceptions/notFoundException";
import { seedProducts } from "../seeder/productsSeeder";
import UnprocessableContentException from "../exceptions/unprocessableContentException";

class ProductController {

  addProduct = async (c: Context) => {
    try {
      const requestBody = await c.req.json();

      const validatedProduct = await validateRequest<ValidatedCreateProduct>('product:create-product', requestBody, PRODUCT_VALIDATION_ERROR);

      const productData = {
        ...validatedProduct
      };
      const createdProduct = await saveSingleRecord<Product>(products, productData);

      return sendSuccessResponse(c, 201, PRODUCT_ADD_SUCCESSFULLY, createdProduct);

    } catch (error: any) {
      if (error.constraint === 'products_product_code_unique') {
        throw new UnprocessableContentException(PRODUCT_CODE_EXISTS);
      }
      throw error;
    }
  };

  getAllProducts = async (c: Context) => {
    try {

      const page = +c.req.query('page')! || 1;
      const pageSize = +c.req.query('page_size')! || 10;
      const searchString = c.req.query('search_string') || null;
      const isActive = c.req.query('is_active') || null;
      // const priceMin = +c.req.query('price_min')! || null;
      // const priceMax = +c.req.query('price_max')! || null;
      const priceMin = c.req.query('price_min') ? Number(c.req.query('price_min')) : null;
      const priceMax = c.req.query('price_max') ? Number(c.req.query('price_max')) : null;


      let orderByQueryData: OrderByQueryData<Product> = {
        columns: ['id'],
        values: ['desc']
      };

      const orderBy = c.req.query('order_by');
      if (orderBy) {
        let orderByColumns: DBTableColumns<Product>[] = [];
        let orderByValues: SortDirection[] = [];
        const queryStrings = orderBy.split(',');
        for (const queryString of queryStrings) {
          const [column, value] = queryString.split(':');
          orderByColumns.push(column as DBTableColumns<Product>);
          orderByValues.push(value as SortDirection);
        }
        orderByQueryData = {
          columns: orderByColumns,
          values: orderByValues
        };
      }

      let whereQueryData: WhereQueryData<Product> = {
        columns: ['deleted_at'],
        values: [null],
      };

      if (searchString) {
        whereQueryData.columns.push('name');
        whereQueryData.values.push(`%${searchString}%`);
      }

      if (isActive) {
        whereQueryData.columns.push('is_active');
        whereQueryData.values.push(isActive === "true");
      }

      if (priceMin !== null && priceMax !== null) {
        whereQueryData.columns.push('price');
        whereQueryData.values.push({ between: [priceMin, priceMax] });
      } else if (priceMin !== null) {
        whereQueryData.columns.push('price');
        whereQueryData.values.push({ operator: '>=', value: priceMin });
      } else if (priceMax !== null) {
        whereQueryData.columns.push('price');
        whereQueryData.values.push({ operator: '<=', value: priceMax });
      }

      const columnsToSelect = [
        'id',
        'name',
        'description',
        'product_code',
        'price',
        'quantity',
        'is_active',
        'created_at',
        'updated_at'
      ] as const;
      console.log('whereQueryData:', JSON.stringify(whereQueryData, null, 2));

      const results = await getPaginatedRecordsConditionally<Product>(
        products,
        page,
        pageSize,
        orderByQueryData,
        whereQueryData,
        columnsToSelect
      );

      if (!results || results.records.length === 0) {
        throw new NotFoundException(PRODUCT_NOT_FOUND);
      }

      return sendSuccessResponse(c, 200, PRODUCTS_FETCHED_SUCCESSFULLY, results);
    } catch (error: any) {
      throw error;
    }
  };


  getProductById = async (c: Context) => {
    try {
      const id = +c.req.param('id');

      const productDetails = await getRecordById<Product>(products, id);

      if (!productDetails) {
        throw new NotFoundException(PRODUCT_NOT_FOUND);
      }

      return sendSuccessResponse(c, 200, PRODUCT_DETAILS_FETCHED_SUCCESS, productDetails);

    } catch (error: any) {
      throw error;
    }
  };

  updateProduct = async (c: Context) => {
    try {
      const id = +c.req.param('id');

      const requestBody = await c.req.json();

      const validatedProduct = await validateRequest<ValidatedUpdateProduct>(
        'product:update-product',
        requestBody,
        PRODUCT_VALIDATION_ERROR
      );

      const existingProduct = await getRecordById<Product>(products, id);

      if (!existingProduct) {
        throw new NotFoundException(PRODUCT_NOT_FOUND);
      }


      const updatedProductData = {
        ...existingProduct,
        ...validatedProduct,
        updated_at: new Date(),
      };

      const updatedProduct = await updateRecordById<Product>(products, id, updatedProductData);

      return sendSuccessResponse(c, 200, PRODUCT_UPDATE_SUCCESSFULLY, updatedProduct);
    } catch (error: any) {
      throw error;
    }
  };

  softDeleteProduct = async (c: Context) => {
    try {
      const id = +c.req.param('id');
      const existingProduct = await getRecordById<Product>(products, id);

      if (!existingProduct) {
        throw new NotFoundException(PRODUCT_NOT_FOUND);
      }

      await softDeleteRecordById<Product>(products, id, { deleted_at: new Date() });

      return sendSuccessResponse(c, 200, PRODUCT_DELETE_SUCCESSFULLY);
    } catch (error: any) {
      throw error;
    }
  };

  seedProductsHandler = async (c: Context) => {
    try {

      await seedProducts();

      return sendSuccessResponse(c, 200, "Products table seeded successfully.");
    } catch (error: any) {
      console.error(error);
      throw error
    }
  };

}

export default ProductController;
