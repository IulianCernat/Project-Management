import { useState } from "react";
import {
	Avatar,
	Box,
	IconButton,
	Typography,
	Button,
	Link,
	ClickAwayListener,
	Slide,
} from "@material-ui/core";
import { useAuth } from "contexts/AuthContext";
import { useHistory, Link as RouterLink } from "react-router-dom";

export default function AppMenuNav() {
	const { additionalUserInfo, logout, currentUser } = useAuth();
	const [openAppbardOptions, setOpenAppbarOptions] = useState(false);
	const history = useHistory();

	const handleLogout = async () => {
		try {
			await logout();
			history.push("/login");
		} catch (e) {
			console.log(e);
		}
	};

	const handleClick = (event) => {
		setOpenAppbarOptions(true);
	};

	const handleClickAway = () => {
		setOpenAppbarOptions(false);
	};
	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<Box display="flex" alignItems="center">
				<Box display="flex" style={{ gap: "1rem" }} alignItems="center">
					<Typography>{additionalUserInfo.fullName}</Typography>
					<IconButton onClick={handleClick}>
						<Avatar src={additionalUserInfo.avatar_url} />
					</IconButton>
				</Box>
				<Box>
					<Slide
						direction="left"
						in={openAppbardOptions}
						mountOnEnter
						unmountOnExit
					>
						<Box>
							<Button variant="contained" onClick={handleLogout}>
								Logout
							</Button>
						</Box>
					</Slide>
				</Box>
			</Box>
		</ClickAwayListener>
	);
}
