import { Box } from "@mui/material";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
        Have fun! Made with love in unknown
      </Box>
    </footer>
  );
};

export default Footer;
