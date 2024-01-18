import { ChangeEvent, MouseEvent } from "react";
import { TablePagination as MuiTablePagination } from "@mui/material";

import TablePaginationActions from "./tablePaginationActions";

interface TablePaginationProps {
  colSpan: number;
  count: number;
  page: number;
  pageSize: number;
  onChange: (
    page: number,
    pageSize: number
  ) => void;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 25, 50, { label: "All", value: -1 }]

const TablePagination = ({ colSpan, count, page, pageSize, onChange }: TablePaginationProps) => {
  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    onChange(newPage, pageSize);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(0, parseInt(event.target.value, 10));
  };

  return (
    <>
      <MuiTablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        colSpan={colSpan}
        count={count}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </>
  )
};

export default TablePagination;
