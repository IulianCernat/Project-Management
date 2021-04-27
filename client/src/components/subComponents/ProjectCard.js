import { Paper, Typography, Box, Divider, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LabelledLiniarProgress } from "../../components/subComponents/Progress";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexFlow: "wrap",
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
      $divider: {
        orientation: "horizontal",
      },
    },
  },
  textWrapper: {
    maxWidth: "100%",
    maxHeight: "8ch",
    textOverflow: "ellipsis",
    overflow: "hidden",
    wordWrap: "break-word",
  },
  divider: {
    orientation: "vertical",
  },
}));

export default function ProjectCard() {
  const classes = useStyles();
  return (
    <Paper elevation={3} className={classes.paper}>
      <Box flex={1} display="flex" flexDirection="column" mr={1}>
        <Typography color="primary" variant="h6">
          Project title
        </Typography>
        <Typography
          component="div"
          variant="body1"
          color="textSecondary"
          align="left"
        >
          <Box className={classes.textWrapper}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for 'lorem ipsum' will uncover many web
            sites still in their infancy. Various versions have evolved over the
            years, sometimes by accident, sometimes on purpose (injected humour
            and the like).
          </Box>
        </Typography>
      </Box>

      {/* <Divider flexItem className={classes.divider} orientation="vertical" /> */}

      <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
        <LabelledLiniarProgress value={50} />
        <Box display="flex">
          <Box flex="1 1 100%">
            <AvatarGroup spacing="small" max={4}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
              <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
              <Avatar
                alt="Trevor Henderson"
                src="/static/images/avatar/5.jpg"
              />
            </AvatarGroup>
          </Box>
          <Box flex={1}>
            <Typography>Created at</Typography>
            <Typography>21.10.2018</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
