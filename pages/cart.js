import { useState, useEffect } from "react";
import { useAppContext } from "../context/state.js";
import Map from "../components/Map.js";
import {
  ButtonSubmitOrder,
  ButtonArrowUp,
  ButtonArrowDown,
  InputPersonalInfo,
  InputCartQuantity,
  ButtonCartClearCart,
  ButtonDeleteFromCart,
  PromoInput,
} from "../components/MuiCustomized.js";
import { Stack } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import ReCAPTCHA from "react-google-recaptcha";

const prisma = new PrismaClient();

export async function getServerSideProps() {
  let restaurants = await prisma.restaurants.findMany();
  return {
    props: {
      restaurantLocations: restaurants.map((rest) => {
        return {
          ...rest,
          lat: Number(rest.lat),
          lng: Number(rest.lng),
        };
      }),
    },
  };
}

export default function Cart({ restaurantLocations }) {
  const {
    cart,
    setCart,
    handleAddToCart,
    handleDecreaseQuantity,
    createNotification,
  } = useAppContext();

  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [promo, setPromo] = useState("");

  useEffect(() => {
    setCustomerId(JSON.parse(localStorage.getItem("UserToken")));
  }, []);

  const [cartIsEmpty, setCartIsEmpty] = useState(true);

  useEffect(() => {
    setCartIsEmpty(cart.length < 1);
  }, [cart]);

  async function getOrder() {
    let orderTime = new Date();
    let orderItems = JSON.stringify(
      cart.map((item) => {
        return { id: item.id, quantity: item.cartQuantity };
      })
    );
    await fetch("api/order", {
      method: "POST",
      body: JSON.stringify({
        orderId: uuidv4(),
        custName,
        custEmail,
        custPhone,
        custAddress,
        customerId,
        orderItems,
        orderTime,
        orderTotal: total,
      }),
    });
    setCustName("");
    setCustEmail("");
    setCustPhone("");
    setCustAddress("");
  }

  function handleCaptchaVerify() {
    setIsVerified(!isVerified);
  }

  let total = 0;

  function cartTotal() {
    if (cart) {
      cart.forEach((dish) => {
        if (promo === "20percent") {
          total += dish.cost * dish.cartQuantity * 0.8;
        } else if (promo === "30percent") {
          total += dish.cost * dish.cartQuantity * 0.7;
        } else {
          total += dish.cost * dish.cartQuantity;
        }
      });
      return total + "₴";
    } else return "0";
  }

  function handleChangeQuantity(dish, e) {
    let changed = cart.map((cartItem) => {
      if (cartItem.id === dish.id) {
        if (e.target.value >= 13) {
          return { ...cartItem, cartQuantity: 13 };
        } else if (e.target.value <= 1) {
          return { ...cartItem, cartQuantity: 1 };
        } else {
          return { ...cartItem, cartQuantity: e.target.value };
        }
      } else return cartItem;
    });
    setCart(changed);
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <div className="CartContent">
        <Stack
          className="PersonalInfo"
          alignItems="center"
          spacing="50px"
          direction="column"
        >
          <Map
            setCustAddress={setCustAddress}
            custAddress={custAddress}
            cart={cart}
            restaurantLocations={restaurantLocations}
          />
          <InputPersonalInfo
            toInput="name"
            value={custName}
            onChange={(e) => setCustName(e.target.value)}
          />
          <InputPersonalInfo
            toInput="email"
            value={custEmail}
            onChange={(e) => setCustEmail(e.target.value)}
            type="email"
          />
          <InputPersonalInfo
            toInput="phone"
            value={custPhone}
            onChange={(e) => setCustPhone(e.target.value)}
            type="number"
          />
          <InputPersonalInfo
            toInput="address"
            value={custAddress}
            disabled={true}
          />
        </Stack>
        <div className="CartSection">
          <div className="Cart">
            <CartItems
              cart={cart}
              setCart={setCart}
              handleChangeQuantity={handleChangeQuantity}
              handleAddToCart={handleAddToCart}
              handleDecreaseQuantity={handleDecreaseQuantity}
              createNotification={createNotification}
            />
          </div>
          <div className="CartTotalSection">
            {!cartIsEmpty ? (
              <ReCAPTCHA
                className="Captcha"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaVerify}
              />
            ) : null}
            <PromoInput
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <div className="CartTotal">
              <p>Total price: {cartTotal()}</p>
            </div>
            <ButtonCartClearCart
              disabled={cartIsEmpty}
              onClick={() => {
                getOrder();
                setCart([]);
                createNotification("cleared");
              }}
            >
              Clear cart
            </ButtonCartClearCart>
            <ButtonSubmitOrder
              disabled={
                cartIsEmpty ||
                custName === "" ||
                custPhone === "" ||
                custEmail === "" ||
                custAddress === "" ||
                !isVerified
              }
              onClick={() => {
                getOrder();
                setCart([]);
                createNotification("ordered");
              }}
            >
              Submit
            </ButtonSubmitOrder>
          </div>
        </div>
      </div>
    </>
  );
}

function CartItems({
  cart,
  setCart,
  handleChangeQuantity,
  handleAddToCart,
  handleDecreaseQuantity,
  createNotification,
}) {
  return cart.length > 0 ? (
    cart.map((dish) => {
      return (
        <div className="CartItem" key={dish.id}>
          <img
            src={dish.image}
            alt={dish.name}
            width="325px"
            height="300px"
            style={{ overflow: "hidden" }}
          />
          <div className="CartItemDescription">
            <div className="CartItemName">
              <b>{dish.product}</b>
            </div>
            <div className="CartItemCost">
              Price: {dish.cost * dish.cartQuantity}₴
            </div>
            <div className="CartItemQuantity">
              <InputCartQuantity
                value={dish.cartQuantity}
                onChange={(e) => handleChangeQuantity(dish, e)}
              ></InputCartQuantity>
              <div className="CartQuantityButtons">
                <Stack direction="column">
                  <ButtonArrowUp
                    onClick={() => handleAddToCart(dish)}
                  ></ButtonArrowUp>
                  <ButtonArrowDown
                    onClick={() => handleDecreaseQuantity(dish)}
                  ></ButtonArrowDown>
                </Stack>
                <ButtonDeleteFromCart
                  onClick={() => {
                    setCart(cart.filter((cartItem) => cartItem.id !== dish.id));
                    createNotification("removed", dish);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <h1 className="EmptyCart">Your cart is empty</h1>
  );
}
