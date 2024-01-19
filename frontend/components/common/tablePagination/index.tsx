import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { TablePagination as MuiTablePagination } from "@mui/material";

import TablePaginationActions from "./tablePaginationActions";

type TablePaginationProps = {
  colSpan: number;
  count: number;
  page: number;
  pageSize: number;
  onChange: (
    page: number,
    pageSize: number
  ) => void;
}

type ROWS_PER_PAGE_OPTIONS_TYPE = (number | { label: string; value: number })[];

const ROWS_PER_PAGE_OPTIONS: ROWS_PER_PAGE_OPTIONS_TYPE = [5, 10, 20, 25, 50]

const TablePagination = ({ colSpan, count, page, pageSize, onChange }: TablePaginationProps) => {
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState<ROWS_PER_PAGE_OPTIONS_TYPE>([])

  useEffect(() => {
    setRowsPerPageOptions([...ROWS_PER_PAGE_OPTIONS, ...[{label: "All", value: count || 0}]]);
  }, [count]);

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    onChange(newPage, pageSize);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    onChange(0, parseInt(event.target.value, 10));
  };

  return (
    <>
      <MuiTablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        colSpan={colSpan}
        count={count || 0}
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
