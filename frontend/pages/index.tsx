import { Box, Grid } from "@mui/material";
import HomeOutlined from "@mui/icons-material/HomeOutlined";

import ActionButton from "../components/common/actionButton";

const IndexPage = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 15, mb: 15 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ActionButton
                title="Home"
                iconElement={<HomeOutlined />}
                nextRoute="/home"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default IndexPage;
