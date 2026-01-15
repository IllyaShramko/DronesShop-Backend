import express from 'express'
import { ProductController } from './product.controller'
import { authMiddleware } from '../middlewares/auth.middleware';

const ProductRouter: express.Router = express.Router()


ProductRouter.get("/", ProductController.getAll);

ProductRouter.get("/suggestions", ProductController.getSuggestions)

ProductRouter.get("/:id", ProductController.getById);

ProductRouter.post("/", authMiddleware, ProductController.create);

ProductRouter.put("/:id", authMiddleware, ProductController.update)

ProductRouter.delete("/:id", authMiddleware, ProductController.delete)
export { ProductRouter }