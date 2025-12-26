import { Order, OrderServiceContract } from "./order.types";
import { PrismaClient } from "../generated/prisma";
import { OrderRepository } from "./order.repository";

const client = new PrismaClient();

export const OrderService: OrderServiceContract = {
    getAll: async () => {
       return await OrderRepository.getAll();
    },
    getById: async (id) => {
        return await OrderRepository.getById(id);
    },
    async delete(id) {
        return await OrderRepository.delete(id);
    },
    };
