import "react-notifications/lib/notifications.css";
import { useAppContext } from "../context/state.js";
import { Stack } from "@mui/material";
import {
  ButtonRestaurant,
  ButtonMenu,
  ButtonRestaurantClearCart,
} from "../components/MuiCustomized.js";
import { useState } from "react";

export default function App() {
  const { menu, cart, setCart, handleAddToCart, createNotification } =
    useAppContext();

  let mcMenu = menu.filter((dish) => dish.restaurant === "McDonny");
  let cfkMenu = menu.filter((dish) => dish.restaurant === "CFK");
  let johnsMenu = menu.filter((dish) => dish.restaurant === "Uncle John's");
  let sonimodMenu = menu.filter((dish) => dish.restaurant === "Sonimod Pizza");
  const [restaurant, setRestaurant] = useState(mcMenu);

  function chooseRestaurant(brand) {
    setRestaurant(brand);
  }

  return (
    <div className="ShopContent">
      <Restaurants
        chooseRestaurant={chooseRestaurant}
        mcMenu={mcMenu}
        cfkMenu={cfkMenu}
        johnsMenu={johnsMenu}
        sonimodMenu={sonimodMenu}
        cart={cart}
        setCart={setCart}
        createNotification={createNotification}
      />
      <Menu restaurant={restaurant} handleAddToCart={handleAddToCart} />
    </div>
  );
}

function Restaurants({
  chooseRestaurant,
  mcMenu,
  cfkMenu,
  johnsMenu,
  sonimodMenu,
  cart,
  setCart,
  createNotification,
}) {
  return (
    <div className="RestaurantList">
      <Stack alignItems="center" spacing="40px" directioStackn="column">
        <h2>Shops:</h2>
        <ButtonRestaurant
          disabled={cart.length > 0}
          onClick={() => chooseRestaurant(mcMenu)}
        >
          <b>McDonny</b>
        </ButtonRestaurant>
        <ButtonRestaurant
          disabled={cart.length > 0}
          onClick={() => chooseRestaurant(cfkMenu)}
        >
          <b>CFK</b>
        </ButtonRestaurant>
        <ButtonRestaurant
          disabled={cart.length > 0}
          onClick={() => chooseRestaurant(johnsMenu)}
        >
          <b>Uncle John's</b>
        </ButtonRestaurant>
        <ButtonRestaurant
          disabled={cart.length > 0}
          onClick={() => chooseRestaurant(sonimodMenu)}
        >
          <b>Sonimod Pizza</b>
        </ButtonRestaurant>
        <ButtonRestaurantClearCart
          disabled={cart.length === 0}
          onClick={() => {
            setCart([]);
            createNotification("cleared");
          }}
        >
          Clear cart
        </ButtonRestaurantClearCart>
      </Stack>
    </div>
  );
}

function Menu({ restaurant, handleAddToCart }) {
  return (
    <>
      <div className="MenuContent">
        {restaurant.map((dish) => (
          <div className="Dish" key={dish.id}>
            <img
              className="MenuDishImage"
              src={dish.image}
              alt={dish.product}
            />
            <div>
              <span className="DishInfo">
                <b> {dish.product}</b>
                <br />
                {dish.cost + "₴"}
              </span>
              <ButtonMenu onClick={() => handleAddToCart(dish)}>
                Add to cart
              </ButtonMenu>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
