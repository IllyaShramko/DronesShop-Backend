import { PrismaClient as PC } from "../generated/prisma/client"; 

const PrismaClient = new PC()

async function createCategory() {
    return await PrismaClient.category.create({
        data: {
            name: "category2",
            icon: "1312"
        }
    })
}

async function createBlock() {
    return await PrismaClient.blockInfo.create({
        data: {
            title: "ПОутжнczxcvxczий",
            description: "cxazxcvckvaokvpovadv dkvoasdv odsvasdvadsvava adapivdf",
            typeView: "v2",
            priorityView: 1,
            media: "strinsxczgs",
            productId: 2
        }
    })
}
// createBlock()

async function createParam() {
    return await PrismaClient.parametersInfo.create({
        data: {
            name: "categoryxvxcv2",
            parameter: "131xxx2",
            blockInfoId: 3
        }
    })
}

createParam()

