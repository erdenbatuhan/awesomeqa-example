import { useEffect, useState } from "react";
import { Chip } from "@mui/material";

type TicketStatusChipPropsType = {
  status: string;
  count?: number;
  noBorder?: boolean;
}

const STATUS_CHIP_COLOR = {
  "open": "primary",
  "closed": "success",
  "removed": "error"
};

const TicketStatusChip = ({ status, count, noBorder = false }: TicketStatusChipPropsType) => {
  const [chipLabel, setChipLabel] = useState<string>("");

  useEffect(() => {
    setChipLabel(count === undefined ? status : `${status}: ${count}`);
  }, [status, count]);

  return (
    <>
      <Chip
        label={chipLabel}
        color={STATUS_CHIP_COLOR[status]}
        sx={{
          "minWidth": "80px",
          "textAlign": "center",
          "borderRadius": noBorder ? 0 : "16px"
        }}
      />
    </>
  );
}

export default TicketStatusChip;
