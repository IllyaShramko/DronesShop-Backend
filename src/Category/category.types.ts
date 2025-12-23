import { Prisma } from "../generated/prisma"
import { Request, Response } from 'express'

export type Category = Prisma.CategoryGetPayload<{}>

export type CategoryWithProducts = Prisma.CategoryGetPayload<{include: {products: true}}>

export type CreateCategory = Prisma.CategoryUncheckedCreateInput
export type CreateCategoryChecked = Prisma.CategoryCreateInput

export type UpdateCategory = Prisma.CategoryUncheckedUpdateInput
export type UpdateCategoryChecked = Prisma.CategoryUpdateInput

export interface CategoryServiceContract {
    getAll: () => Promise<Category[]>
    getById: (id: number) => Promise<Category | null>
    create: (data: CreateCategory) => Promise<Category | null>
    update: (id: number, data: UpdateCategoryChecked) => Promise<Category | null>
    delete: (id: number) => Promise<Category | null | string>
}

export interface CategoryRepositoryContract {
    getAll: () => Promise<Category[]>
    getById: (id: number) => Promise<Category | null>
    create: (data: CreateCategory) => Promise<Category>
    update: (id: number, data: UpdateCategory) => Promise<Category | null>
    delete: (id: number) => Promise<Category | null | string>
}

export interface CategoryControllerContract {
    getAll: (req: Request<object, Category[] | string, object>, res: Response<Category[] | string | object>) => Promise<void>
    getById: (req: Request<{id: string}, Category | string, object>, res: Response<Category| string | object | null>) => void,
    create: (req: Request<object, Category | string, CreateCategory, object>, res: Response<Category | string | object | null>) => Promise<void>
    update: (req: Request<{ id: string }, Category | string, UpdateCategoryChecked, object>, res: Response<Category | string | object>) => Promise<void>
    delete: (req: Request<{ id: string }, Category | string, object>, res: Response<Category | string | object>) => Promise<void>
}