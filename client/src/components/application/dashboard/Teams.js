import { useRef, useState } from "react";
import {
	Box,
	Breadcrumbs,
	Typography,
	makeStyles,
	Link,
	Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import TeamCard from "../../subComponents/TeamCard";
import { useGetFetch } from "../../../customHooks/useFetch";
import TeamCreationForm from "../../forms/TeamCreationForm";
import DialogForm from "../../subComponents/DialogForm";
import {
	Link as RouterLink,
	Switch,
	Route,
	useRouteMatch,
} from "react-router-dom";
import TeamPage from "./TeamPage";
const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: "15rem",
	},
}));

function TeamComponentList(teamList) {
	let match = useRouteMatch();
	return (
		<>
			{teamList.length
				? teamList.map((item) => {
						return (
							<TeamCard
								linkTo={`${match.path}/${item.id}`}
								width="50ch"
								key={item.id}
								{...item}
							/>
						);
				  })
				: null}
		</>
	);
}
export default function Teams() {
	let match = useRouteMatch();
	const styles = useStyles();
	const [openTeamCreation, setOpenTeamCreation] = useState(false);
	const getParams = useRef({ project_id: 73 });
	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch("api/teams/", getParams.current, false);

	function openTeamCreationForm() {
		setOpenTeamCreation(true);
	}
	function handleCancel() {
		setOpenTeamCreation(false);
	}
	return (
		<>
			<Switch>
				<Route path={`${match.path}/:teamId`}>
					<TeamPage />
				</Route>
				<Route path={`${match.path}`}>
					<Box
						display="flex"
						flexWrap="wrap"
						mb={2}
						justifyContent="space-between"
						alignItems="baseline"
					>
						<Breadcrumbs aria-label="breadcrumb">
							<Link color="inherit" href="/">
								Material-UI
							</Link>
							<Link color="inherit" href="/getting-started/installation/">
								Core
							</Link>
							<Typography color="textPrimary">Breadcrumb</Typography>
						</Breadcrumbs>
						<Button
							variant="contained"
							color="primary"
							onClick={() => openTeamCreationForm()}
						>
							<Typography>Add new team</Typography>
						</Button>
					</Box>

					<Box
						display="flex"
						justifyContent="center"
						flexWrap="wrap"
						style={{ gap: "1rem" }}
					>
						{isResolved ? TeamComponentList(receivedData) : null}
						{isLoading ? "loading" : null}
						{isRejected ? <Alert severity="error">{error} </Alert> : null}
					</Box>
					<DialogForm
						title="Add new team"
						open={openTeamCreation}
						onClose={handleCancel}
					>
						<TeamCreationForm />
					</DialogForm>
				</Route>
			</Switch>
		</>
	);
}
