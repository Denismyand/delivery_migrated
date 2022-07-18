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

  let mcMenu = menu.filter((dish) => dish.restaurant === "McDonny");
  let cfkMenu = menu.filter((dish) => dish.restaurant === "CFK");
  let johnsMenu = menu.filter((dish) => dish.restaurant === "Uncle John's");
  let sonimodMenu = menu.filter((dish) => dish.restaurant === "Sonimod Pizza");

  const [restaurant, setRestaurant] = useState(mcMenu);

  function chooseRestaurant(brand) {
    setRestaurant(brand);
  }

  function ifCartIsNotEmpty() {
    if (cart.length < 1) {
      return false;
    } else return true;
  }

  const [cartIsEmpty, setCartIsEmpty] = useState(!ifCartIsNotEmpty);

  useEffect(() => {
    setCartIsEmpty(!ifCartIsNotEmpty());
  }, [cart]);

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
        cartIsEmpty={cartIsEmpty}
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
  cartIsEmpty,
  setCart,
  createNotification,
}) {
  return (
    <div className="RestaurantList">
      <Stack alignItems="center" spacing="40px" direction="column">
        <h2>Shops:</h2>
        <ButtonRestaurant
          disabled={!cartIsEmpty}
          onClick={() => chooseRestaurant(mcMenu)}
        >
          <b>McDonny</b>
        </ButtonRestaurant>
        <ButtonRestaurant
          disabled={!cartIsEmpty}
          onClick={() => chooseRestaurant(cfkMenu)}
        >
          <b>CFK</b>
        </ButtonRestaurant>
        <ButtonRestaurant
          disabled={!cartIsEmpty}
          onClick={() => chooseRestaurant(johnsMenu)}
        >
          <b>Uncle John's</b>
        </ButtonRestaurant>
        <ButtonRestaurant
          disabled={!cartIsEmpty}
          onClick={() => chooseRestaurant(sonimodMenu)}
        >
          <b>Sonimod Pizza</b>
        </ButtonRestaurant>
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
