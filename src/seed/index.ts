import { PrismaClient } from "../generated/prisma"
import { seedCategories } from "./categories"
import { seedProducts } from "./products"
import { seedBlocksForProduct } from "./category"

const prisma = new PrismaClient()

async function main() {
    await prisma.blockInfo.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await seedCategories(prisma)
    await seedProducts(prisma)

    const products = await prisma.product.findMany()

    for (const product of products) {
        await seedBlocksForProduct(prisma, product.id)
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())