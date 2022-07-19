import "../styles/App.css";
import "../styles/Shop.css";
import "../styles/Cart.css";
import "../styles/Coupons.css";
import "../styles/Orders.css";

import { AppWrapper } from "../context/state.js";
import { ThemeProvider } from "@mui/system";
import { theme, ButtonHeader } from "../components/MuiCustomized.js";
import { NotificationContainer } from "react-notifications";
import Link from "next/link";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Header />
        <Component {...pageProps} />
        <NotificationContainer />
      </AppWrapper>
    </ThemeProvider>
  );
}
function Header() {
  return (
    <div className="Header">
      <Link href="/">
        <a>
          <ButtonHeader>Shop</ButtonHeader>
        </a>
      </Link>
      <div className="VerticalLine" />
      <Link href="/cart">
        <a>
          <ButtonHeader>Cart</ButtonHeader>
        </a>
      </Link>
      <div className="VerticalLine" />
      <Link href="/orders">
        <a>
          <ButtonHeader>Orders</ButtonHeader>
        </a>
      </Link>
      <div className="VerticalLine" />
      <Link href="/coupons">
        <a>
          <ButtonHeader>Coupons</ButtonHeader>
        </a>
      </Link>
    </div>
  );
}
