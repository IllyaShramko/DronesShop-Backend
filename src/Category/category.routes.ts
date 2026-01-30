import express from 'express'
import { CategoryWithProducts } from './category.controller'
import { authMiddleware } from '../middlewares/auth.middleware';

const CategoryRouter: express.Router = express.Router()


CategoryRouter.get("/", CategoryWithProducts.getAll);

CategoryRouter.get("/:id", CategoryWithProducts.getById);

CategoryRouter.post("/", CategoryWithProducts.create);

CategoryRouter.put("/:id", CategoryWithProducts.update)

CategoryRouter.delete("/:id", CategoryWithProducts.delete)
export { CategoryRouter }