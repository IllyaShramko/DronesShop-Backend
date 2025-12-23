import { Request, Response, NextFunction } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";
import { ENV } from "../config/env";

export function authMiddleware(req:Request, res: Response, next: NextFunction){
    try {
        const Authorization = req.headers.authorization
        if (!Authorization) {
            res.status(401).json({message: "authorization is required"})
            return
        }
        const [type, token] = Authorization.split(" ")
        if (type != "Bearer" || !token) {
            res.status(401).json({message: "wrong format autharization"})
            return
        }

        const payload = verify(token, ENV.JWT_ACCESS_SECRET_KEY)
        if (typeof payload == "string") {
            res.status(401).json({message: "Token wrong format"})
            return
        }

        res.locals.userId = payload.id

        next()
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({message: "You need to reload your token. It expired"})
            return
        }
        res.status(500).json({message: "Server error"})
    }
}