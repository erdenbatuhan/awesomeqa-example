import { useState } from "react";
import {
  Grid, TextField, MenuItem, Button
} from "@mui/material";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import localeEnGB from "dayjs/locale/en-gb";

export interface Filter {
  status: string;
  author: string;
  message: string;
  startDate: Date;
  endDate: Date;
}

type TicketFilterPropsType = {
  onApply: (filter: Filter) => void;
}

const STATUS_VALUES = ["open", "closed", /* "removed" */];
const EMPTY_FILTER: Filter = {
  status: "",
  author: "",
  message: "",
  startDate: null,
  endDate: null
};

const TicketFilter = ({ onApply }: TicketFilterPropsType) => {
  const [filter, setFilter] = useState(EMPTY_FILTER);

  const resetFilters = (): void => {
    setFilter(EMPTY_FILTER);
    onApply(EMPTY_FILTER);
  };

  const applyFilters = (): void => onApply(filter);

  return (
    <>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {/* Status */}
        <Grid item>
          <TextField
            label="Status"
            select
            value={filter.status}
            onChange={(e) =>
              setFilter({ ...filter, status: e.target.value as string })
            }
            sx={{ width: 120 }}
          >
            {STATUS_VALUES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Author */}
        <Grid item>
          <TextField
            label="Author"
            value={filter.author}
            onChange={(e) =>
              setFilter({ ...filter, author: e.target.value })
            }
          />
        </Grid>

        {/* Message */}
        <Grid item>
          <TextField
            label="Message"
            value={filter.message}
            onChange={(e) =>
              setFilter({ ...filter, message: e.target.value })
            }
          />
        </Grid>

        {/* Start Date */}
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DatePicker
              label="Start Date"
              slotProps={{
                textField: { error: false }
              }}
              value={filter.startDate}
              onChange={(newValue) =>
                setFilter({ ...filter, startDate: newValue })
              }
              sx={{ width: 180 }}
            />
          </LocalizationProvider>
        </Grid>

        {/* End Date */}
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DatePicker
              label="End Date"
              slotProps={{
                textField: { error: false }
              }}
              value={filter.endDate}
              onChange={(newValue) =>
                setFilter({ ...filter, endDate: newValue })
              }
              sx={{ width: 180 }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Need this to for "en-gb" locale to work! */}
        <p style={{ display: "none" }}>{localeEnGB.formats.LLLL}</p>

        {/* Action Buttons */}
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={ applyFilters }
            disabled={Object.values(filter).every(val => !val)}
            sx={{ mr: 1 }}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={ resetFilters }
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default TicketFilter;
