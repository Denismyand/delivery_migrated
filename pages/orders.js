import { useState, useEffect } from "react";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getServerSideProps() {
  const dishes = await prisma.dishes.findMany();
  const orders = await prisma.orders.findMany();

  return {
    props: {
      menu: dishes,
      orderList: orders,
    },
  };
}

export default function Orders({ menu, orderList }) {
  const [userId, setUserId] = useState("");
  useEffect(() => {
    setUserId(JSON.parse(localStorage.getItem("UserToken")));
  }, []);
  orderList.filter((order) => order.customer_id === userId);
  orderList = orderList.map((order) => {
    return { ...order, order_items: JSON.parse(order.order_items) };
  });

  return (
    <div>
      {orderList.map((order) => {
        return (
          <div key={order.id} className="HistoryOrder">
            <p>Order id: {order.id}</p>
            {order.order_items.map((orderedItem) => {
              return menu.map((dish) => {
                if (dish.id === orderedItem.id) {
                  let itemTotal = Number(dish.cost) * orderedItem.quantity;
                  return (
                    <div key={dish.id} className="HistoryDish">
                      <img
                        src={dish.image}
                        width="200px"
                        height="200px"
                        alt={dish.product}
                      ></img>
                      <div className="HistoryDishInfo">
                        <p>{dish.product}</p>
                        <p>Quantity ordered: {orderedItem.quantity}</p>
                        <p>Price: {itemTotal}₴</p>
                      </div>
                    </div>
                  );
                }
              });
            })}
            <p>Order total: {order.order_total}₴</p>
          </div>
        );
      })}
    </div>
  );
}
