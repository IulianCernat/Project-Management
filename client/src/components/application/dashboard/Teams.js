import {
	Box,
	Card,
	CardActionArea,
	CardHeader,
	Typography,
	makeStyles,
	CardContent,
} from "@material-ui/core";
import TeamCard from "../../subComponents/TeamCard";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: "15rem",
	},
}));
export default function Teams() {
	const styles = useStyles();

	return (
		<Box display="flex" flexWrap="wrap">
			<TeamCard />
			<TeamCard />
			<TeamCard />
		</Box>
	);
}
