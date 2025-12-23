import { Prisma } from "../generated/prisma"
import { Request, Response } from 'express' 

export type Order = Prisma.OrderGetPayload<{}>
export type CreateOrder = Prisma.OrderUncheckedCreateInput
export type OrderWithProducts = Prisma.OrderGetPayload<{include: {order: true}}>


export type Create = Prisma.OrderUncheckedCreateInput
export type CreateOrderChecked = Prisma.OrderCreateInput

export type UpdateOrder = Prisma.OrderUncheckedUpdateInput
export type UpdateOrderChecked = Prisma.OrderUpdateInput

export interface OrderServiceContract {
    getAll: () => Promise<Order[]>
    getById: (id: number) => Promise<Order | null>
    create: (data: CreateOrder) => Promise<Order | null>
    update: (id: number, data: UpdateOrderChecked) => Promise<Order | null>
    delete: (id: number) => Promise<Order | null | string>
}

export interface OrderRepositoryContract {
    getAll: () => Promise<Order[]>
    getById: (id: number) => Promise<Order | null>
    create: (data: CreateOrder) => Promise<Order>
    update: (id: number, data: UpdateOrder) => Promise<Order | null>
    delete: (id: number) => Promise<Order | null | string>
}

export interface OrderControllerContract {
    getAll: (req: Request<object, Order[] | string, object>, res: Response<Order[] | string | object>) => Promise<void>
    getById: (req: Request<{id: string}, Order | string, object>, res: Response<Order | string | object | null>) => void,
    create: (req: Request<object, Order | string, CreateOrder, object>, res: Response<Order | string | object | null>) => Promise<void>
    update: (req: Request<{ id: string }, Order | string, UpdateOrderChecked, object>, res: Response<Order | string | object>) => Promise<void>
    delete: (req: Request<{ id: string }, Order | string, object>, res: Response<Order | string | object>) => Promise<void>
}