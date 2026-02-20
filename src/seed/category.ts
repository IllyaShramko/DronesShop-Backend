import { PrismaClient } from "../generated/prisma"

export async function seedBlocksForProduct(
    prisma: PrismaClient,
    productId: number
) {
    for (let i = 1; i <= 4; i++) {
        await prisma.blockInfo.create({
            data: {
                title: "Володійте кожним кутом",
                description: "Професійна система камер забезпечує деталізоване зображення в будь-яких умовах.",
                media: "",
                typeView: ["v1", "v2", "v3", "v1"][i - 1],
                priorityView: i,
                productId: productId,
                params: i === 4 ? {
                    create: [
                        { name: "Дальність", parameter: "до 250 м" },
                        { name: "Режимів", parameter: "10" }
                    ]
                } : undefined
            }
        })
    }
}