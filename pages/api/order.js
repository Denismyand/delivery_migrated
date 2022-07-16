import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getOrderData({
  orderId,
  custName,
  custEmail,
  custPhone,
  custAddress,
  customerId,
  orderItems,
  orderTime,
  orderTotal
}) {
  return prisma.orders.create({
    data: {
      id: orderId,
      customer_id: customerId,
      customer_name: custName,
      customer_email: custEmail,
      customer_phone: custPhone,
      customer_address: custAddress,
      order_items: orderItems,
      order_time: orderTime,
      order_total: orderTotal,
    },
  });
}

export default async (req, res) => {
  const { body } = req;
  const orderdata = await getOrderData(JSON.parse(body));
  res.status(200).json({ orderdata });
};
