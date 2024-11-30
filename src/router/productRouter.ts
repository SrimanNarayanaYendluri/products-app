import { Hono } from 'hono';
import ProductController from '../controllers/productController';

const productRouter = new Hono();
const productController = new ProductController();

productRouter.post('/', productController.addProduct);
productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getProductById);
productRouter.patch('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.softDeleteProduct);
productRouter.get('/seed', productController.seedProductsHandler);

export default productRouter;
