import { Prisma } from "../generated/prisma"
import { Request, Response } from 'express'

export type Order = Prisma.OrderGetPayload<{}>

export type CreateOrder = Prisma.OrderUncheckedCreateInput


export interface OrderControllerContract {

}

export interface OrderServiceContract {

}

export interface OrderRepositoryContract {

}