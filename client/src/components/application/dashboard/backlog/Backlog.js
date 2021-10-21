import { useRef, useState, useEffect } from "react";
import { makeStyles, Box, LinearProgress, lighten, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import IssuesTable from "./IssuesTable";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";
import IssueCreationForm from "components/forms/IssueCreationForm";
import CreateSprintForm from "components/forms/CreateSprintForm";
import AddingIssuesToExistingSprintForm from "components/forms/AddingIssuesToExistingSprintForm";
import DialogForm from "components/subComponents/DialogForm";

import { useProjectContext } from "contexts/ProjectContext";

export default function Backlog() {
	const { projectId, currentUserRole } = useProjectContext();
	const getParams = useRef({ project_id: projectId });
	const [issueUrlToBeDeleted, setIssueUrlToBeDeleted] = useState(null);
	const [selectedIssues, setSelectedIssues] = useState([]);
	const [openIssueCreationForm, setOpenIssueCreationForm] = useState(false);
	const [openSprintCreationForm, setOpenSprintCreationForm] = useState(false);
	const [openTransferIssuesToSprintForm, setOpenTransferIssuesToSprintForm] = useState(false);

	const [issuesList, setIssuesList] = useState([]);
	const [openErrorPopup, setOpenErrorPopup] = useState(false);
	let {
		receivedData: getIssuesReceivedData,
		error: getIssuesError,
		isLoading: isLoadingGetIssues,
		isResolved: isResolvedGetIssues,
		isRejected: isRejectedGetIssues,
	} = useGetFetch("api/issues/", getParams.current);

	let {
		error: deleteIssueError,
		isLoading: isLoadingDeleteIssue,
		isResolved: isResolvedDeleteIssue,
		isRejected: isRejectedDeleteIssue,
	} = useDeleteFetch(issueUrlToBeDeleted);

	function openIssueCreationDialog() {
		setOpenIssueCreationForm(true);
	}
	function handleCancelIssueCreation() {
		setOpenIssueCreationForm(false);
	}

	function openSprintCreationDialog() {
		setOpenSprintCreationForm(true);
	}

	function handleCancelSprintCreation() {
		setOpenSprintCreationForm(false);
	}

	function openTransferIssuesToSprintDialog() {
		setOpenTransferIssuesToSprintForm(true);
	}

	function handleCancelTransferIssuesToSprint() {
		setOpenTransferIssuesToSprintForm(false);
	}

	const insertNewIssues = (newIssueObj) => {
		issuesList.unshift(newIssueObj);
		setIssuesList(issuesList);
		handleCancelIssueCreation();
	};

	const handleDeleteIssueClick = (issueId) => {
		setIssueUrlToBeDeleted(`api/issues/${issueId}`);
	};

	useEffect(() => {
		if (isRejectedDeleteIssue) setOpenErrorPopup(true);
		if (!isResolvedDeleteIssue) return;

		const deletedIssueId = Number(issueUrlToBeDeleted.split("/").pop());
		setIssuesList((issuesList) => issuesList.filter((item) => item.id !== deletedIssueId));
	}, [isResolvedDeleteIssue, isRejectedDeleteIssue, issueUrlToBeDeleted]);

	useEffect(() => {
		if (!isResolvedGetIssues) return;
		setIssuesList(getIssuesReceivedData);
	}, [isResolvedGetIssues, getIssuesReceivedData]);

	return (
		<>
			<DialogForm
				title="Create new issue"
				open={openIssueCreationForm}
				onClose={handleCancelIssueCreation}
				maxWidth="md"
			>
				<IssueCreationForm
					projectId={projectId}
					onClose={handleCancelIssueCreation}
					insertCreation={insertNewIssues}
				/>
			</DialogForm>
			<DialogForm
				title="Create new sprint"
				open={openSprintCreationForm}
				onClose={handleCancelSprintCreation}
				maxWidth="md"
			>
				<CreateSprintForm projectId={projectId} issuesIds={selectedIssues} />
			</DialogForm>
			<DialogForm
				title="Transfer issues to existing spring"
				open={openTransferIssuesToSprintForm}
				onClose={handleCancelTransferIssuesToSprint}
			>
				<AddingIssuesToExistingSprintForm
					projectId={projectId}
					issuesIds={selectedIssues}
				/>
			</DialogForm>

			<Box>
				{isLoadingGetIssues ? <LinearProgress style={{ width: "100%" }} /> : null}
				{isRejectedGetIssues ? <Alert severity="error">{getIssuesError} </Alert> : null}
				{!isResolvedGetIssues ? null : (
					<IssuesTable
						isSprintIssuesTable={false}
						issuesTableProps={{
							openIssueCreationDialog,
							openSprintCreationDialog,
							openTransferIssuesToSprintDialog,
							setSelectedIssues,
							handleDeleteIssueClick,
							isLoadingDeleteIssue,
							issuesList,
							selectedIssues,
						}}
					/>
				)}
			</Box>

			<Snackbar
				onClose={() => {
					setOpenErrorPopup((prev) => !prev);
				}}
				open={openErrorPopup}
				autoHideDuration={6000}
			>
				<Alert severity={"error"}>{deleteIssueError}</Alert>
			</Snackbar>
		</>
	);
}
