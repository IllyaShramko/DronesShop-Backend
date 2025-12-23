import { Category, CategoryServiceContract } from './category.types'
import { PrismaClient } from '../generated/prisma'
import { CategoryRepository } from './category.repository'
const client = new PrismaClient()

export const CategoryService: CategoryServiceContract = {
    getAll: async () => {
        return CategoryRepository.getAll()
    },
    getById: async (id) => {
        return CategoryRepository.getById(id)
    },
    create: async (data) => {
        return CategoryRepository.create(data)
    },
    async update(id, data) {
        return CategoryRepository.update(id, data)
    },
    async delete(id) {
        return CategoryRepository.delete(id)
    }
}
