import { useState, useEffect } from "react";
import { NextPage } from "next";
import {
  Box, Grid
} from "@mui/material";

import { eventBus } from "../../common/eventBus";

import TicketStatusChip from "../../components/tickets/ticketStatusChip";
import TicketFilter from "../../components/tickets/ticketFilter";
import type { Filter } from "../../components/tickets/ticketFilter";
import TicketTable from "../../components/tickets/ticketTable";
import ConfirmationDialog from "../../components/common/confirmationDialog";
import MessageCard from "../../components/tickets/messageCard";
import TicketDetailsDialog from "../../components/tickets/ticketDetailsDialog";

import TicketService from "../../services/ticketService";
import type Ticket from "../../types/ticket.type";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;

type StatusTicketCounts = {
  [key: string]: number;
}

type LAST_SELECTION_ACTION = "INFO" | "CLOSE" | "DELETE";

const Tickets: NextPage = () => {
  const [statusTicketCounts, setStatusTicketCounts] = useState<StatusTicketCounts>({});
  const [totalNumTickets, setTotalNumTickets] = useState<number>(0);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [filterApplied, setFilterApplied] = useState<Filter>({});

  const [lastSelectedTicket, setLastSelectedTicket] = useState<Ticket>(null);
  const [lastSelectedAction, setLastSelectedAction] = useState<LAST_SELECTION_ACTION>(null);
  const [confirmationDialogShown, setConfirmationDialogShown] = useState<boolean>(false);
  const [ticketDetailsDialogShown, setTicketDetailsDialogShown] = useState<boolean>(false);

  useEffect(() => {
    setTotalNumTickets(null); // Set to null to visualize loading

    TicketService.getTicketCounts()
      .then((ticketCountsResponse) => {
        setStatusTicketCounts(ticketCountsResponse.data);
      })
      .catch((err) => {
        eventBus.emit("showAlert", "error", `An error occurred while fetching the ticket counts. (Error: ${err.message})`);
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
        eventBus.emit("showAlert", "error", `An error occurred while fetching the tickets. (Error: ${err.message})`);
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
    setStatusTicketCounts({
      ...statusTicketCounts,
      [oldStatus]: statusTicketCounts[oldStatus] - 1,
      [newStatus]: statusTicketCounts[newStatus] + 1
    });
  }

  const closeTicket = (ticket: Ticket): void => {
    TicketService.closeTicket(ticket.id)
      .then(() => {
        // Fetch all tickets after closing the ticket
        fetchTickets();

        // Update status ticket counts
        setStatusCountsAfterUpdate(ticket.status, "closed");

        eventBus.emit("showAlert", "success", `The ticket has successfully been closed. (ID=${ticket.id})`);
      })
      .catch((err) => {
        eventBus.emit("showAlert", "error", `An error occurred while closing the ticket. (Error: ${err.message})`);
      });
  }

  const removeTicket = (ticket: Ticket): void => {
    TicketService.removeTicket(ticket.id)
      .then(() => {
        // Fetch all tickets after removing the ticket
        fetchTickets();

        // Update status ticket counts
        setStatusCountsAfterUpdate(ticket.status, "removed");

        eventBus.emit("showAlert", "success", `The ticket has successfully been removed. (ID=${ticket.id})`);
      })
      .catch((err) => {
        eventBus.emit("showAlert", "error", `An error occurred while removing the ticket. (Error: ${err.message})`);
      });
  }

  const takeAction = (): void => {
    if (lastSelectedAction === "CLOSE") {
      closeTicket(lastSelectedTicket);
    } else if (lastSelectedAction === "DELETE") {
      removeTicket(lastSelectedTicket);
    }
  }

  return (
    <>
      <Box sx={{flexGrow: 1, mt: 5, mb: 5}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: "1em", mb: 2 }}>
              {['open', 'closed', 'removed'].map(status => (
                <TicketStatusChip
                  key={status}
                  status={status}
                  count={statusTicketCounts[status] || 0}
                />
              ))}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TicketFilter onApply={handleFilterChange} />
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
                onTicketInfoRequest={(ticketIdx: number, ticket: Ticket): void => {
                  setLastSelectedTicket(ticket);
                  setLastSelectedAction("INFO");
                  setTicketDetailsDialogShown(true);
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

      <TicketDetailsDialog
        dialogShown={ticketDetailsDialogShown}
        ticket={lastSelectedTicket}
        onClose={() => setTicketDetailsDialogShown(false)}
      />

      <ConfirmationDialog
        dialogShown={confirmationDialogShown}
        action={lastSelectedAction}
        itemName="ticket"
        dialogContent={(
          <MessageCard
            ticketStatus={lastSelectedTicket && lastSelectedTicket.status}
            message={lastSelectedTicket && lastSelectedTicket.msg}
            borderColored
          />
        )}
        onConfirm={takeAction}
        onClose={() => setConfirmationDialogShown(false)}
      />
    </>
  );
};

export default Tickets;
