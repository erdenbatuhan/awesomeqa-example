import { NextPage } from "next";
import { Box, Grid } from "@mui/material";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

import ActionButton from "../../components/common/actionButton";

const Home: NextPage = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 15, mb: 15 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: "1em" }}>
              <ActionButton
                title="Knowledge Base"
                iconElement={<LibraryBooksOutlinedIcon />}
              />

              <ActionButton
                title="Tickets"
                iconElement={<SupportAgentOutlinedIcon />}
              />

              <ActionButton
                title="FAQ Insights"
                iconElement={<LightbulbOutlinedIcon />}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Home;
