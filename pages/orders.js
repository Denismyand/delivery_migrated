import { useState, useEffect } from "react";
import { InputSearch } from "../components/MuiCustomized.js";
import { Stack } from "@mui/material";
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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setUserId(JSON.parse(localStorage.getItem("UserToken")));
  }, []);

  orderList = orderList
    .filter((order) => order.customer_id === userId)
    .map((order) => {
      return { ...order, order_items: JSON.parse(order.order_items) };
    });

  return (
    <div className="HistoryContent">
      <Stack
        className="SearchSection"
        alignItems="center"
        spacing="30px"
        direction="column"
      >
        <InputSearch
          toInput="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <InputSearch
          toInput="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="number"
        />
        <InputSearch
          toInput="order Id"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </Stack>
      <History
        orderList={orderList}
        menu={menu}
        email={email}
        phone={phone}
        orderId={orderId}
      />
    </div>
  );
}

function History({ orderList, menu, email, phone, orderId }) {
  return (
    <div className="HistoryList">
      {orderList.map((order) => {
        return order.customer_email
          .toLowerCase()
          .includes(email.toLowerCase()) &&
          order.customer_phone.toLowerCase().includes(phone.toLowerCase()) &&
          order.id.toLowerCase().includes(orderId.toLowerCase()) ? (
          <div className="HistoryOrder" key={order.id}>
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
              Order email: <b>{order.customer_email}</b>
            </p>
            <p>
              Order address: <b>{order.customer_address}</b>
            </p>
            <div key={order.id} className="HistoryOrderInfo">
              <div className="OrderItemsAndTotal">
                <div className="HistoryOrderItems">
                  {order.order_items.map((orderedItem) => {
                    return menu.map((dish) => {
                      if (dish.id === orderedItem.id) {
                        let itemTotal =
                          Number(dish.cost) * orderedItem.quantity;
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
                                Quantity ordered: <b>{orderedItem.quantity}</b>
                              </span>
                              <br />
                              <span>Price: {itemTotal}₴</span>
                            </div>
                          </div>
                        );
                      }
                    });
                  })}
                </div>
                <p className="HistoryOrderTotal">
                  Order total: <b>{order.order_total}₴</b>
                </p>
              </div>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
}
