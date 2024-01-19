import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Layout from "../components/layout";
import "../styles/globals.css";
import AlertComponent from "../components/common/alertComponent";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Layout>
        <Component {...pageProps} />
      </Layout>

      <AlertComponent />
    </ThemeProvider>
  );
}

export default MyApp;
