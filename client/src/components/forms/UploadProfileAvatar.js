import { useState, useEffect, useRef } from "react";
import { storage } from "utils/firebase";
import PropTypes from "prop-types";
import { usePatchFetch } from "customHooks/useFetch";
import { useAuth } from "contexts/AuthContext";
import { Alert } from "@material-ui/lab";

UploadProfileAvatar.propTypes = {
	uploadButtonLabel: PropTypes.string.isRequired,
	setUploadingProgress: PropTypes.func.isRequired,
	setUploadingFileError: PropTypes.func.isRequired,
};
export default function UploadProfileAvatar({
	uploadButtonLabel,
	setUploadingProgress,
	setUploadingFileError,
}) {
	const { currentUser, setAdditionalUserInfo } = useAuth();
	const requestHeaders = useRef(null);
	const [requestBodyForUpdatingCurrentUser, setRequestBodyForUpdatingCurrentUser] =
		useState(null);
	const {
		error: userUpdateError,
		isLoading: isLoadingUserUpdate,
		isRejected: isRejectedUserUpdate,
		isResolved: isResolvedUserUpdate,
	} = usePatchFetch(
		"api/users/loggedUser",
		requestBodyForUpdatingCurrentUser,
		requestHeaders.current
	);

	useEffect(() => {
		currentUser.getIdToken().then((idToken) => {
			requestHeaders.current = {
				Authorization: idToken,
			};
		});
	}, [currentUser]);

	useEffect(() => {
		if (isResolvedUserUpdate) {
			const newUrl = requestBodyForUpdatingCurrentUser.match(/https.*\w/);
			setAdditionalUserInfo((prev) => ({ ...prev, avatar_url: newUrl }));
		} // eslint-disable-next-line
	}, [isResolvedUserUpdate]);

	useEffect(() => {
		setUploadingProgress(isLoadingUserUpdate);
	}, [isLoadingUserUpdate]);

	useEffect(() => {
		if (isRejectedUserUpdate) setUploadingFileError(userUpdateError);
	}, [isRejectedUserUpdate]);

	const handleUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		const uploadTask = storage.ref(`profiles/${currentUser.uid}`).put(file);
		setUploadingProgress(true);
		uploadTask.on("state_changed", {
			complete: () => {
				setUploadingProgress(false);
				uploadTask.snapshot.ref.getDownloadURL().then((url) => {
					setRequestBodyForUpdatingCurrentUser(JSON.stringify({ avatar_url: url }));
				});
			},
		});
	};
	return (
		<>
			<input
				onChange={handleUpload}
				accept="image/*"
				style={{ display: "none" }}
				id={uploadButtonLabel}
				multiple
				type="file"
			/>
		</>
	);
}
