import { Request, Response, NextFunction } from "express";

export function pagginationMiddleware(req:Request, res: Response, next: NextFunction){
    let limit = req.query.limit
    let offset = req.query.offset
    
    if (limit) {

        if (isNaN(+limit)) {
            res.status(400).json("limit must be a number")
            return
        }
        else if (+limit < 0) {
            res.status(400).json("limit must be a positive integer")
            return
        }
        res.locals.limit = +limit
    } else {
        res.locals.limit = 5
    }
    if (offset) {
        if (isNaN(+offset)) {
            res.status(400).json("offset must be a number")
            return
        }
        else if (+offset < 0) {
            res.status(400).json("offset must be a positive integer")
            return
        }
        res.locals.offset = res.locals.limit * +offset
    } else {
        res.locals.offset = 0
    }
    
    next()
}