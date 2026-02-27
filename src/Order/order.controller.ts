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
    },
    makeOrder: async (req, res) => {
        if (!req.body) {
            res.status(400).json({message: "Body is required."})
            return
        }
        // 
        if (!req.body.userData) {
            res.status(400).json({message: "userData is required."})
            return
        }
        if (!req.body.userData.secondName) {
            res.status(400).json({message: "secondName in userData is required."})
            return
        }
        if (!req.body.userData.firstName) {
            res.status(400).json({message: "firstName in userData is required."})
            return
        }
        if (!req.body.userData.patronymic) {
            res.status(400).json({message: "patronymic in userData is required."})
            return
        }
        if (!req.body.userData.phoneNumber) {
            res.status(400).json({message: "phoneNumber in userData is required."})
            return
        }
        if (!req.body.userData.email) {
            res.status(400).json({message: "email in userData is required."})
            return
        }
        // 
        if (!req.body.deliveryData) {
            res.status(400).json({message: "deliveryData is required."})
            return
        }
        if (!req.body.deliveryData.city) {
            res.status(400).json({message: "city in deliveryData is required."})
            return
        }
        if (!req.body.deliveryData.pickUpPoint) {
            res.status(400).json({message: "pickUpPoint in deliveryData is required."})
            return
        }
        // 
        if (!req.body.paymentData) {
            res.status(400).json({message: "paymentData is required."})
            return
        }
        if (!req.body.paymentData.type) {
            res.status(400).json({message: 'type in deliveryData must be "pay_on_place" or "pay_now".'})
            return
        }
        // 
        if (!req.body.productsToOrder) {
            res.status(400).json({message: "productsToOrder is required."})
            return
        }
        if (req.body.productsToOrder.length === 0) {
            res.status(400).json({message: "Products in productToOrder is required"})
            return
        }
        try {
            req.body.productsToOrder.forEach((product, index) => {
                if (!product.id) {
                    res.status(400).json({message: `In product (idx: ${index}) id is required`})
                    throw Error()
                } else if (isNaN(+product.id)) {
                    res.status(400).json({message: `In product (idx: ${index}) id must be number`})
                    throw Error()
                } else {
                    product.id = +product.id
                }
                if (!product.count) {
                    res.status(400).json({message: `In product (idx: ${index}) count is required`})
                    throw Error()
                } else if (isNaN(+product.count)) {
                    res.status(400).json({message: `In product (idx: ${index}) count must be number`})
                    throw Error()
                } else {
                    product.count = +product.count
                }
            })
        } catch (error) {
            console.log(Error)
            return
        }
        const order = await OrderService.makeOrder(req.body, res.locals.userId)
        // 
        res.status(200).json(order)
        return
    },
}