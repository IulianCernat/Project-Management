import { forwardRef, useMemo } from "react";
import { Divider, List, ListItem, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";

import { Home, GroupSharp, ViewList, Settings, Dashboard } from "@material-ui/icons";
import { SiAffinitydesigner } from "react-icons/si";
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
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText primary={primary} />
		</ListItem>
	);
}

export default function DrawerListItems() {
	let match = useRouteMatch();
	return (
		<>
			<List>
				<ListItemLink primary="Profile" icon={<Home />} to={"/"} />
			</List>

			<Divider />
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
		</>
	);
}
