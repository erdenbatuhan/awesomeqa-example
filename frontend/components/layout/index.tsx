import { Container } from "@mui/material";

import HomeHeader from "./header";
import Footer from "./footer";

const Layout = ({ children }: JSX.ElementChildrenAttribute) => {
  return (
    <>
      <Container maxWidth="lg">
        <HomeHeader />
        <>
        {children}
        </>
        <Footer />
      </Container>
    </>
  );
};

export default Layout;
