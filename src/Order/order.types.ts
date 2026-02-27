import { promises } from "nodemailer/lib/xoauth2"
import { Prisma } from "../generated/prisma"
import { Request, Response } from 'express' 

export type Order = Prisma.OrderGetPayload<{}>

export type OrderWithProducts = Prisma.OrderGetPayload<{include: {products: {include: {product: true}}}}>

export type ErrorResponse = {message: string}

export type CreateOrder = Prisma.OrderCreateInput

export type CreateAddressForOrder = Prisma.AddressCreateWithoutOrderInput

export type MakeOrderCredentials = {
    userData: {
        secondName: string
        firstName: string
        patronymic: string
        phoneNumber: string
        email: string
        wishes?: string
    }
    deliveryData: {
        city: string
        pickUpPoint: string
    }
    paymentData: {
        type: "pay_on_place" | "pay_now"
    }
    productsToOrder: {
        id: number
        count: number
    }[]
}

export interface OrderServiceContract {
    getAll: () => Promise<Order[]>
    getById: (id: number) => Promise<Order | null>
    delete: (id: number) => Promise<Order | null | string>
    makeOrder: (credentials: MakeOrderCredentials, userId: number) => Promise<Order | null | ErrorResponse>
}

export interface OrderRepositoryContract {
    getAll: () => Promise<Order[]>
    getById: (id: number) => Promise<Order | null>
    getByIdUser: (userId: number) => Promise<OrderWithProducts[]>
    delete: (id: number) => Promise<Order | null | string>
    createOrder: (
        mainCredentials: CreateOrder,
        products: {id: number; count: number}[],
        addressCredentials: CreateAddressForOrder,
        userId: number
    ) => Promise<Order | ErrorResponse>
}

export interface OrderControllerContract {
    getAll: (req: Request<object, Order[] | string, object>, res: Response<Order[] | string | object>) => Promise<void>
    getById: (req: Request<{id: string}, Order | string, object>, res: Response<Order | string | object | null>) => void
    delete: (req: Request<{id: string}, Order | string, object>, res: Response<Order | string | object>) => Promise<void>
    makeOrder: (
        req: Request<object, Order | ErrorResponse, MakeOrderCredentials, object, {userId: number}>,
        res: Response<Order | ErrorResponse>
    ) => Promise<void>
}