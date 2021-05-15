import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { Link } from "@material-ui/core";
import { Mail, Inbox } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	listItem: {
		fontWeight: 500,
	},
}));
export default function DrawerListItems() {
	const classes = useStyles();
	let match = useRouteMatch();
	return (
		<List>
			{[
				"Overview",
				"Teams",
				"Architecture",
				"Product Backlog",
				"Sprints",
				"Settings",
			].map((text, index) => (
				<ListItem button key={text}>
					<ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
					<ListItemText
						disableTypography
						primary={
							<Typography className={classes.listItem}>
								<Link component={RouterLink} to={`${match.url}/teams`}>
									{text}
								</Link>
							</Typography>
						}
					/>
				</ListItem>
			))}
		</List>
	);
}
