import { useState } from "react";
import {
	Avatar,
	Box,
	IconButton,
	Typography,
	Button,
	ClickAwayListener,
	Slide,
} from "@material-ui/core";
import { useAuth } from "contexts/AuthContext";
import { useHistory } from "react-router-dom";

export default function AppMenuNav() {
	const { additionalUserInfo, logout } = useAuth();
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
		<Box>
			<ClickAwayListener onClickAway={handleClickAway}>
				<Box display="flex" alignItems="center">
					<Box display="flex" style={{ gap: "4px" }} alignItems="center">
						<Typography variant="subtitle2">{additionalUserInfo.fullName}</Typography>
						<IconButton onClick={handleClick}>
							<Avatar src={additionalUserInfo.avatar_url} />
						</IconButton>
					</Box>
					<Box>
						<Slide direction="left" in={openAppbardOptions} mountOnEnter unmountOnExit>
							<Box>
								<Button variant="contained" color="primary" onClick={handleLogout}>
									Logout
								</Button>
							</Box>
						</Slide>
					</Box>
				</Box>
			</ClickAwayListener>
		</Box>
	);
}
