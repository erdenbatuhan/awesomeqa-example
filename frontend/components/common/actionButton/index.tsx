import { ReactElement, cloneElement } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Typography,
  CardActionArea
} from "@mui/material";

import styles from "./actionButton.module.css";

type ActionButtonPropsType = {
  title: string;
  iconElement: ReactElement;
  nextRoute?: string;
}

const ActionButton = ({ title, iconElement, nextRoute = "/" }: ActionButtonPropsType) => {
  const router = useRouter();

  return (
    <Card className={styles.buttonCard}>
      <CardActionArea className={styles.buttonActionArea} onClick={() => router.push(nextRoute)}>
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

export default ActionButton;
