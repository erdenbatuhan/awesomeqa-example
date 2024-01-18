import { useState, useEffect } from "react";
import { NextPage } from "next";
import {
  Box, Grid
} from "@mui/material";

import TicketStatusChip from "../../components/tickets/ticketStatusChip";
import TicketFilter from "../../components/tickets/ticketFilter";
import type { Filter } from "../../components/tickets/ticketFilter";
import TicketTable from "../../components/tickets/ticketTable";
import ConfirmationDialog from "../../components/common/confirmationDialog";

import TicketService from "../../services/ticketService";
import type Ticket from "../../services/types/ticket.type";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;

const Tickets: NextPage = () => {
  const [statusTicketCounts, setStatusTicketCounts] = useState({});
  const [totalNumTickets, setTotalNumTickets] = useState(0);
  const [tickets, setTickets] = useState([]);

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filterApplied, setFilterApplied] = useState({});

  const [lastSelectedTicket, setLastSelectedTicket] = useState(null);
  const [lastSelectedAction, setLastSelectedAction] = useState(null);
  const [confirmationDialogShown, setConfirmationDialogShown] = useState(false);

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

  const fetchTickets = () => {
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
  }

  useEffect(() => {
    fetchTickets();
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

  const setStatusCountsAfterUpdate = (oldStatus: string, newStatus: string): void => {
    statusTicketCounts[oldStatus] -= 1;
    statusTicketCounts[newStatus] += 1;

    setStatusTicketCounts(statusTicketCounts);
  }

  const closeTicket = (ticket: Ticket): void => {
    TicketService.closeTicket(ticket.id)
      .then(() => {
        // Fetch all tickets after closing the ticket
        fetchTickets();

        // Update status ticket counts
        setStatusCountsAfterUpdate(ticket.status, "closed");
      })
      .catch((err) => {
        console.error(`An error occurred while closing the ticket. (Error: ${err.message})`);
      });
  }

  const removeTicket = (ticket: Ticket): void => {
    TicketService.removeTicket(ticket.id)
      .then(() => {
        // Fetch all tickets after removing the ticket
        fetchTickets();

        // Update status ticket counts
        setStatusCountsAfterUpdate(ticket.status, "removed");
      })
      .catch((err) => {
        console.error(`An error occurred while removing the ticket. (Error: ${err.message})`);
      });
  }

  const takeAction = (): void => {
    if (lastSelectedAction === "CLOSE") {
      closeTicket(lastSelectedTicket);
    } else {
      removeTicket(lastSelectedTicket);
    }
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
                onTicketClose={(ticketIdx: number, ticket: Ticket): void => {
                  setLastSelectedTicket(ticket);
                  setLastSelectedAction("CLOSE");
                  setConfirmationDialogShown(true);
                }}
                onTicketRemove={(ticketIdx: number, ticket: Ticket): void => {
                  setLastSelectedTicket(ticket);
                  setLastSelectedAction("DELETE");
                  setConfirmationDialogShown(true);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <ConfirmationDialog
        dialogShown={confirmationDialogShown}
        action={lastSelectedAction}
        itemName="ticket"
        onConfirm={takeAction}
        onClose={() => setConfirmationDialogShown(false)}
      />
    </>
  );
};

export default Tickets;
