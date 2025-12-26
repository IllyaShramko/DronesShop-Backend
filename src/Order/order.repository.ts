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
    async getByIdUser(userId) {
        try {
            return await PrismaClient.order.findMany({
                where: {userId: userId},
                include: {products: {
                    include: {product: true}
                }}
            })
        } catch(error) {
            throw error
        }
    },
    async getAll() {
        const order = await PrismaClient.order.findMany({})
        return order
    },
    async delete(id) {
        return await PrismaClient.order.delete({where:{id}})
    }
}