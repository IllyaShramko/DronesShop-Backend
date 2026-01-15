
import { PrismaClient as PC, Prisma } from "../generated/prisma"; 

const PrismaClient = new PC()
async function getSuggestions(popular?, isNew?, limit?, offset?) {
    const products = await PrismaClient.product.findMany({
        skip: offset,
        take: limit,
        orderBy: popular 
            ? {
                orders: {
                    _count: 'desc'
                }
            } 
            : {
                id: 'desc' 
            },
        include: {
            category: true,
        }
    });

    return products;
}

(async () => {
    const products = await getSuggestions(true, false, 1);
    console.log(products);
})();
