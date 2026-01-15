import { Product, ProductServiceContract, ProductWithInfo } from './product.types'
import { PrismaClient } from '../generated/prisma'
import { ProductRepository } from './product.repository'
const client = new PrismaClient()

export const ProductService: ProductServiceContract = {
    getAll: async (categoryId) => {
        return ProductRepository.getAll(categoryId)
    },
    getById: async (id) => {
        return ProductRepository.getById(id)
    },
    create: async (data) => {
        return ProductRepository.create(data)
    },
    async update(id, data) {
        return ProductRepository.update(id, data)
    },
    async delete(id) {
        return ProductRepository.delete(id)
    },
    async getSuggestions(popular, isNew, limit, offset) {
        return ProductRepository.getSuggestions(popular, isNew, limit, offset)
    }
}
