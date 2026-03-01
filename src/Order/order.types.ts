import { Prisma } from "../generated/prisma"
import { Request, Response } from 'express' 

export type Order = Prisma.OrderGetPayload<{}>

export type OrderWithProducts = Prisma.OrderGetPayload<{include: {products: {include: {product: true}}}}>

export type ErrorResponse = {message: string}

export type CreateOrder = Prisma.OrderCreateInput

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
        warehouse: string
        street?: string
    }
    paymentData: {
        type: "pay_on_place" | "pay_now"
    }
    productsToOrder: {
        id: number
        count: number
    }[]
}
export interface NPCity {
    Ref: string;
    Description: string;
    AreaDescription: string;
    SettlementTypeDescription: string;
}

export interface NPWarehouse {
    Ref: string;
    Description: string;
    ShortAddress: string;
    Number: string;
    TypeOfWarehouse: string;
    TotalMaxWeightAllowed: string;
}

export type GetCitiesCredentials = {
    cityName: string;
}

export type GetWarehousesCredentials = {
    cityRef: string;
    deliveryType: 'warehouse' | 'postomat';
}

export const NP_URL = 'https://api.novaposhta.ua/v2.0/json/';

export interface OrderServiceContract {
    getAll: () => Promise<Order[]>
    getById: (id: number) => Promise<Order | null>
    delete: (id: number) => Promise<Order | null | string>
    makeOrder: (credentials: MakeOrderCredentials, userId: number) => Promise<Order | null | ErrorResponse>
    getCities: (credentials: GetCitiesCredentials) => Promise<NPCity[]>
    getWarehouses: (credentials: GetWarehousesCredentials) => Promise<NPWarehouse[]>
}

export interface OrderRepositoryContract {
    getAll: () => Promise<Order[]>
    getById: (id: number) => Promise<Order | null>
    getByIdUser: (userId: number) => Promise<OrderWithProducts[]>
    delete: (id: number) => Promise<Order | null | string>
    createOrder: (
        mainCredentials: CreateOrder,
        products: {id: number; count: number}[],
        userId: number,
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
    getCities: (
        req: Request<object, NPCity[] | ErrorResponse, GetCitiesCredentials>, 
        res: Response<NPCity[] | ErrorResponse>
    ) => Promise<void>
    getWarehouses: (
        req: Request<object, NPWarehouse[] | ErrorResponse, GetWarehousesCredentials>, 
        res: Response<NPWarehouse[] | ErrorResponse>
    ) => Promise<void>
}