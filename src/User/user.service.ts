import { UserServiceContract } from "./user.types"
import { UserRepository } from "./user.repository"
import { sign } from "jsonwebtoken"
import { ENV } from "../config/env"
import { StringValue } from 'ms'
import { compare, genSalt, hash } from "bcryptjs"
import { OrderRepository } from "../Order/order.repository" 
import { transporter } from "../config/mail"
import { CODE_LENGTH, passwordCodes } from "../config/passwordChangeData"

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
    async sendPasswordEmail(userId, userEmail) {
        function generateCode(){
            let code = ''
            for (let index = 0; index < CODE_LENGTH; index++){
                code+=`${Math.round(Math.random() * 9)}`
            }
            return code
        }
        const code = generateCode() 
        passwordCodes.push({code: code, userId: userId})
        transporter.sendMail({
            from: 'Dronees',
            to: userEmail,
            subject: "Password restoration",
            text: `Hello, you tried to restore password on our site, here is restoration code: ${code}`
        })
    },
    async checkCode(userId, codeCheck, autoDelete) {
        console.log(passwordCodes, "start")
        const possibleCodeArray = passwordCodes.filter(attempt => attempt.userId == userId)
        if (!possibleCodeArray.length){
            throw Error("NOT_FOUND")
        }
        for (let possibleCode of possibleCodeArray){
            if (possibleCode.code == codeCheck){
                for (let toDelete of possibleCodeArray){ passwordCodes.splice(passwordCodes.indexOf(toDelete), 1) }
                if (!autoDelete){
                    passwordCodes.push({code: "-1", userId: userId})
                }
                console.log(passwordCodes, "end")
                return true
            }
        }
        return false
    },
    async changePassword(id, newPassword){
        const verified = await this.checkCode(id, "-1")
        if (!verified){
            throw new Error("FORBIDDEN")
        }
        await this.checkCode(id, "-1", true)
        const hashedPassword = await hash(newPassword, 10)
        await UserRepository.changePassword(id, hashedPassword)
        const token = sign({ id: id }, ENV.JWT_ACCESS_SECRET_KEY, { expiresIn: ENV.JWT_EXPIRES_IN as StringValue })
        return token
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