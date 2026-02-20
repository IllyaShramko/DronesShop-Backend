import { PrismaClient as PC } from "../generated/prisma/client";

const prisma = new PC();

export async function createOrderForUser(userId: number, productIds?: number[]) {
	const data: any = {
		firstName: "Seed",
		lastName: "User",
		patronymic: "",
		birthday: new Date("1990-01-01"),
		phoneNumber: "0000000000",
		email: `user${userId}@example.com`,
		totalPrice: 100,
		discountPrice: 0,
		typePay: "cash",
		user: { connect: { id: userId } },
	};

	if (productIds && productIds.length) {
		data.products = {
			create: productIds.map((pid) => ({ product: { connect: { id: pid } }, ordered: 1 })),
		};
	}
	const order = await prisma.order.create({ data });
	return order;
}
createOrderForUser(1, [2])