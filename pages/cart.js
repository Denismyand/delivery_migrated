import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Stack } from "@mui/material";
import Map from "../components/Map.js";
import ReCAPTCHA from "react-google-recaptcha";
import {
  ButtonSubmitOrder,
  ButtonArrowUp,
  ButtonArrowDown,
  InputPersonalInfo,
  InputCartQuantity,
  ButtonCartClearCart,
  ButtonDeleteFromCart,
} from "../components/MuiCustomized.js";
import { useAppContext } from "../context/state.js";

export default function Cart() {
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
  const [cachedOrders, setCachedOrders] = useState(null);

  useEffect(() => {
    setCachedOrders(JSON.parse(localStorage.getItem("orders")));
  }, []);
  const [orders, setOrders] = useState(isCached());

  function isCached() {
    if (cachedOrders) {
      return cachedOrders;
    } else return [];
  }
  function ifCartIsEmpty() {
    if (cart.length < 1) {
      return true;
    } else return false;
  }
  const [cartIsEmpty, setCartIsEmpty] = useState(!ifCartIsEmpty);
  useEffect(() => {
    setCartIsEmpty(ifCartIsEmpty());
  }, [cart]);

  let total = 0;

  function getOrder() {
    setOrders([
      ...orders,
      {
        id: uuidv4(),
        customer_name: custName,
        customer_email: custEmail,
        customer_phone: custPhone,
        customer_address: custAddress,
        ordered_items: cart,
        order_total: cartTotal(),
      },
    ]);
    setCustName("");
    setCustEmail("");
    setCustPhone("");
    setCustAddress("");
  }
  function handleCaptchaVerify(value) {
    console.log("Captcha value:", value);
    setIsVerified(!isVerified);
  }

  function cartTotal() {
    if (cart) {
      cart.forEach((dish) => {
        if (dish.cartQuantity) {
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
    localStorage.setItem("orders", JSON.stringify(orders));
    setCachedOrders(JSON.parse(localStorage.getItem("orders")));
  }, [orders]);

  return (
    <>
      <div className="CartContent">
        <Stack
          className="PersonalInfo"
          alignItems="center"
          spacing="50px"
          directioStackn="column"
        >
          <Map
            setCustAddress={setCustAddress}
            custAddress={custAddress}
            cart={cart}
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
          />
          <InputPersonalInfo
            toInput="phone"
            value={custPhone}
            onChange={(e) => setCustPhone(e.target.value)}
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
            {cartIsEmpty ? null : (
              <ReCAPTCHA
                className="Captcha"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaVerify}
              />
            )}
            <div className="CartTotal">
              <p>Total price: {cartTotal()}</p>
            </div>
            <ButtonCartClearCart
              disabled={cartIsEmpty}
              onClick={() => {
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
