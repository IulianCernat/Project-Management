import React, { useState } from "react";
import {
  Box,
  makeStyles,
  AppBar,
  Tabs,
  Tab,
  Paper,
  Typography,
  Fab,
} from "@material-ui/core";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { grey } from "@material-ui/core/colors";
import ProjectCard from "../../subComponents/ProjectCard";
import DialogForm from "../../subComponents/DialogForm";
import ProjectCreationForm from "../../forms/ProjectCreationForm";

const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: "75vh",
    backgroundColor: grey[200],
  },
  textWrapper: {
    maxWidth: "100%",
    wordWrap: "break-word",
  },
  tabPanel: {
    display: "flex",
    flexFlow: "column wrap",
    "&>:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}));
function TabPanel(props) {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          className={classes.tabPanel}
          p={3}
          display="flex"
          flexDirection="column"
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function Main() {
  const [currentTab, setCurrentTab] = useState(0);
  const [openProjectCreation, setOpenProjectCreation] = useState(false);
  const classes = useStyles();

  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
  }

  function openProjectCreationForm() {
    setOpenProjectCreation(true);
  }
  function handleCancel() {
    setOpenProjectCreation(false);
  }

  return (
    <Paper className={classes.main} elevation={3}>
      <AppBar position="sticky" color="default">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Product Owner" {...a11yProps(0)} />
          <Tab label="Scrum Master" {...a11yProps(1)} />
          <Tab label="Developer" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <Box alignSelf="flex-end">
          <Fab color="primary" onClick={openProjectCreationForm}>
            <AddIcon />
          </Fab>
          <DialogForm title="Create project" open={openProjectCreation} onClose={handleCancel}>
            <ProjectCreationForm />
          </DialogForm>
        </Box>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <ProjectCard />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <ProjectCard />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <ProjectCard />
      </TabPanel>
    </Paper>
  );
}
