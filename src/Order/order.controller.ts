import { Request, Response } from "express"
import { OrderService } from "./order.service"
import { OrderControllerContract } from "./order.types"

export const OrderController: OrderControllerContract = {
    getAll: async (req, res) => {
        const orders = await OrderService.getAll()
        res.status(200).json(orders)
    },
    getById: async (req, res) => {
        if (!req.params.id){
            res.status(400).json("id is required");
            return
        }
        const id = +req.params.id
        if (isNaN(id)){
            res.status(400).json("id must be an integer");
            return;
        }
        try {
            const order = await OrderService.getById(id)
            if (!order){
                res.status(404).json("order not found")
                return;
            }
            res.json(order)
        }
        catch (error) {
            res.json("Internal Error")
        }
    },
    // create: async (req, res) => {
    //     const body = req.body
    //     if (!body) {
    //         res.status(422).json("Body is required.")
    //         return
    //     }
    //     if (!body.firstName) {
    //         res.status(422).json("firstName is required.")
    //         return
    //     }
    //     if (!body.lastName) {
    //         res.status(422).json("lastName is required.")
    //         return
    //     }
    //     if (!body.patronymic) {
    //         res.status(422).json("patronymic is required.")
    //         return
    //     }
    //     if (!body.birthday) {
    //         res.status(422).json("birthday is required.")
    //         return
    //     }
    //     if (!body.phoneNumber) {
    //         res.status(422).json("phoneNumber is required.")
    //         return
    //     }
    //     if (!body.email) {
    //         res.status(422).json("email is required.")
    //         return
    //     }
    //     if (!body.totalPrice) {
    //         res.status(422).json("totalPrice is required.")
    //         return
    //     }
    //     if (!body.discountPrice) {
    //         res.status(422).json("discountPrice is required.")
    //         return
    //     }
    //     if (!body.typePay) {
    //         res.status(422).json("typePay is required.")
    //         return
    //     }
    //     try {
    //         const userId = res.locals.userId
    //         const order = await OrderService.create({...body, userId})   
    //         res.status(201).json(order)
    //     }
    //     catch (error) {
    //         res.json(`Internal Error ${error}`)
    //     }
    // },
    delete: async (req, res) => {
        if (!req.params.id){    
            res.status(400).json("id is required");
            return
        }
        const id = +req.params.id
        if (isNaN(id)){
            res.status(400).json("id must be an integer");
            return
        }
        try {
            await OrderService.delete(id)
            res.status(204).json("Deleted")
        }
        catch (error) {
            res.json("Internal Error")
        }
    }
}