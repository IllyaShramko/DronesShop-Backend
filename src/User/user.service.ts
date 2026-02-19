import { UserServiceContract } from "./user.types"
import { UserRepository } from "./user.repository"
import { sign } from "jsonwebtoken"
import { ENV } from "../config/env"
import { StringValue } from 'ms'
import { compare, genSalt, hash } from "bcryptjs"
import { OrderRepository } from "../Order/order.repository" 
import { transporter } from "../config/mail"

const CODE_LENGTH = 10


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
    },
    async getAdresses(userId){
        const addresses = await UserRepository.getAdressesByUserId(userId)
        return addresses
    },
    async createAddress(data){
        const address = await UserRepository.createAddress(data)
        return address
    },
    async editAddress(id, data){
        const address = await UserRepository.editAddress(id, data)
        return address
    },
    async getMyOrders (userId){
        const orders = await OrderRepository.getByIdUser(userId)
        return orders
    },
    async startPasswordReset(email, url) {
        const user = await UserRepository.findByEmail(email)
        if (!user) {
            throw new Error("USER_DOESNT_EXISTS")
        }
        function generateCode(){
            let code = ''
            for (let index = 0; index < CODE_LENGTH; index++){
                code+=`${Math.round(Math.random() * 9)}`
            }
            return code
        }
        const code = generateCode()
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
        await UserRepository.createVerificationCode({
            email,
            code,
            expiresAt,
            userId: user.id
        })
        transporter.sendMail({
            from: 'Dronees',
            to: email,
            subject: "Password restoration",
            text: `To reset your password, please use the following url: ${url}?code=${code}. This code will expire in 15 minutes.\nIf you didn't request a password reset, please ignore this email.`
        })
    },
    async verifyPasswordCode(code) {
        const verificationCode = await UserRepository.findVerificationCode(code)
        if (!verificationCode) {
            return { message: "CODE_DOESNT_EXISTS" }
        }
        if (verificationCode.expiresAt < new Date()) {
            return { message: "CODE_EXPIRED" }
        }
        return { message: "SUCCESS" }
    },
    async resetPassword(code, email, newPassword) {
        const verificationCode = await UserRepository.findVerificationCode(code)
        if (!verificationCode) {
            return { message: "CODE_DOESNT_EXISTS" }
        }
        if (verificationCode.email !== email) {
            return { message: "CODE_DOESNT_MATCH_EMAIL" }
        }
        if (verificationCode.expiresAt < new Date()) {
            return { message: "CODE_EXPIRED" }
        } 
        await UserRepository.updateVerificationCode(verificationCode.id, { expiresAt: new Date() })
        const hashedPassword = await hash(newPassword, 10)
        await UserRepository.resetPassword(email, hashedPassword)
        return { message: "SUCCESS" }
    },
    async sendContactMail(name, phonenumber, email, message){
        transporter.sendMail({
            from: 'Dronees',
            to: ENV.CONTACT_EMAIL,
            subject: `Письмо від користувача ${name} сайту`,
            text: `Від користувача ${name} було отримано повідомлення:\nІм'я: ${name}\nНомер телефону: ${phonenumber}\nEmail: ${email}\nПовідомлення: ${message}`
        })
        return "OK"
    }
}