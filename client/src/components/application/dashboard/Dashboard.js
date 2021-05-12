import { useState } from "react";
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
  Box,
  makeStyles,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import CustomDrawer from "../../subComponents/CustomDrawer";

const drawerWidth = "18rem";

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth})`,
      marginLeft: drawerWidth,
    },
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [mobileOpen, setmobileOpen] = useState(false);

  function handleDrawerToggle() {
    setmobileOpen(!mobileOpen);
  }

  return (
    <Box display="flex">
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <Hidden mdUp>
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <Menu />
            </IconButton>
          </Hidden>
          <Typography variant="h6" noWrap>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <CustomDrawer
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
    </Box>
  );
}
