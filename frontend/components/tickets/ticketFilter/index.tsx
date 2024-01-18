import { useState } from "react";
import {
  Grid, TextField, MenuItem, Button
} from "@mui/material";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

type TicketFilterPropsType = {
  onApply: (filter: Object) => void;
}

const STATUS_VALUES = ["open", "closed", /* "removed" */];
const EMPTY_FILTER = {
  status: "",
  author: "",
  message: "",
  startDate: null,
  endDate: null
};

const TicketFilter = ({ onApply }: TicketFilterPropsType) => {
  const [filter, setFilters] = useState(EMPTY_FILTER);

  const resetFilters = () => setFilters(EMPTY_FILTER);
  const applyFilters = () => onApply(filter);

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
              setFilters({ ...filter, status: e.target.value as string })
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
              setFilters({ ...filter, author: e.target.value })
            }
          />
        </Grid>

        {/* Message */}
        <Grid item>
          <TextField
            label="Message"
            value={filter.message}
            onChange={(e) =>
              setFilters({ ...filter, message: e.target.value })
            }
          />
        </Grid>

        {/* Start Date */}
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              slotProps={{
                textField: { error: false }
              }}
              value={filter.startDate}
              onChange={(newValue) =>
                setFilters({ ...filter, startDate: newValue })
              }
              sx={{ width: 180 }}
            />
          </LocalizationProvider>
        </Grid>

        {/* End Date */}
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              slotProps={{
                textField: { error: false }
              }}
              value={filter.endDate}
              onChange={(newValue) =>
                setFilters({ ...filter, endDate: newValue })
              }
              sx={{ width: 180 }}
            />
          </LocalizationProvider>
        </Grid>

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
