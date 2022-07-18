import "../styles/App.css";
import "../styles/Shop.css";
import "../styles/Cart.css";
import "../styles/Orders.css";
import "../styles/Coupons.css";


import { AppWrapper } from "../context/state.js";
import { ThemeProvider } from "@mui/system";
import { theme, ButtonFooter } from "../components/MuiCustomized.js";
import { NotificationContainer } from "react-notifications";
import Link from "next/link";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Footer />
        <Component {...pageProps} />
        <NotificationContainer />
      </AppWrapper>
    </ThemeProvider>
  );
}
function Footer() {
  return (
    <div className="Footer">
      <Link href="/">
        <a>
          <ButtonFooter>Shop</ButtonFooter>
        </a>
      </Link>
      <div className="VerticalLine" />
      <Link href="/cart">
        <a>
          <ButtonFooter>Cart</ButtonFooter>
        </a>
      </Link>
      <div className="VerticalLine" />
      <Link href="/orders">
        <a>
          <ButtonFooter>Orders</ButtonFooter>
        </a>
      </Link>
      <div className="VerticalLine" />
      <Link href="/coupons">
        <a>
          <ButtonFooter>Coupons</ButtonFooter>
        </a>
      </Link>
    </div>
  );
}
