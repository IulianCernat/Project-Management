import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  makeStyles,
  Divider,
} from "@material-ui/core";

import Avatar from "../../subComponents/Avatar";

const useStyles = makeStyles((theme) => ({
  identity: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      marginTop: theme.spacing(4),
    },
  },
  textWrapper: {
    maxWidth: "100%",
    wordWrap: "break-word",
  },
}));

export default function Aside() {
  const classes = useStyles();
  return (
    <Paper elevation={5}>
      <Box p={3}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs md={12}>
            <Box className={classes.identity}>
              <Box style={{ width: "10em", height: "10em" }}>
                <Avatar url="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-cat-wearing-sunglasses-while-sitting-royalty-free-image-1571755145.jpg?crop=0.670xw:1.00xh;0.147xw,0&resize=768:*" />
              </Box>
              <Box className={classes.textWrapper}>
                <Typography component="p" align="center">
                  Cernat Iulian Constanting Cernovski Ivan
                </Typography>
              </Box>
            </Box>
            <Divider />
          </Grid>

          <Grid
            item
            container
            xs
            md={12}
            direction="column"
            spacing={3}
            alignItems="flex-start"
          >
            <Grid item>
              <Typography variant="h6">Contact</Typography>
              <Typography>iulian.cernat@gmail.com</Typography>
            </Grid>

            <Grid item>
              <Button fullWidth variant="contained" color="primary">
                <Typography>Account settings</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
