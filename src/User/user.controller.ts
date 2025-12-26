import { UserControllerContract } from "./user.types"
import { UserService} from './user.service'
import { TokenExpiredError, verify } from 'jsonwebtoken'
import { ENV } from '../config/env'
import { CODE_LENGTH } from "../config/passwordChangeData"

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
                    case "NOT_FOUND":
                        res.status(401).json({message: 'wrong credentials'})
                        return
                    case "WRONG_CREDENTIALS":
                        res.status(401).json({message: 'wrong credentials'})
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
            const addressData = {...req.body, userId: res.locals.userId}
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
    async startPasswordChange(request, response) {
        try{
            const newEmail = request.body.email
            if (!newEmail){
                response.status(400).json({message: "Email is not specified"})
                return
            }
            await UserService.sendPasswordEmail(response.locals.userId, newEmail)
            response.status(200).json("OK")
        }
        catch(error){
            console.log(`Unexpected error occured at UserController\nError: \n\n${error}`)
            response.status(500).json({message: "Internal Server Error"})
        }
    },
    async verifyPasswordCode(request, response) {
        try{
            const code = request.params.code
            if (!code){
                response.status(400).json({message: "You need to provide valid code"})
                return
            }
            if (code.length != CODE_LENGTH){
                response.status(400).json({message: "You need to provide valid code"})
            }
            response.status(200).json({success: await UserService.checkCode(response.locals.userId, code)})
        }
        catch(error){
            if (error instanceof Error){
                if (error.message == "NOT_FOUND"){
                    response.status(404).json({message: "You didnt ask for restoration."})
                    return
                }
            }
            console.log(`Unexpected error occured at UserController\nError: \n\n${error}`)
            response.status(500).json({message: "Internal Server Error"})
        }
    },
    async changePassword(request, response){
        try{    
            const body = request.body
            if (!body.password){
                response.status(400).json({message: "New password is missing"})
            }
            response.status(200).json({token: await UserService.changePassword(response.locals.userId, body.password)})
        }
        catch(error){
            if (error instanceof Error){
                if (error.message == "NOT_FOUND"){
                    response.status(404).json({message: "You didnt ask for restoration."})
                    return
                }
                if (error.message == "FORBIDDEN"){
                    response.status(403).json({message: "You have not verified your email."})
                    return
                }
            }
            console.log(`Unexpected error occured at UserController\nError: \n\n${error}`)
            response.status(500).json({message: "Internal Server Error"})
        }
    },
}