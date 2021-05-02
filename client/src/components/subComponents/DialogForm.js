import { useState } from "react";
import {
    Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContextText,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import PropTypes from "prop-types";

DialogForm.propTypes = {
    title: PropTypes.string.isRequired
};
export default function DialogForm(props) {
 
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));


  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogActions>
       <IconButton onClick={props.onClose}>
            <CancelIcon/>
       </IconButton>
      </DialogActions>
      <DialogTitle id="dialog-title">{props.title}</DialogTitle>
      <DialogContent>
          {props.children}
      </DialogContent>
    </Dialog>
  );
}
