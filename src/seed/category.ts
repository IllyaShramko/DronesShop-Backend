import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function seedBlocksForProduct( productId: number, includeParams: boolean, countBlocks: number, typesView: string[] ) {
    console.log(`Product for create blocksInfo: ${productId}...`);

    for (let i = 0; i < countBlocks; i++) {
        const isLastBlock = i === countBlocks - 1;
        const currentType = typesView[i] || "v1";

        await prisma.blockInfo.create({
            data: {
                title: "Володійте кожним кутом",
                description: "Представляємо вдосконалену систему з трьома камерами, де кожен об'єктив має свої переваги, створюючи виняткові зображення - від широких ширококутних пейзажів до детальних телефото-знімків крупним планом. Усі три камери оснащені функцією Dual Native ISO Fusion, яка бездоганно поєднує переваги високих і низьких значень ISO для захоплення приголомшливих деталей, яких неможливо досягти за допомогою традиційних рішень. ",
                media: "",
                typeView: currentType,
                priorityView: i + 1,
                productId: productId,
                params: (includeParams && isLastBlock) ? {
                create: [
                    { name: "Дальність", parameter: "до 250 м" },
                    { name: "Режимів", parameter: "10" }
                ]
                } : undefined
            }
        });
    }

    console.log(`Succesfully created ${countBlocks} blocksInfo.`);
}

async function main() {
    try {
        await seedBlocksForProduct(4, true, 3, ["v1", "v3", "v2"])
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();