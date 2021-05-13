import {
	Card,
	CardActionArea,
	CardHeader,
	CardContent,
	Typography,
	makeStyles,
	Box,
	Badge,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { People } from "@material-ui/icons";
import Avatar from "./Avatar";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: "40ch",
		maxWidth: "40ch",
		flex: 1,
	},
}));
export default function TeamCard() {
	const styles = useStyles();
	return (
		<Card className={styles.root} variant="outlined">
			<CardActionArea>
				<CardHeader
					title={
						<Box display="flex" justifyContent="space-between">
							<Typography variant="h6">C++ clone</Typography>
							<Badge badgeContent={4} color="primary">
								<People fontSize="large" />
							</Badge>
						</Box>
					}
					subheader="12/12/1998"
				/>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Description
					</Typography>
					<Typography gutterBottom>
						hello world hello worldhello worldhello worldhello world hello world
						hello world hello world hello world hello worldhello worldhello
						worldhello world hello world hello world hello world
					</Typography>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						bgcolor={blue[50]}
						p={1}
						borderRadius={20}
					>
						<Box style={{ width: "4rem", height: "4rem" }} mr={1}>
							<Avatar />
						</Box>
						<Box>
							<Typography align="center">Scrum master</Typography>
							<Typography>Cernat Iulian Constantin</Typography>
						</Box>
					</Box>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
