import { Request, Response } from "express"
import { Prisma } from "../generated/prisma"

export type User = Prisma.UserGetPayload<{}>
export type UserWithoutPassword = Prisma.UserGetPayload<{omit: {password: true}}>
export type ErrorResponse = {message: string}
export type UserAuthResponse = {token: string}

export type UserCreate = Prisma.UserUncheckedCreateInput

export type UserUpdate = Prisma.UserUpdateInput

export interface LoginCredentials {
    email: string,
    password: string
}

export interface UserControllerContract {
    register: (req: Request<object, ErrorResponse | UserAuthResponse, UserCreate>, res: Response<ErrorResponse | UserAuthResponse>) => Promise<void>
    login: (req: Request<object, ErrorResponse | UserAuthResponse, LoginCredentials>, res: Response<ErrorResponse | UserAuthResponse>) => Promise<void>
    me: (req: Request<object, ErrorResponse | UserWithoutPassword, object, object, {userId: number}>, res: Response<ErrorResponse | UserWithoutPassword, {userId: number}>) => Promise<void>,
    editInformation: (req: Request<object, ErrorResponse | UserWithoutPassword, UserUpdate, object, {userId: number}>, res: Response<ErrorResponse | UserWithoutPassword, {userId: number}>) => Promise<void>,
}

export interface UserRepositoryContract {
    create: (credentials: UserCreate) => Promise<User >,
    findByEmail: (email: string) => Promise<User | null>,
    findByIdWithoutPassword: (id: number) => Promise<UserWithoutPassword | null>,
    editInformation: (id: number, data: UserUpdate) => Promise<UserWithoutPassword>,
}
export interface UserServiceContract {
    register: (credentials: UserCreate) => Promise<string>,
    login: (credentials: LoginCredentials) => Promise<string>,
    me: (id: number) => Promise<UserWithoutPassword | null>,
    editInformation: (id: number, data: UserUpdate) => Promise<UserWithoutPassword>,
}