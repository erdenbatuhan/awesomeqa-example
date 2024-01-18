import { useEffect, useState } from "react";
import { Chip } from "@mui/material";

import styles from "../../common/actionButton/actionButton.module.css";

interface TicketStatusChipPropsType {
  status: string;
  count?: number;
}

const STATUS_CHIP_COLOR = {
  "open": "primary",
  "closed": "success",
  "removed": "error"
};

const TicketStatusChip = ({ status, count }: TicketStatusChipPropsType) => {
  const [chipLabel, setChipLabel] = useState("");

  useEffect(() => {
    setChipLabel(count === undefined ? status : `${status}: ${count}`);
  }, [status, count]);

  return (
    <>
      <Chip
        label={chipLabel}
        color={STATUS_CHIP_COLOR[status]}
        className={styles.chip}
      />
    </>
  );
}

export default TicketStatusChip;
