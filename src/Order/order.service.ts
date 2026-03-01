import { CreateOrder, NP_URL, OrderServiceContract } from "./order.types";
import { PrismaClient } from "../generated/prisma";
import { OrderRepository } from "./order.repository";
import { ProductRepository } from "../Product/product.repository";
import { UserRepository } from "../User/user.repository";
import { ENV } from "../config/env";

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

        const counterpartyResponse = await fetch(NP_URL, {
            method: 'POST',
            body: JSON.stringify({
                apiKey: ENV.NOVAPOSHTA_API_KEY,
                modelName: 'Counterparty',
                calledMethod: 'save',
                methodProperties: {
                    FirstName: credentials.userData.firstName,
                    MiddleName: credentials.userData.patronymic, 
                    LastName: credentials.userData.secondName,
                    Phone: credentials.userData.phoneNumber.trim(),
                    Email: credentials.userData.email,
                    CounterpartyType: "PrivatePerson",
                    CounterpartyProperty: "Recipient"
                }
            })
        });

        const counterpartyResult = await counterpartyResponse.json();

        if (!counterpartyResult.success) {
            console.error("Error creating client:", counterpartyResult.errors);
            return; 
        }

        const recipientRef = counterpartyResult.data[0].Ref;
        const contactRecipientRef = counterpartyResult.data[0].ContactPerson.data[0].Ref;

        const todayStr = new Date().toLocaleDateString('uk-UA', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '.'); 

        const orderResponse = await fetch(NP_URL, {
            method: 'POST',
            body: JSON.stringify({
                apiKey: ENV.NOVAPOSHTA_API_KEY,
                modelName: 'InternetDocument',
                calledMethod: 'save',
                methodProperties: {
                    Sender: ENV.NOVAPOSHTA_SENDER_REF,
                    ContactSender: ENV.NOVAPOSHTA_SENDER_CONTACT_REF, 
                    SendersPhone: ENV.SENDER_PHONE,
                    CitySender: "8d5a980d-391c-11dd-90d9-001a92567626",
                    SenderAddress: "1ec09d88-e1c2-11e3-8c4a-0050568002cf",
                    Recipient: recipientRef,
                    ContactRecipient: contactRecipientRef,
                    CityRecipient: credentials.deliveryData.city, 
                    RecipientAddress: credentials.deliveryData.warehouse, 
                    RecipientsPhone: credentials.userData.phoneNumber.trim(),
                    PayerType: "Recipient",
                    PaymentMethod: "Cash",
                    DateTime: todayStr, 
                    CargoType: "Parcel",
                    Weight: "1",
                    ServiceType: "WarehouseWarehouse", 
                    SeatsAmount: "1",
                    Description: "Тестове замовлення",
                    Cost: discountPrice.toString(), 
                }
            })
        });

        const orderResult = await orderResponse.json();
        const mainCredentials: CreateOrder = {
            firstName: credentials.userData.firstName,
            lastName: credentials.userData.secondName,
            patronymic: credentials.userData.patronymic,
            phoneNumber: credentials.userData.phoneNumber,
            email: credentials.userData.email,
            totalPrice: totalPrice,
            discountPrice: discountPrice,
            typePay: credentials.paymentData.type,
            trackingNumber: orderResult.data[0].IntDocNumber,
            ref: orderResult.data[0].Ref
        }
        
        
        if (!orderResult.success) {
            console.error("ERROR electronic consignment note:", orderResult.errors);
            return {message: "Error while creating electronic consignment note"}
        } 

        return await OrderRepository.createOrder(
            mainCredentials,
            credentials.productsToOrder,
            userId,
        )
    },
    async getCities({ cityName }) {
        const response = await fetch(NP_URL, {
            method: 'POST',
            body: JSON.stringify({
                apiKey: ENV.NOVAPOSHTA_API_KEY,
                modelName: 'Address',
                calledMethod: 'getCities',
                methodProperties: { FindByString: cityName, Limit: "20" }
            })
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.errors[0]);
        return result.data;
    },
    async getWarehouses({ cityRef, deliveryType }) {
        const WAREHOUSE_ID = "841339c7-591a-42e2-8233-7a0a00f0ed6f"; 
        const POSTOMAT_ID = "f9316480-5f2d-425d-bc2c-ac7cd29decf0";  

        const typeRef = deliveryType === 'postomat' ? POSTOMAT_ID : WAREHOUSE_ID;

        const response = await fetch(NP_URL, {
            method: 'POST',
            body: JSON.stringify({
                apiKey: ENV.NOVAPOSHTA_API_KEY,
                modelName: 'Address',
                calledMethod: 'getWarehouses',
                methodProperties: { 
                    CityRef: cityRef, 
                    TypeOfWarehouseRef: typeRef 
                }
            })
        });

        const result = await response.json();
        
        if (!result.success) {
            console.error("Error was ocurred:", result.errors);
            return [];
        }

        return result.data;
    }
};
