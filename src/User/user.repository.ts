import { UserRepositoryContract } from "./user.types"
import { PrismaClient as PC, Prisma } from "../generated/prisma"; 

const Client = new PC()



export const UserRepository: UserRepositoryContract = {
    async create(credentials) {
        return await Client.user.create({data: credentials})
    },
    async findByEmail(email) {
        const user = await Client.user.findUnique({
            where:{email:email}
        })
        return user
    },
    async findByIdWithoutPassword(id){
        const user = await Client.user.findUnique({
            where:{id},
            omit:{password: true}
        })
        return user
    },
    async editInformation(id, data){
        const updatedUser = await Client.user.update({
            where: {id},
            data,
            omit: {password: true}
        })
        return updatedUser
    }
}