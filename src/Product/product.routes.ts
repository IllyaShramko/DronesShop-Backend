import express from 'express'
import { ProductController } from './product.controller'
import { authMiddleware, pagginationMiddleware } from '../middlewares';

const ProductRouter: express.Router = express.Router()


ProductRouter.get("/", pagginationMiddleware, ProductController.getAll);

ProductRouter.get("/suggestions", pagginationMiddleware, ProductController.getSuggestions)

ProductRouter.get("/:id", ProductController.getById);

ProductRouter.post("/", authMiddleware, ProductController.create);

ProductRouter.put("/:id", authMiddleware, ProductController.update)

ProductRouter.delete("/:id", authMiddleware, ProductController.delete)
export { ProductRouter }