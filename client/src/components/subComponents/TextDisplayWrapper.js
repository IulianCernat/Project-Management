import { Typography, Box, makeStyles } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  textWrapper: {
    maxWidth: "100%",
    wordWrap: "break-word",
    overflow: "hidden",
    background: "lightBlue",
    textOverflow: "ellipsis",
    
  },
}));
export default function TextDisplayWrapper({ children, ...other }) {
  const classes = useStyles();

  return (
    <Box className={classes.textWrapper}>
      <Typography  component="p" align="center" {...other}>
        {children}
      </Typography>
    </Box>
  );
}
