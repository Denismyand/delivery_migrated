import "../styles/App.css";
import { ThemeProvider } from "@mui/system";
import { theme, ButtonFooter } from "../components/MuiCustomized.js";
import { AppWrapper } from "../context/state.js";
import { NotificationContainer } from "react-notifications";

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
      <a href="/">
        <ButtonFooter>Shop </ButtonFooter>
      </a>

      <div className="VerticalLine"></div>
      <a href="/cart">
        <ButtonFooter>Cart </ButtonFooter>
      </a>
    </div>
  );
}
