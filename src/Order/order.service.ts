import { Order, OrderServiceContract, CreateOrder, UpdateOrderChecked } from "./order.types";
import { PrismaClient } from "../generated/prisma";
import { OrderRepository } from "./order.repository";

const client = new PrismaClient();

export const OrderService: OrderServiceContract = {
    getAll: async () => {
       return OrderRepository.getAll();
    },
    getById: async (id) => {
        return OrderRepository.getById(id);
    },

    create: async (data: CreateOrder) => {
        return OrderRepository.create(data);
    },
    async update(id, data: UpdateOrderChecked) {
    
        return OrderRepository.update(id, data as any);
    },
    async delete(id) {
        return OrderRepository.delete(id);
    },
    };
