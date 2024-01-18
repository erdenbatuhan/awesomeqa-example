import { useState, useEffect } from "react";
import {
  Avatar, Box, IconButton, Paper, Tooltip, Typography, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow,
} from "@mui/material";
import { MoreHoriz as InfoIcon, Check as CheckIcon, Delete as DeleteIcon } from "@mui/icons-material";

import TicketStatusChip from "../ticketStatusChip";
import TablePagination from "../../common/tablePagination";

import type Ticket from "../../../types/ticket.type";

interface TicketTableProps {
  totalNumRows: number;
  currentRows: Ticket[];
  page: number;
  pageSize: number;
  onPageChange: (
    page: number,
    pageSize: number
  ) => void;
  onTicketClose: (
    ticketIdx: number,
    ticket: Ticket
  ) => void;
  onTicketRemove: (
    ticketIdx: number,
    ticket: Ticket
  ) => void;
}

const TABLE_COLUMNS = ["Status", "Author", "Message", "Creation", "Status Update", ""]

const TicketTable = ({
   totalNumRows, currentRows, page, pageSize, onPageChange, onTicketClose, onTicketRemove
}: TicketTableProps) => {
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    // Enhance the rows readability (e.g., format dates for better readability)
    setTableRows(currentRows && currentRows.map(item => ({
      ...item,
      "timestamp": formatDate(item["timestamp"]),
      "ts_last_status_change": item["ts_last_status_change"]
        ? formatDate(item["ts_last_status_change"])
        : formatDate(item["timestamp"])
    })));
  }, [currentRows]);

  const formatDate = (dateString: string): string => new Date(dateString).toLocaleString();

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} stickyHeader>
          <TableHead>
            <TableRow>
              {TABLE_COLUMNS.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tableRows ? (
              tableRows.map((row, idx) => (
                <TableRow key={row["id"]}>
                  <TableCell component="th" scope="row">
                    <TicketStatusChip status={row["status"]} />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Avatar
                        src={row["msg"]["author"]["avatar_url"]}
                        sx={{
                          border: `2px solid ${row["msg"]["author"]["color"]}`,
                          borderRadius: "50%",
                        }}
                      />

                      <Typography variant="caption">
                        {row["msg"]["author"]["name"]}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ width: 400 }}>
                    {row["msg"]["content"]}
                  </TableCell>

                  <TableCell sx={{ width: 150 }}>
                    {row["timestamp"]}
                  </TableCell>

                  <TableCell sx={{ width: 150 }}>
                    {row["ts_last_status_change"]}
                  </TableCell>

                  <TableCell>
                    <Tooltip title="See Ticket Details" arrow>
                      <IconButton color="info">
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Close Ticket" arrow>
                      <IconButton
                        color="success"
                        disabled={row["status"] !== "open"}
                        sx={{
                          opacity: row["status"] === "open" ? 1 : 0.3
                        }}
                      >
                        <CheckIcon onClick={(): void => { onTicketClose(idx, row) }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Ticket" arrow>
                      <IconButton color="warning">
                        <DeleteIcon onClick={(): void => { onTicketRemove(idx, row) }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <>
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="overline" color="textSecondary" gutterBottom>
                      Loading ...
                    </Typography>

                    <LinearProgress />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={6}
                count={totalNumRows}
                page={page}
                pageSize={pageSize}
                onChange={onPageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
};

export default TicketTable;
