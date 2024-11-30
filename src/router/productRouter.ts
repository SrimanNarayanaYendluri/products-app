import { Hono } from 'hono';
import ProductController from '../controllers/productController';

const productRouter = new Hono();
const productController = new ProductController();

productRouter.post('/', productController.createProduct);

export default productRouter;
