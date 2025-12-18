import { Router } from 'express'
import { UserController } from './user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

export const UserRouter: Router = Router()

UserRouter.post('/login', UserController.login)
UserRouter.post('/register', UserController.register)
UserRouter.get('/me', authMiddleware, UserController.me)
UserRouter.put('/me', authMiddleware, UserController.editInformation)