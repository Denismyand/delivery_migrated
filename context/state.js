import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";

function createNotification(type, dish) {
  switch (type) {
    case "added":
      NotificationManager.success(``, `Added ${dish.product} to cart`);
      break;

    case "removed":
      NotificationManager.error(
        "",
        `Removed ${dish.product} from cart`,
        3000,
        () => {
          alert("callback");
        }
      );
      break;

    case "ordered":
      NotificationManager.success(``, `Order Placed!`, 3000);
      break;

    case "cleared":
      NotificationManager.success(``, "Cart cleared", 1000);
      break;

    case "copied":
      NotificationManager.info(``, "Copied to clipboard", 1000);
  }
}
const AppContext = createContext();

const maxCartQuantity = 13;

export function AppWrapper({ children }) {
  const [cart, setCart] = useState([]);

  function getCart() {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart"));
    } else return [];
  }

  useEffect(() => {
    getCart();
  }, [cart]);

  function handleAddToCart(dish) {
    let foundInCart = cart.find((cartItem) => cartItem.id === dish.id);
    if (foundInCart) {
      let nextCart = cart.map((food) => {
        if (food.id === foundInCart.id) {
          if (foundInCart.cartQuantity >= maxCartQuantity) {
            return {
              ...foundInCart,
              cartQuantity: Number(maxCartQuantity),
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
  }, [cart]);

  useEffect(() => {
    if (!localStorage.getItem("UserToken")) {
      localStorage.setItem("UserToken", JSON.stringify(uuidv4()));
    }
  }, []);

  let sharedState = {
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
