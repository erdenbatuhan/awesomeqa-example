import { useState, useEffect } from "react";
import { NextPage } from "next";
import {
  Box, Grid
} from "@mui/material";

import TicketStatusChip from "../../components/tickets/ticketStatusChip";
import TicketFilter from "../../components/tickets/ticketFilter";
import type { Filter } from "../../components/tickets/ticketFilter";
import TicketTable from "../../components/tickets/ticketTable";

import TicketService from "../../services/ticketService";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;

const Tickets: NextPage = () => {
  const [statusTicketCounts, setStatusTicketCounts] = useState({});
  const [totalNumTickets, setTotalNumTickets] = useState(0);
  const [tickets, setTickets] = useState([]);

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filterApplied, setFilterApplied] = useState({});

  useEffect(() => {
    setTotalNumTickets(null);

    TicketService.getTicketCounts()
      .then((ticketCountsResponse) => {
        setStatusTicketCounts(ticketCountsResponse.data);
      })
      .catch((err) => {
        console.error(`An error occurred while fetching the ticket counts. (Error: ${err.message})`);
        setTotalNumTickets(0);
      });
  }, []);

  useEffect(() => {
    setTickets(null); // Set to null to visualize loading

    TicketService.getTickets(page, pageSize, {
      author: filterApplied["author"] || undefined,
      msgContent: filterApplied["message"] || undefined,
      statusList: filterApplied["status"] ? [filterApplied["status"]] : ['open', 'closed'],
      timestampStart: filterApplied["startDate"] ? toLocalISOString(filterApplied["startDate"]) : undefined,
      timestampEnd: filterApplied["endDate"] ? toLocalISOString(filterApplied["endDate"], true) : undefined
    })
      .then((ticketsResponse) => {
        setTotalNumTickets(ticketsResponse.data.ticket_count)
        setTickets(ticketsResponse.data.tickets);
      })
      .catch((err) => {
        console.error(`An error occurred while fetching the tickets. (Error: ${err.message})`);
        setTickets([]);
      });
  }, [filterApplied, page, pageSize]);

  const toLocalISOString = (date: Date, end_of_day: boolean = false): string => {
    const offset = new Date(date).getTimezoneOffset();
    const isoString = new Date(new Date(date).getTime() - offset * 60 * 1000).toISOString();
    const time = !end_of_day ? "00:00:00": "23:59:59";

    return `${isoString.slice(0, -14)}T${time}`
  }

  const handleFilterChange = (filter: Filter): void => {
    setFilterApplied(filter);

    // Reset the page variables
    setPage(DEFAULT_PAGE);
    setPageSize(DEFAULT_PAGE_SIZE);
  }

  return (
    <>
      <Box sx={{flexGrow: 1, mt: 5, mb: 5}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <TicketFilter onApply={handleFilterChange} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: "1em" }}>
              {['open', 'closed', 'removed'].map(status => (
                <TicketStatusChip key={status} status={status} count={statusTicketCounts[status] || 0} />
              ))}
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
