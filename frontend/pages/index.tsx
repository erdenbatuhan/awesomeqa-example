import { Box, Grid, Button } from "@mui/material";

const IndexPage = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 15, mb: 15 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "50%", height: "4rem", fontSize: "1.2rem" }}
                href="/home"
              >
                Home
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default IndexPage;
