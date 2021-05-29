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
import { Home, GroupSharp, ViewList, Settings } from "@material-ui/icons";
import { SiAffinitydesigner } from "react-icons/si";
import { GiSprint } from "react-icons/gi";
const useStyles = makeStyles((theme) => ({
	listItem: {
		fontWeight: 500,
	},
}));

const iconArray = [
	<Home />,
	<GroupSharp />,
	<SiAffinitydesigner />,
	<ViewList />,
	<GiSprint />,
	<Settings />,
];

const pageNames = [
	"overview",
	"teams",
	"architecture",
	"backlog",
	"sprints",
	"settings",
];
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
					<ListItemIcon>{iconArray[index]}</ListItemIcon>
					<ListItemText
						disableTypography
						primary={
							<Typography className={classes.listItem}>
								<Link
									component={RouterLink}
									to={`${match.url}/${pageNames[index]}`}
								>
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
