import { NextPage } from "next";
import {
  Box, Grid
} from "@mui/material";

import TicketFilter from "../../components/tickets/ticketFilter";
import TicketTable from "../../components/tickets/ticketTable";

const rows = []

const Tickets: NextPage = () => {
  return (
    <>
      <Box sx={{flexGrow: 1, mt: 5, mb: 5}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <TicketFilter
                onApply={(filters) =>
                  console.log(filters)
                }
              />
            </Box>

            <Box>
              <TicketTable
                rows={rows}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Tickets;
