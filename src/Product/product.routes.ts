import express from 'express'
import { ProductController } from './product.controller'

const ProductRouter: express.Router = express.Router()


ProductRouter.get("/", ProductController.getAll);

ProductRouter.get("/:id", ProductController.getById);

ProductRouter.post("/",  ProductController.create);

ProductRouter.put("/:id",  ProductController.update)

ProductRouter.delete("/:id",  ProductController.delete)
export { ProductRouter }