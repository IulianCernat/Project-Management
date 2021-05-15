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
import TextDisplayWrapper from "../../subComponents/TextDisplayWrapper";

const useStyles = makeStyles((theme) => ({
	identity: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		"& > *": {
			marginTop: theme.spacing(4),
		},
	},
}));

export default function ProfileAside() {
	const classes = useStyles();
	return (
		<Paper elevation={5}>
			<Box p={3} display="flex" direction="column">
				<Grid container alignItems="center" spacing={2}>
					<Grid item xs md={12}>
						<Box className={classes.identity}>
							<Box style={{ width: "10em", height: "10em" }}>
								<Avatar url="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-cat-wearing-sunglasses-while-sitting-royalty-free-image-1571755145.jpg?crop=0.670xw:1.00xh;0.147xw,0&resize=768:*" />
							</Box>
							<TextDisplayWrapper>
								CernatIulianConstantingCernovskiIvanjjjjjjjjjjjjjjjjjjjjjjjjj
							</TextDisplayWrapper>
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
