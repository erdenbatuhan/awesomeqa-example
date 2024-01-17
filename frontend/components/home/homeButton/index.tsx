import { ReactElement, cloneElement } from "react";
import {
  Card,
  Typography,
  CardActionArea
} from "@mui/material";

import styles from "./homeButton.module.css";

type HomeButtonPropsType = {
  title: string;
  iconElement: ReactElement;
}

const HomeButton = ({ title, iconElement }: HomeButtonPropsType) => {
  return (
    <Card className={styles.buttonCard}>
      <CardActionArea className={styles.buttonActionArea}>
        <Typography className={styles.buttonIconWrapper}>
          {cloneElement(iconElement, {
            className: styles.buttonIcon,
          })}
        </Typography>

        <Typography className={styles.buttonTextWrapper} variant="h5">
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default HomeButton;
