import "../styles/App.css";
import { ThemeProvider } from "@mui/system";
import { theme, ButtonFooter } from "../components/MuiCustomized.js";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Footer />

      <Component {...pageProps} />
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
