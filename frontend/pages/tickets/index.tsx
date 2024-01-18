import { useState, useEffect } from "react";
import { NextPage } from "next";
import {
  Box, Grid
} from "@mui/material";

import TicketFilter from "../../components/tickets/ticketFilter";
import TicketTable from "../../components/tickets/ticketTable";

import TicketService from "../../services/ticketService";

const Tickets: NextPage = () => {
  const [totalNumTickets, setTotalNumTickets] = useState(0);
  const [tickets, setTickets] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setTotalNumTickets(null);

    TicketService.getTicketCounts()
      .then((ticketCountsResponse) => {
        setTotalNumTickets(
          Object.values(ticketCountsResponse.data)
            .reduce((totalCount, count) => totalCount + count, 0)
        );
      })
      .catch((err) => {
        console.error(`An error occurred while fetching the ticket counts. (Error: ${err.message})`);
        setTotalNumTickets(0);
      });
  }, []);

  useEffect(() => {
    setTickets(null); // Set to null to visualize loading

    TicketService.getTickets(page, pageSize)
      .then((ticketsResponse) => setTickets(ticketsResponse.data))
      .catch((err) => {
        console.error(`An error occurred while fetching the tickets. (Error: ${err.message})`);
        setTickets([]);
      });
  }, [page, pageSize]);

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
                totalNumRows={totalNumTickets}
                currentRows={tickets}
                page={page}
                pageSize={pageSize}
                onPageChange={(page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Tickets;
