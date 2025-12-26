import { Prisma } from "../generated/prisma"
import { Request, Response } from 'express' 

export type Order = Prisma.OrderGetPayload<{}>
export type OrderWithProducts = Prisma.OrderGetPayload<{include: {products: {include: {product: true}}}}>

export interface OrderServiceContract {
    getAll: () => Promise<Order[]>
    getById: (id: number) => Promise<Order | null>
    delete: (id: number) => Promise<Order | null | string>
}

export interface OrderRepositoryContract {
    getAll: () => Promise<Order[]>
    getById: (id: number) => Promise<Order | null>
    getByIdUser: (userId: number) => Promise<OrderWithProducts[]>
    delete: (id: number) => Promise<Order | null | string>
}

export interface OrderControllerContract {
    getAll: (req: Request<object, Order[] | string, object>, res: Response<Order[] | string | object>) => Promise<void>
    getById: (req: Request<{id: string}, Order | string, object>, res: Response<Order | string | object | null>) => void,
    delete: (req: Request<{ id: string }, Order | string, object>, res: Response<Order | string | object>) => Promise<void>
}