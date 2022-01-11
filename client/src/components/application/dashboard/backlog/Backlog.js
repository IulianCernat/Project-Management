import { useRef, useState, useEffect, useCallback } from "react";
import { Box, LinearProgress, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import IssuesTable from "./IssuesTable";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";
import IssueCreationForm from "components/forms/IssueCreationForm";
import CreateSprintForm from "components/forms/CreateSprintForm";
import AddingIssuesToExistingSprintForm from "components/forms/AddingIssuesToExistingSprintForm";
import DialogForm from "components/subComponents/DialogForm";

import { useProjectContext } from "contexts/ProjectContext";

export default function Backlog() {
	const { projectId } = useProjectContext();
	const getParams = useRef({ project_id: projectId });
	const [issueUrlToBeDeleted, setIssueUrlToBeDeleted] = useState(null);
	const [selectedIssues, setSelectedIssues] = useState([]);
	const [openIssueCreationForm, setOpenIssueCreationForm] = useState(false);
	const [openSprintCreationForm, setOpenSprintCreationForm] = useState(false);
	const [openTransferIssuesToSprintForm, setOpenTransferIssuesToSprintForm] = useState(false);
	const [issuesList, setIssuesList] = useState([]);
	const [openErrorPopup, setOpenErrorPopup] = useState(false);
	const [performIssueUpdate, setPerformIssueUpdate] = useState(false);
	const [issueUpdateData, setIssueUpdateData] = useState();

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
		setPerformIssueUpdate(false);
		setIssueUpdateData(null);
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

	const insertNewIssues = useCallback((newIssueObj) => {
		setIssuesList((prevIssueList) => [newIssueObj, ...prevIssueList]);
		handleCancelIssueCreation();
	}, []);

	const updateIssuesWithNewIssue = useCallback((newUpdatedIssueObj) => {
		handleCancelIssueCreation();
		setIssuesList((prevIssuesList) => {
			const indexOfUpdatedIssue = prevIssuesList.findIndex((item) => item.id === newUpdatedIssueObj.id);
			prevIssuesList[indexOfUpdatedIssue] = newUpdatedIssueObj;
			return [...prevIssuesList];
		});
	}, []);

	const handleDeleteIssueClick = (issueId) => {
		setIssueUrlToBeDeleted(`api/issues/${issueId}`);
	};

	const handleUpdateIssueClick = (issueId) => {
		setIssueUpdateData(issuesList.find((item) => item.id === issueId));
		setPerformIssueUpdate(true);
		setOpenIssueCreationForm(true);
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
				title={performIssueUpdate ? "Update issue" : "Create new issue"}
				open={openIssueCreationForm}
				onClose={handleCancelIssueCreation}
				maxWidth="md"
			>
				<IssueCreationForm
					performIssueUpdate={performIssueUpdate}
					updateIssuesWithNewIssue={updateIssuesWithNewIssue}
					issueUpdateData={issueUpdateData}
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
				<AddingIssuesToExistingSprintForm projectId={projectId} issuesIds={selectedIssues} />
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
							handleUpdateIssueClick,
							isLoadingDeleteIssue,
							selectedIssues,
						}}
						issuesList={issuesList}
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
