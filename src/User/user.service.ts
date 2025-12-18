import { UserServiceContract } from "./user.types"
import { UserRepository } from "./user.repository"
import { sign } from "jsonwebtoken"
import { ENV } from "../config/env"
import { StringValue } from 'ms'
import { compare, genSalt, hash } from "bcryptjs"

export const UserService: UserServiceContract = {
    async register (credentials){
        const user = await UserRepository.findByEmail(credentials.email)
        if (user){
            throw new Error("USER_EXISTS")
        }
        const hashedPassword = await hash(credentials.password, 10)
        const hashedCredentials = {
            ...credentials,
            password: hashedPassword
        }
        const newUser = await UserRepository.create(hashedCredentials)
        const token = sign({id: newUser.id}, ENV.JWT_ACCESS_SECRET_KEY, {
            expiresIn: ENV.JWT_EXPIRES_IN as StringValue
        })
        return token
    },
    async login(credentials) {
        const user = await UserRepository.findByEmail(credentials.email)

        if (!user){
            throw new Error("USER_NOT_FOUND")
        }

        const isMatch = await compare(credentials.password, user.password)
        if(!isMatch){
            throw new Error("WRONG_CREDENTIALS")
        }

        const token = sign({id: user.id}, ENV.JWT_ACCESS_SECRET_KEY, {
            expiresIn: ENV.JWT_EXPIRES_IN as StringValue
        })
        return token
    },
    async me(id){
        const user = await UserRepository.findByIdWithoutPassword(+id)
        return user
    },
    async editInformation(id, data){
        const updatedUser = await UserRepository.editInformation(id, data)
        return updatedUser
    }
}