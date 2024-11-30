import { db } from '../../db/dbConnection';
import { products, NewProduct } from '../../schemas/productSchema';

const insertProduct = async (newProduct:NewProduct) => {
        const insertedProduct = await db.insert(products).values(newProduct).returning();
        return insertedProduct[0];
};


export { insertProduct }