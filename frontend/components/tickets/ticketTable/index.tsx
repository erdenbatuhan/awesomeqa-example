import { useState } from "react";
import {
  Avatar, Box, Chip, IconButton, Paper, Tooltip, Typography,
  Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow,
} from "@mui/material";
import { MoreHoriz as InfoIcon, Delete as DeleteIcon } from "@mui/icons-material";

import TablePagination from "../../common/tablePagination";

interface TicketTableProps {
  rows: any[];
}

const TicketTable = ({ rows }: TicketTableProps) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const STATUS_CHIP_COLOR = {
    "open": "primary",
    "closed": "success",
    "removed": "error"
  };

  const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleString() : "-";

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * pageSize - rows.length) : 0;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>Update Date</TableCell>
              <TableCell>Action Buttons</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(pageSize > 0
                ? rows.slice(page * pageSize, page * pageSize + pageSize)
                : rows
            ).map((row) => (
              <TableRow key={row["id"]}>
                <TableCell component="th" scope="row">
                  <Chip
                    label={row["status"]}
                    color={STATUS_CHIP_COLOR[row["status"]]}
                    sx={{
                      "minWidth": "80px",
                      "textAlign": "center",
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Avatar
                      src={row["msg"]["author"]["avatar_url"]}
                    />

                    <Typography variant="caption">
                      {row["msg"]["author"]["name"]}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  {row["msg"]["content"]}
                </TableCell>

                <TableCell>
                  {row["timestamp"]}
                </TableCell>

                <TableCell>
                  {row["ts_last_status_change"]}
                </TableCell>

                <TableCell>
                  <Tooltip title="See Ticket Details" arrow>
                    <IconButton aria-label="edit" color="info">
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Ticket" arrow>
                    <IconButton aria-label="edit" color="warning">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={6}
                count={rows.length}
                page={page}
                pageSize={pageSize}
                onChange={(page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
};

export default TicketTable;
