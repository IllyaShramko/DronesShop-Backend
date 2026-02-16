import { Request, Response } from "express"
import { Prisma } from "../generated/prisma"
import { OrderWithProducts } from "../Order/order.types"
export type User = Prisma.UserGetPayload<{}>
export type UserWithoutPassword = Prisma.UserGetPayload<{omit: {password: true}}>

export type Address = Prisma.AddressGetPayload<{}>
export type CreateAddress = Prisma.AddressUncheckedCreateInput
export type UpdateAddress = Prisma.AddressUncheckedUpdateInput

export type VerifyCode = Prisma.VerificationCodeGetPayload<{}>

export type ErrorResponse = {message: string}
export type UserAuthResponse = {token: string}

export type UserCreate = Prisma.UserUncheckedCreateInput

export type UserUpdate = Prisma.UserUpdateInput

export interface LoginCredentials {
    email: string,
    password: string
}
export interface ForgotPasswordCredentials {
    email: string,
    newPassword: string
}
export interface AuthResponse {
    token: string
}

export interface PasswordChangeResponse{
    success: boolean
}

export interface UserControllerContract {
    register: (req: Request<object, ErrorResponse | UserAuthResponse, UserCreate>, res: Response<ErrorResponse | UserAuthResponse>) => Promise<void>
    login: (req: Request<object, ErrorResponse | UserAuthResponse, LoginCredentials>, res: Response<ErrorResponse | UserAuthResponse>) => Promise<void>
    me: (req: Request<object, ErrorResponse | UserWithoutPassword, object, object, {userId: number}>, res: Response<ErrorResponse | UserWithoutPassword, {userId: number}>) => Promise<void>,
    editInformation: (req: Request<object, ErrorResponse | UserWithoutPassword, UserUpdate, object, {userId: number}>, res: Response<ErrorResponse | UserWithoutPassword, {userId: number}>) => Promise<void>,
    getAdresses: (req: Request<object, ErrorResponse | Address[], object, object, {userId: number}>, res: Response<ErrorResponse | Address[], {userId: number}>) => Promise<void>,
    createAddress: (req: Request<object, ErrorResponse | Address, CreateAddress, object, {userId: number}>, res: Response<ErrorResponse | Address, {userId: number}>) => Promise<void>,
    editAddress: (req: Request<{id: string}, ErrorResponse | Address, UpdateAddress, object, {userId: number}>, res: Response<ErrorResponse | Address, {userId: number}>) => Promise<void>
    getMyOrders: (req: Request<object, ErrorResponse | OrderWithProducts[], object, object, {userId: number}>, res: Response<ErrorResponse | OrderWithProducts[], {userId: number}>) => Promise<void>
    
    changePassword(request: Request<object, ErrorResponse | AuthResponse, {password: string}, object, {userId: number}>, response: Response<ErrorResponse | AuthResponse, {userId: number}>): Promise<void>;
    startPasswordChange(request: Request<object, ErrorResponse | "OK", {email: string}, object, {userId: number}>, response: Response<ErrorResponse | "OK", {userId: number}>): Promise<void>;
    verifyPasswordCode(request: Request<{code: string}, ErrorResponse | PasswordChangeResponse, object, object, {userId: number}>, response: Response<ErrorResponse | PasswordChangeResponse, {userId: number}>): Promise<void>;
    
    sendContactMail(req: Request<object, ErrorResponse | "OK", {name: string, phonenumber: string, email: string, message: string}, object>, res: Response<ErrorResponse | "OK">): Promise<void>
}

export interface UserRepositoryContract {
    create: (credentials: UserCreate) => Promise<User >,
    findByEmail: (email: string) => Promise<User | null>,
    findByIdWithoutPassword: (id: number) => Promise<UserWithoutPassword | null>,
    editInformation: (id: number, data: UserUpdate) => Promise<UserWithoutPassword>,
    getAdressesByUserId: (userId: number) => Promise<Address[]>,
    createAddress: (data: CreateAddress) => Promise<Address>,
    editAddress: (id: number, data: UpdateAddress) => Promise<Address>,
    changePassword(id: number, newPassword: string): Promise<UserWithoutPassword>
    // saveContactMail(email: string, message: string): Promise<void>
}
export interface UserServiceContract {
    register: (credentials: UserCreate) => Promise<string>,
    login: (credentials: LoginCredentials) => Promise<string>,
    me: (id: number) => Promise<UserWithoutPassword | null>,
    editInformation: (id: number, data: UserUpdate) => Promise<UserWithoutPassword>,
    getAdresses: (userId: number) => Promise<Address[]>,
    createAddress: (data: CreateAddress) => Promise<Address>,
    editAddress: (id: number, data: UpdateAddress) => Promise<Address>,
    getMyOrders: (userId: number) => Promise<OrderWithProducts[]>
    sendPasswordEmail(userId: number, userEmail: string): Promise<void>
    checkCode(userId: number, code: string, autoDelete?: boolean): Promise<boolean>
    changePassword(id: number, newPassword: string): Promise<string>
    sendContactMail(name: string, phonenumber: string, email: string, message: string): Promise<string>
} 