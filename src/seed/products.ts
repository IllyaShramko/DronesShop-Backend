import { PrismaClient } from "../generated/prisma"

export async function seedProducts(prisma: PrismaClient) {
    await prisma.product.deleteMany()
    const categories = await prisma.category.findMany()
    const dronesCategory = categories.find(c => c.name === "Дрони")
    const thermalCategory = categories.find(c => c.name === "Тепловізери")

    if (!dronesCategory || !thermalCategory) {
        throw new Error("Категорії не знайдені")
    }

    const baseProducts = [
        {
            name: "DJI Mini 4K",
            previewPhoto: "/images/DJI_Mini_4K.jpg",
            description: "Компактний дрон із камерою 4K та стабілізацією.",
            price: 29900,
            discount: 10,
            totalStorage: 15,
            categoryId: dronesCategory.id
        },
        {
            name: "DJI Mini 4 Pro",
            previewPhoto: "/images/DJI_Mini_4_Pro.jpg",
            description: "Професійний дрон з HDR-відео та сенсорами обходу перешкод.",
            price: 34900,
            discount: 12,
            totalStorage: 12,
            categoryId: dronesCategory.id
        },
        {
            name: "DJI Flip",
            previewPhoto: "/images/DJI_Flip.jpg",
            description: "Маневрений дрон для динамічної зйомки.",
            price: 27900,
            discount: 8,
            totalStorage: 18,
            categoryId: dronesCategory.id
        },
        {
            name: "Pulsar Telos LRF XQ35",
            previewPhoto: "/images/thermal1.jpg",
            description: "Тепловізор з лазерним далекоміром.",
            price: 89900,
            discount: 5,
            totalStorage: 6,
            categoryId: thermalCategory.id
        },
        {
            name: "Pulsar Axion 2 LRF XQ35 Pro",
            previewPhoto: "/images/thermal2.jpg",
            description: "Сучасний тепловізор з високою деталізацією.",
            price: 95900,
            discount: 6,
            totalStorage: 5,
            categoryId: thermalCategory.id
        },
        {
            name: "Guide IR510 Nano N2 WiFi",
            previewPhoto: "/images/thermal3.jpg",
            description: "Компактний тепловізор з Wi-Fi.",
            price: 45900,
            discount: 9,
            totalStorage: 10,
            categoryId: thermalCategory.id
        },
        {
            name: "ARMASIGHT Q14",
            previewPhoto: "/images/thermal4.jpg",
            description: "Надійний тепловізор для складних умов.",
            price: 109900,
            discount: 7,
            totalStorage: 4,
            categoryId: thermalCategory.id
        },
        {
            name: "ATN OTS-XLT 160",
            previewPhoto: "/images/thermal5.jpg",
            description: "Тепловізор з цифровим збільшенням.",
            price: 51900,
            discount: 10,
            totalStorage: 9,
            categoryId: thermalCategory.id
        },
        {
            name: "ThermTec Cyclops 350Pro",
            previewPhoto: "/images/thermal6.jpg",
            description: "Високоточний тепловізор з великою дальністю.",
            price: 67900,
            discount: 11,
            totalStorage: 7,
            categoryId: thermalCategory.id
        },
        {
            name: "ThermTec Cyclops 650D",
            previewPhoto: "/images/thermal7.jpg",
            description: "Преміальна модель тепловізора.",
            price: 82900,
            discount: 13,
            totalStorage: 5,
            categoryId: thermalCategory.id
        },
        {
            name: "Pard Leopard",
            previewPhoto: "/images/thermal8.jpg",
            description: "Універсальний тепловізор для спостереження.",
            price: 59900,
            discount: 9,
            totalStorage: 8,
            categoryId: thermalCategory.id
        }
    ]

    const products = []

    for (let i = 1; i <= 120; i++) {
        const base = baseProducts[i % baseProducts.length]
        products.push({
            ...base,
            name: `${base.name} ${i}`,
            price: base.price + (i % 7) * 700,
            discount: (base.discount + i) % 20,
            totalStorage: base.totalStorage + (i % 6)
        })
    }
    await prisma.product.createMany({ data: products })
}