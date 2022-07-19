import { useState, useEffect } from "react";
import { useAppContext } from "../context/state.js";
import {
  ButtonRestaurant,
  ButtonMenu,
  ButtonRestaurantClearCart,
} from "../components/MuiCustomized.js";
import { Stack } from "@mui/material";
import "react-notifications/lib/notifications.css";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getServerSideProps() {
  const dishes = await prisma.dishes.findMany();
  return {
    props: {
      menu: dishes,
    },
  };
}

export default function App({ menu }) {
  const { cart, setCart, handleAddToCart, createNotification } =
    useAppContext();

  const restaurants = ["McDonny", "CFK", "Uncle John's", "Sonimod Pizza"];

  const [restaurantName, setRestaurantName] = useState("McDonny");

  const filteredMenu = menu.filter(
    (dish) => dish.restaurant === restaurantName
  );

  const cartIsEmpty = cart.length < 1;

  return (
    <div className="ShopContent">
      <Restaurants
        setRestaurantName={setRestaurantName}
        restaurants={restaurants}
        setCart={setCart}
        createNotification={createNotification}
        cartIsEmpty={cartIsEmpty}
      />
      <Menu filteredMenu={filteredMenu} handleAddToCart={handleAddToCart} />
    </div>
  );
}

function Restaurants({
  setRestaurantName,
  restaurants,
  cartIsEmpty,
  setCart,
  createNotification,
}) {
  return (
    <div className="RestaurantList">
      <Stack alignItems="center" spacing="40px" direction="column">
        <h2>Shops:</h2>
        {restaurants.map((rest) => {
          return (
            <ButtonRestaurant
              disabled={!cartIsEmpty}
              onClick={() => setRestaurantName(rest)}
            >
              {rest}
            </ButtonRestaurant>
          );
        })}
        <ButtonRestaurantClearCart
          disabled={cartIsEmpty}
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

function Menu({ filteredMenu, handleAddToCart }) {
  return (
    <>
      <div className="MenuContent">
        {filteredMenu.map((dish) => (
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
