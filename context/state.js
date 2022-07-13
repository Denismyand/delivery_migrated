import { createContext, useContext, useState, useEffect } from "react";
import "react-notifications/lib/notifications.css";
import { dishes } from "../components/Menu.js";
import { NotificationManager } from "react-notifications";


let menu = dishes;

function createNotification(type, dish) {
  switch (type) {
    case "added":
      NotificationManager.success(``, `Added ${dish.product} to cart`);
      break;

    case "removed":
      NotificationManager.error(
        "",
        `Removed ${dish.product} from cart`,
        5000,
        () => {
          alert("callback");
        }
      );
      break;

    case "ordered":
      NotificationManager.success(``, `Order Placed!`);
      break;

    case "cleared":
      NotificationManager.success(``, "Cart cleared");
  }
}
const AppContext = createContext();

export function AppWrapper({ children }) {
  useEffect(() => {
    setCached(JSON.parse(localStorage.getItem("cart")));
  }, []);
  const [cached, setCached] = useState(null);

  const [cart, setCart] = useState(isCached());

  function isCached() {
    if (cached) {
      return cached;
    } else return [];
  }

  function handleAddToCart(dish) {
    let foundInCart = cart.find((cartItem) => cartItem.id === dish.id);
    if (foundInCart) {
      let nextCart = cart.map((food) => {
        if (food.id === foundInCart.id) {
          if (foundInCart.cartQuantity >= 13) {
            return {
              ...foundInCart,
              cartQuantity: Number(13),
            };
          } else {
            return {
              ...foundInCart,
              cartQuantity: Number(foundInCart.cartQuantity) + 1,
            };
          }
        } else return food;
      });
      setCart(nextCart);
    } else {
      setCart([...cart, { ...dish, cartQuantity: 1 }]);
      createNotification("added", dish, foundInCart);
    }
  }

  function handleDecreaseQuantity(dish) {
    if (dish.cartQuantity > 1) {
      let decreased = cart.map((cartItem) => {
        if (cartItem.id === dish.id) {
          return {
            ...cartItem,
            cartQuantity: Number(cartItem.cartQuantity) - 1,
          };
        } else return cartItem;
      });
      setCart(decreased);
    } else {
      setCart(cart.filter((item) => item.id !== dish.id));
      createNotification("removed", dish);
    }
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setCached(JSON.parse(localStorage.getItem("cart")));
  }, [cart]);
  let sharedState = {
    menu,
    cart,
    setCart,
    handleAddToCart,
    handleDecreaseQuantity,
    createNotification,
  };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}