import { forwardRef, useMemo } from "react";
import { Divider, List, ListItem, ListItemIcon, ListItemText, Box } from "@material-ui/core";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { Home, GroupSharp, ViewList, Dashboard } from "@material-ui/icons";
import { GiSprint } from "react-icons/gi";

const iconArray = [
	<Dashboard />,
	<GroupSharp />,
	<ViewList />,
	<GiSprint />,
	// <Settings />,
];

const pageNames = ["overview", "teams", "backlog", "sprints", "settings"];

function ListItemLink(props) {
	const { icon, primary, to } = props;

	const CustomLink = useMemo(
		() => forwardRef((linkProps, ref) => <RouterLink ref={ref} to={to} {...linkProps} />),
		[to]
	);

	return (
		<ListItem button component={CustomLink} style={{ whiteSpace: "nowrap" }}>
			<ListItemIcon style={{ color: grey[300] }}>{icon}</ListItemIcon>
			<ListItemText style={{ color: grey[300] }} primary={primary} />
		</ListItem>
	);
}

export default function DrawerListItems() {
	let match = useRouteMatch();
	return (
		<Box>
			<List>
				<ListItemLink primary="Profile" icon={<Home />} to={"/"} />
			</List>

			<Divider style={{ backgroundColor: "hsla(209, 58%, 25%)" }} />
			<List>
				{["Overview", "Teams", "Product Backlog", "Sprints"].map((text, index) => (
					<ListItemLink
						key={text}
						primary={text}
						icon={iconArray[index]}
						to={`${match.url}/${pageNames[index]}`}
					/>
				))}
			</List>
		</Box>
	);
}
