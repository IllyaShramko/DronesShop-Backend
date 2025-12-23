import express from 'express'
import { CategoryWithProducts } from './category.controller'
import { authMiddleware } from '../middlewares/auth.middleware';

const CategoryRouter: express.Router = express.Router()


CategoryRouter.get("/", CategoryWithProducts.getAll);

CategoryRouter.get("/:id", CategoryWithProducts.getById);

CategoryRouter.post("/",authMiddleware, CategoryWithProducts.create);

CategoryRouter.put("/:id", authMiddleware, CategoryWithProducts.update)

CategoryRouter.delete("/:id", authMiddleware, CategoryWithProducts.delete)
export { CategoryRouter }