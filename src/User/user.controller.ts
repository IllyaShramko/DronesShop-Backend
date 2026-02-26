import { UserControllerContract } from "./user.types"
import { UserService} from './user.service'
import { TokenExpiredError, verify } from 'jsonwebtoken'
import { ENV } from '../config/env'

export const UserController: UserControllerContract = {
    login: async(req, res) =>{
        try {
            let body = req.body
            
            if (!body){
                res.status(400).json({ message: 'body is required' })
                return
            }
            const token = await UserService.login(body)
            res.status(200).json({token})
        } catch (error) {
            console.log(error)
            if(error instanceof Error){
                switch (error.message) {
                    case "USER_NOT_FOUND":
                        res.status(401).json({message: 'wrong credentials'})
                        return
                    case "WRONG_CREDENTIALS":
                        res.status(401).json({message: 'wrong credentials'})
                        return
                }
            }   
            res.status(500).json({message: 'server error'})
        }
    },
    register: async(req, res) =>{
        try {
            let body = req.body
            if (!body){
                res.status(400).json({ message: 'body is required' })
                return
            }
            if (!body.firstName){
                res.status(400).json({ message: 'firstName is required' })
                return
            }
            if (!body.email){
                res.status(400).json({ message: 'email is required' })
                return
            }
            if (!body.password){
                res.status(400).json({ message: 'password is required' })
                return
            }
            const token = await UserService.register(body)
            res.status(200).json({token})
        } catch (error) {
            console.log(error)
            if(error instanceof Error){
                switch (error.message) {
                    case "USER_EXISTS":
                        res.status(401).json({message: 'wrong credentials'})
                        return
                    }
                }
            res.status(500).json({message: 'server error'})
        }
    },
    me: async(req, res) => {
        try {
            const user = await UserService.me(res.locals.userId)
            if (!user) {
                res.status(404).json({message: "User not found"})
                return
            }
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})
        }
    },
    editInformation: async(req, res) => {
        try {
            const updatedUser = await UserService.editInformation(res.locals.userId, req.body)
            if (!updatedUser) {
                res.status(404).json({message: "User not found"})
                return
            }
            res.status(200).json(updatedUser)
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})
        }
    },
    getAdresses: async(req, res) => {
        try {
            const addresses = await UserService.getAdresses(res.locals.userId)
            res.status(200).json(addresses)
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})
        }
    },
    createAddress: async(req, res) => {
        try {
            if (!req.body) {
                res.status(400).json({message: "body is required"})
                return
            }
            if (!req.body.city) {
                res.status(400).json({message: 'city is required'})
                return
            }
            if (!req.body.street) {
                res.status(400).json({message: 'street is required'})
                return
            }
            if (!req.body.houseNumber) {
                res.status(400).json({message: 'houseNumber is required'})
                return
            }
            if (isNaN(+req.body.houseNumber)) {
                res.status(400).json({message: 'houseNumber must be a number'})
                return
            }
            
            if (!req.body.apartamentNumber) {
                res.status(400).json({message: 'apartamentNumber is required'})
                return
            }
            if (isNaN(+req.body.apartamentNumber)) {
                res.status(400).json({message: 'apartamentNumber must be a number'})
                return
            }
            if (!req.body.entranceNumber) {
                res.status(400).json({message: 'entranceNumber is required'})
                return
            }
            if (isNaN(+req.body.entranceNumber)) {
                res.status(400).json({message: 'entranceNumber must be a number'})
                return
            }
            const addressData = {...req.body, userId: res.locals.userId, houseNumber: +req.body.houseNumber, apartamentNumber: +req.body.apartamentNumber, entranceNumber: +req.body.entranceNumber}
            const address = await UserService.createAddress(addressData)
            res.status(200).json(address)
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})
        }
    },
    editAddress: async(req, res) => {
        const addressId = +req.params.id
        if (isNaN(addressId)){
            res.status(400).json({message: 'address id must be a number'})
            return
        }
        try {
            const address = await UserService.editAddress(addressId, req.body)
            res.status(200).json(address)
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})
        }
    },
    getMyOrders: async(req, res) => {
        try {
            const userId =  res.locals.userId
            const orders = await UserService.getMyOrders(userId)
            res.status(200).json(orders)
        } catch (error){
            console.log(error)
            res.status(500).json({message: 'server error'})
        }
    },
    async startPasswordReset(req, res) {
        try{
            const { email, url } = req.body
            if (!email){
                res.status(400).json({message: "Email is not specified"})
                return
            }
            await UserService.startPasswordReset(email, url)
            res.status(200).json({message: "OK"})
        }
        catch(error){
            if (error instanceof Error && error.message === "USER_DOESNT_EXISTS") {
                res.status(404).json({message: "USER_DOESNT_EXISTS"})
                return
            }
            console.log(`Unexpected error occured at UserController\nError: \n\n${error}`)
            res.status(500).json({message: "Internal Server Error"})
        }
    },
    async verifyPasswordCode(req, res) {
        try{
            const { code } = req.body
            if (!code){
                res.status(400).json({message: "Code is not specified"})
                return
            }
            const result = await UserService.verifyPasswordCode(code)
            res.status(200).json(result)
        }
        catch(error){
            console.log(`Unexpected error occured at UserController\nError: \n\n${error}`)
            res.status(500).json({message: "Internal Server Error"})
        }
    },
    async resetPassword(req, res){
        try{    
            const { code, email, newPassword } = req.body
            console.log(req.body)
            if (!code || !email || !newPassword){
                res.status(400).json({message: "Code, email and newPassword are required"})
                return
            }
            const result = await UserService.resetPassword(code, email, newPassword)
            if (result.message !== "SUCCESS") {
                res.status(400).json(result)
                return
            }
            res.status(200).json(result)
        }
        catch(error){
            console.log(`Unexpected error occured at UserController\nError: \n\n${error}`)
            res.status(500).json({message: "Internal Server Error"})
        }
    },
    async sendContactMail(req, res){
        try {
            const {name, phonenumber, email, message} = req.body
            if (!name){
                res.status(400).json({message: "Name is required"})
                return
            }
            if (!phonenumber){
                res.status(400).json({message: "Phone number is required"})
                return
            }
            if (!email){
                res.status(400).json({message: "Email is required"})
                return
            }
            if (!message){
                res.status(400).json({message: "Message is required"})
                return
            }
            await UserService.sendContactMail(name, phonenumber, email, message)
            res.status(200).json({message: "OK"})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Internal Server Error"})
        }
    }
}