import { useState, useEffect } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, LinearProgress
} from "@mui/material";

import MessageCard from "../messageCard";

import TicketService from "../../../services/ticketService";
import type Ticket from "../../../types/ticket.type";

interface TicketDetailsDialogPropsType {
  dialogShown: boolean;
  ticket: Ticket;
  onClose: () => void;
}

const TicketDetailsDialog = ({
  dialogShown, ticket, onClose
}: TicketDetailsDialogPropsType) => {
  const [ticketMessages, setTicketMessages] = useState([]);

  useEffect(() => {
    if (!dialogShown || !ticket) return;

    setTicketMessages(null); // Set to null to visualize loading

    TicketService.getTicketContextMessages(ticket.id)
      .then((ticketCountsResponse) => {
        setTicketMessages(ticketCountsResponse.data);
      })
      .catch((err) => {
        console.error(`An error occurred while fetching the ticket's context messages. (Error: ${err.message})`);
        setTicketMessages([]);
      });
  }, [dialogShown, ticket]);

  return (
    <>
      <Dialog
        open={dialogShown}
        onClose={onClose}
      >
        <DialogTitle>
          Ticket Details
        </DialogTitle>

        <DialogContent>
          <MessageCard
            ticketStatus={ticket && ticket.status}
            message={ticket && ticket.msg}
            borderColored
          />

          <hr />

          <Typography
            variant="overline"
            sx={{ display: "flex", justifyContent: "center", mb: 1 }}
          >
            Ticket Messages
          </Typography>

          <Box sx={{ height: 350, overflowY: "auto" }}>
            {ticketMessages ? (
              ticketMessages.map(message => (
                <Box
                  sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  key={message.id}
                >
                  <MessageCard
                    message={message}
                    dense
                  />
                </Box>
              ))
            ) : (
              <>
                <LinearProgress />
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketDetailsDialog;
