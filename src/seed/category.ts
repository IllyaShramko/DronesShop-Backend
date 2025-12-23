import { PrismaClient as PC } from "../generated/prisma/client"; 

const PrismaClient = new PC()

async function createBlock() {
    return await PrismaClient.blockInfo.create({
        data: {
            title: "ПОутжнczxcvxcvvvbnvxxccbzий",
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
            name: "Номінальна потужність",
            parameter: "1500 Вт",
            blockInfoId: 2
        }
    })
}

