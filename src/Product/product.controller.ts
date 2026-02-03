import { Request, Response } from "express"
import { ProductService } from "./product.service"
import { ProductControllerContract } from "./product.types"
import { off } from "node:process"

export const ProductController: ProductControllerContract = {
    getAll: async (req, res) => {
        let categoryId = req.query.categoryId
        let limit = res.locals.limit
        let offset = res.locals.offset
        if (categoryId) {
            categoryId = +categoryId
            if (isNaN(categoryId)) {
                res.status(400).json()
                return
            }
        }
        const products = await ProductService.getAll(categoryId, limit, offset)
        res.status(200).json(products)
    },
    getById: async (req, res) => {
        if (!req.params.id){
            res.status(400).json("id is required");
            return
        } 
        const id = +req.params.id
        console.log(id)
        if (isNaN(id)){
            res.status(400).json("id must be an integer");
            return;
        }
        try {
            const product = await ProductService.getById(id)
            
            if (!product){
                res.status(404).json("product not found")
                return;
            }
            
            res.json(product)
        }
        catch (error) {
            res.json("Internal Error")
        }

    },
    create: async (req, res) => {
        console.log(req.body)
        const body = req.body
        if (!body) {
            res.status(422).json("Body is required.")
            return
        }
        if (!body.name) {
            res.status(422).json("name is required.")
            return
        }
        if (!body.description) {
            res.status(422).json("description is required.")
            return
        }
        if (!body.previewPhoto) {
            res.status(422).json("image url is required.")
            return
        }
        if (!body.categoryId) {
            res.status(422).json("category ID is required.")
            return
        }
        
        try {
            const newProduct = await ProductService.create({...body})
            if (!newProduct) {
                res.status(404).json({message: "Product creation error"})
                return
            }
            res.status(200).json(newProduct)
        } catch (error) {
            res.status(500).json({message: "Internal server error"})
        }
    },
    async update(req, res) {
        const id = req.params.id
        if (!id){
            res.status(400).json("id is required");
            return
        }
        if (isNaN(+id)){
            res.status(400).json("id must be an integer");
            return;
        }
        const body = req.body
        await ProductService.update(+id, body).then((product) => {
            if (!product) {
                res.status(500).json("Product update error")
                return
            }
            res.status(200).json(product)
        })

    },
    async delete(req, res) {
        const id = req.params.id
        if (!id){
            res.status(400).json("id is required");
            return
        }
        if (isNaN(+id)){
            res.status(400).json("id must be an integer");
            return;
        }
        await ProductService.delete(+id).then((result) => {
            if (result === "not found") {
                res.status(404).json("Product not found")
                return
            }
            else if (!result) {
                res.status(500).json("Product deletion error")
                return
            }
            res.status(200).json(result)
        })
    },
    async getSuggestions(req, res) {
        let popular = req.query.popular
        let isNew = req.query.new
        let limit = res.locals.limit
        let offset = res.locals.offset
        let sameAs = req.query.sameAs

        if (popular && isNew) {
            res.status(400).json("Only one of parameters (popular or new) can be specified")
            return
        }
        if (sameAs) {
            if (isNaN(+sameAs)) {
                res.status(400).json("offset must be a number")
                return
            }
            else if (+sameAs < 0) {
                res.status(400).json("offset must be a positive integer")
                return
            }
            sameAs = +sameAs
        }
        const products =  await ProductService.getSuggestions(
            popular, isNew, limit, offset, sameAs
        )
        res.status(200).json(products)
    },
    
}