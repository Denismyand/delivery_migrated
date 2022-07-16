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
    <div className="HistoryContent">
      <div className="SearchSection"></div>
      <History orderList={orderList} menu={menu} />
    </div>
  );
}

function History({ orderList, menu }) {
  return (
    <div className="HistoryList">
      {orderList.map((order) => {
        return (
          <div className="HistoryOrder">
            <p>
              Order id: <b>{order.id}</b>
            </p>
            <p>
              Order date:{" "}
              <b>
                {new Date(order.order_time).getHours() +
                  ":" +
                  new Date(order.order_time).getMinutes() +
                  " " +
                  new Date(order.order_time).getDate() +
                  "." +
                  (new Date(order.order_time).getMonth() + 1) +
                  "." +
                  new Date(order.order_time).getFullYear()}
              </b>
            </p>
            <p>
              Order phone number: <b>{order.customer_phone}</b>
            </p>
            <p>
              Order address: <b>{order.customer_address}</b>
            </p>
            <div key={order.id} className="HistoryOrderInfo">
              <div className="HistoryOrderItems">
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
                            <span>
                              <b>{dish.product}</b>
                            </span>
                            <br />
                            <span>
                              Quantity ordered: {orderedItem.quantity}
                            </span>
                            <br />
                            <span>Price: {itemTotal}₴</span>
                          </div>
                        </div>
                      );
                    }
                  });
                })}
                <p className="HistoryOrderTotal">
                  Order total: <b>{order.order_total}₴</b>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
