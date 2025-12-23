import { CategoryRepositoryContract } from "./category.types";
import { PrismaClient as PC, Prisma } from "../generated/prisma"; 

const PrismaClient = new PC()

export const CategoryRepository: CategoryRepositoryContract = {
    async getById(id) {
        try {
            const category = await PrismaClient.category.findUnique({where:{id: id}})
            console.log(category)
            return category
            
        } catch (error) {
            throw error
        }
    },
    async getAll() {
        const categories = await PrismaClient.category.findMany({})
        return categories
    },
    async create(data) {
        return await PrismaClient.category.create({data})
    },
    async update(id, data) {
        return await PrismaClient.category.update({
            where: {id},
            data
        })
    },
    async delete(id) {
        return await PrismaClient.category.delete({where:{id}})
    }
}