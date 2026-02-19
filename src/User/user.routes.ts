import { Router } from 'express'
import { UserController } from './user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

export const UserRouter: Router = Router()

UserRouter.post('/login', UserController.login)
UserRouter.post('/register', UserController.register)
// 
UserRouter.post('/password', UserController.startPasswordReset)
UserRouter.post('/password/verify', UserController.verifyPasswordCode)
UserRouter.post('/password/change', UserController.resetPassword)
// 
UserRouter.get('/me', authMiddleware, UserController.me)
UserRouter.put('/me', authMiddleware, UserController.editInformation)
// 
UserRouter.get('/addresses', authMiddleware, UserController.getAdresses)
UserRouter.post('/addresses', authMiddleware, UserController.createAddress)
UserRouter.put('/addresses/:id', authMiddleware, UserController.editAddress)
// 
UserRouter.get("/orders", authMiddleware, UserController.getMyOrders)
// 
UserRouter.post("/contact", UserController.sendContactMail)