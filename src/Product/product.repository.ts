import { ProductRepositoryContract } from "./product.types";
import { PrismaClient as PC, Prisma } from "../generated/prisma"; 

const PrismaClient = new PC()

export const ProductRepository: ProductRepositoryContract = {
    async getAll(categoryId, take, skip) {
        if (categoryId){
            const products = await PrismaClient.product.findMany({
                where: {
                    categoryId: categoryId
                },
                skip,
                take
            })
            return products
        }
        else{
            const products = await PrismaClient.product.findMany({
                skip,
                take
            }) 
            return products
        }
    },
    async getById(id) {
        try {
            const product = await PrismaClient.product.findUnique({
                where:{id: id},
                include: {
                    blocksInfo: {
                        include: {
                            params: true
                        }
                    }
                }
            })
            console.log(product)
            return product
            
        } catch (error) {
            throw error
        }
    },
    async getManyByIds(ids) {
        try {
            console.log(ids)
            const products = await PrismaClient.product.findMany({
                where: {
                    id: {
                        in: ids
                    }
                }
            })
            return products
        } catch (error) {
            return 
        }
    },
    async create(data) {
        return await PrismaClient.product.create({data})
    },
    async update(id, data) {
        return await PrismaClient.product.update({
            where: {id},
            data
        })
    },
    async delete(id) {
        return await PrismaClient.product.delete({where:{id}})
    },
    async getPopular(limit, offset) {
        return await PrismaClient.product.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                orders: {
                    _count: "desc"
                }
            }
        })
    },
    async getNew(limit, offset) {
        return await PrismaClient.product.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: "desc"
            }
        })
    },
    async getSimilar(productId, limit) {
        const target = await PrismaClient.product.findUnique({
            where: { id: productId }
        });

        if (!target) return [];

        let result = [];
        let excludedIds = [productId];

        const words = target.name.split(' ').filter(w => w.length >= 2);
        if (words.length > 0) {
            const byName = await PrismaClient.product.findMany({
                where: {
                    OR: words.map(word => ({ name: { contains: word } })),
                    id: { not: productId }
                },
                take: limit
            });
            result = [...byName];
            excludedIds = [...excludedIds, ...byName.map(p => p.id)];
        }

        if (result.length < limit) {
            const byCategory = await PrismaClient.product.findMany({
                where: {
                    categoryId: target.categoryId,
                    id: { notIn: excludedIds }
                },
                take: limit - result.length
            });
            result = [...result, ...byCategory];
            excludedIds = [...excludedIds, ...byCategory.map(p => p.id)];
        }

        if (result.length < limit) {
            const n = 2000;
            const byPrice = await PrismaClient.product.findMany({
                where: {
                    price: {
                        gte: target.price - n,
                        lte: target.price + n
                    },
                    id: { notIn: excludedIds }
                },
                take: limit - result.length
            });
            result = [...result, ...byPrice];
        }

        return result;
    },
}