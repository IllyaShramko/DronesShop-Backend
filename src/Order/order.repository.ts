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
    },
    async createOrder(mainCredentials, products, addressCredentials, userId) {
        try {
            return await PrismaClient.order.create({
                data: {
                    ...mainCredentials,
                    products: {
                        createMany: {
                            data: products.map(product => ({
                                productId: product.id,
                                ordered: product.count
                            }))
                        }
                    },
                    address: { create: addressCredentials },
                    user: { connect: { id: userId }}
                },

            })
        } catch (error) {
            throw error
        }
    },
}