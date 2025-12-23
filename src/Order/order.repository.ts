import { OrderRepositoryContract } from "./order.types";
import { PrismaClient as PC, Prisma } from "../generated/prisma"; 

const PrismaClient = new PC()

export const OrderRepository: OrderRepositoryContract = {
    async getById(id) {
        try {
            const order = await PrismaClient.order.findUnique({where:{id: id}})
            return order
            
        } catch (error) {
            throw error
        }
    },
    async getAll() {
        const order = await PrismaClient.order.findMany({})
        return order
    },
    async create(data) {
        return await PrismaClient.order.create({data})
    },
    async update(id, data) {
        return await PrismaClient.order.update({
            where: {id},
            data
        })
    },
    async delete(id) {
        return await PrismaClient.order.delete({where:{id}})
    }
}