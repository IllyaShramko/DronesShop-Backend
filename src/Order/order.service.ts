import { CreateAddressForOrder, CreateOrder, Order, OrderServiceContract } from "./order.types";
import { PrismaClient } from "../generated/prisma";
import { OrderRepository } from "./order.repository";
import { ProductRepository } from "../Product/product.repository";
import { UserRepository } from "../User/user.repository";

const client = new PrismaClient();

export const OrderService: OrderServiceContract = {
    getAll: async () => {
       return await OrderRepository.getAll();
    },
    getById: async (id) => {
        return await OrderRepository.getById(id);
    },
    async delete(id) {
        return await OrderRepository.delete(id);
    },
    async makeOrder(credentials, userId) {
        const products = await ProductRepository.getManyByIds(credentials.productsToOrder.map(p => p.id))
        console.log('Found products:', products.length)
        if (!products || products.length === 0) {
            return { message: "PRODUCTS_NOT_FOUND" }
        }

        const totalPrice = products.reduce((sum, product) => {
            const ordered = credentials.productsToOrder.find(p => p.id === product.id).count
            return sum + product.price * ordered
        }, 0)

        const discountPrice = products.reduce((sum, product) => {
            const ordered = credentials.productsToOrder.find(p => p.id === product.id).count
            return sum + product.price * (1 - product.discount / 100) * ordered
        }, 0)


        const mainCredentials: CreateOrder = {
            firstName: credentials.userData.firstName,
            lastName: credentials.userData.secondName,
            patronymic: credentials.userData.patronymic,
            phoneNumber: credentials.userData.phoneNumber,
            email: credentials.userData.email,
            totalPrice: totalPrice,
            discountPrice: discountPrice,
            typePay: credentials.paymentData.type,
        }
        const addresses = await UserRepository.getAdressesByUserId(userId)
        if (!addresses || addresses.length === 0) {
            return { message: "ADDRESSES_NOT_FOUND" }
        }
        const addressCredentials: CreateAddressForOrder = {
            city: addresses[addresses.length -1].city,
            street: addresses[addresses.length -1].street,
            houseNumber: addresses[addresses.length -1].houseNumber,
            apartamentNumber: addresses[addresses.length -1].apartamentNumber,
            entranceNumber: addresses[addresses.length -1].entranceNumber
        }

        return await OrderRepository.createOrder(
            mainCredentials,
            credentials.productsToOrder,
            addressCredentials,
            userId
        )
    },
};
