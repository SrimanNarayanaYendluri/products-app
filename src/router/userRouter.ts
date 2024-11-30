import { Hono } from 'hono';
import UserController from '../controllers/userController';

const productRouter = new Hono();
const userController = new UserController();

productRouter.post('/', userController.registerUser);

export default productRouter;