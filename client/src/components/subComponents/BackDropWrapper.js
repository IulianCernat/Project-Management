import { useState } from "react";
import { Backdrop, makeStyles } from "@material-ui/core";

export default function BackDropWrapper() {
	return (
		<Backdrop className={classes.backdrop}>
			<IconButton
				color="secondary"
				onClick={() => {
					handleDeletionClick(item.id);
				}}
			>
				{isLoading ? <CircularProgress /> : <DeleteForever fontSize="large" />}
			</IconButton>
		</Backdrop>
	);
}
