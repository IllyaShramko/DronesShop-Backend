import { ProductRepositoryContract } from "./product.types";
import { PrismaClient as PC, Prisma } from "../generated/prisma"; 

const PrismaClient = new PC()

export const ProductRepository: ProductRepositoryContract = {
    async getById(id) {
        try {
            const product = await PrismaClient.product.findUnique({
                where:{id: id},
                include: {
                    blocksInfo: {
                        include: {
                            params: true
                        }
                    }
                }
            })
            console.log(product)
            return product
            
        } catch (error) {
            throw error
        }
    },
    async getAll(categoryId) {
        if (categoryId){
            const products = await PrismaClient.product.findMany({
                where: {
                    categoryId: categoryId
                }
            })
            return products
        }
        else{
            const products = await PrismaClient.product.findMany({}) 
            return products
        }
    },
    async create(data) {
        return await PrismaClient.product.create({data})
    },
    async update(id, data) {
        return await PrismaClient.product.update({
            where: {id},
            data
        })
    },
    async delete(id) {
        return await PrismaClient.product.delete({where:{id}})
    },
    async getSuggestions(popular, isNew, limit, offset) {

        
        return await PrismaClient.product.
    }
}