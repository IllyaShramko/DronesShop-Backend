import { Request, Response } from "express"
import { CategoryService } from "./category.service"
import { Category, CategoryControllerContract, CreateCategory, UpdateCategoryChecked } from "./category.types"

export const CategoryWithProducts: CategoryControllerContract = {
    getAll: async (req, res) => {
        let categoryId: any = req.query.categoryId
        if (categoryId) {
            categoryId = +categoryId
            if (isNaN(categoryId)) {
                res.status(400).json()
                return
            }
        }
        const categories = await CategoryService.getAll()
        res.status(200).json(categories)
    },
    getById: async (req, res) => {
        if (!req.params.id) {
            res.status(400).json("id is required")
            return
        }
        const id = +req.params.id
        console.log(id)
        if (isNaN(id)) {
            res.status(400).json("id must be an integer")
            return
        }
        try {
            const product = await CategoryService.getById(id)

            if (!product) {
                res.status(404).json("product not found")
                return
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
        if (!body.icon) {
            res.status(422).json("icon is required.")
            return
        }
        
        try {
            const newCategory = await CategoryService.create({...body})
            if (!newCategory) {
                res.status(404).json({message: "Category creation error"})
                return
            }
            res.status(200).json(newCategory)
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
        await CategoryService.update(+id, body).then((category) => {
            if (!category) {
                res.status(500).json("category update error")
                return
            }
            res.status(200).json(category)
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
        await CategoryService.delete(+id).then((result) => {
            if (result === "not found") {
                res.status(404).json("Category not found")
                return
            }
            else if (!result) {
                res.status(500).json("Category deletion error")
                return
            }
            res.status(200).json(result)
        })
    }
}
