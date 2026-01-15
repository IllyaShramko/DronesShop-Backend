import { Prisma } from "../generated/prisma"
import { Request, Response } from 'express'

export type Product = Prisma.ProductGetPayload<{}>

export type ProductWithInfo = Prisma.ProductGetPayload<{include: {blocksInfo: {include: {params: true}}}}>

export type CreateProduct = Prisma.ProductUncheckedCreateInput
export type CreateProductChecked = Prisma.ProductCreateInput

export type UpdateProduct = Prisma.ProductUncheckedUpdateInput
export type UpdateProductChecked = Prisma.ProductUpdateInput

export interface ProductServiceContract {
    getAll: (categoryId?: number) => Promise<Product[]>
    getById: (id: number) => Promise<ProductWithInfo | null>
    create: (data: CreateProduct) => Promise<Product | null>
    update: (id: number, data: UpdateProductChecked) => Promise<Product | null>
    delete: (id: number) => Promise<Product | null | string>
    getSuggestions: (popular?: boolean, isNew?: boolean, limit?: number, offset?: number) => Promise<Product[]>
}

export interface ProductRepositoryContract {
    getAll: (categoryId?: number) => Promise<Product[]>
    getById: (id: number) => Promise<ProductWithInfo | null>
    create: (data: CreateProduct) => Promise<Product>
    update: (id: number, data: UpdateProduct) => Promise<Product | null>
    delete: (id: number) => Promise<Product | null | string>
    getSuggestions: (popular?: boolean, isNew?: boolean, limit?: number, offset?: number) => Promise<Product[]>
}

export interface ProductControllerContract {
    getAll: (req: Request<object, Product[] | string, object, {categoryId?: number}>, res: Response<Product[] | string | object>) => Promise<void>
    getById: (req: Request<{id: string}, Product | string, object>, res: Response<ProductWithInfo | string | object | null>) => Promise<void>,
    create: (req: Request<object, Product | string, CreateProduct, object>, res: Response<Product | string | object | null>) => Promise<void>
    update: (req: Request<{ id: string }, Product | string, UpdateProductChecked, object>, res: Response<Product | string | object>) => Promise<void>
    delete: (req: Request<{ id: string }, Product | string, object>, res: Response<Product | string | object>) => Promise<void>
    getSuggestions: (req: Request<object, Product[] | string, object, {popular?: boolean, new?: boolean, limit?: number, offset?: number}>, res: Response<Product[] | string | object>) => Promise<void>
}