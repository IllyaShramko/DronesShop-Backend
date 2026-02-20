import { PrismaClient } from "../generated/prisma"

export async function seedCategories(prisma: PrismaClient) {
    await prisma.category.deleteMany()

    await prisma.category.createMany({
        data: [
            {
                name: "Дрони",
                icon: "drones-icon.png"
            },
            {
                name: "Тепловізери",
                icon: "thermal-icon.png"
            }
        ]
    })
    console.log("Категорії створені")
}