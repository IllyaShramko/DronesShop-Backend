import express from 'express'
import { OrderController } from './order.controller'
import { authMiddleware } from '../middlewares/auth.middleware';

export const OrderRouter: express.Router = express.Router()

OrderRouter.get("/", OrderController.getAll);

OrderRouter.get("/:id", OrderController.getById);

OrderRouter.delete("/:id", OrderController.delete)

OrderRouter.post("/", authMiddleware, OrderController.makeOrder)