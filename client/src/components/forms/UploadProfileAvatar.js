import { useState, useEffect } from "react";
import { storage } from "utils/firebase";
import PropTypes from "prop-types";
import { usePatchFetch } from "customHooks/useFetch";
import { useAuth } from "contexts/AuthContext";
UploadProfileAvatar.propTypes = {
	uploadButtonLabel: PropTypes.string.isRequired,
	setUploadingProgress: PropTypes.func.isRequired,
};
export default function UploadProfileAvatar(props) {
	const { currentUser, setAdditionalUserInfo } = useAuth();
	const [currentUserIdToken, setCurrentUserIdToken] = useState();

	const [requestBodyForUpdatingCurrentUser, setRequestBodyForUpdatingCurrentUser] =
		useState(null);
	const {
		receivedData: userUpdateReceivedData,
		error: userUpdateError,
		isLoading: isLoadingUserUpdate,
		isRejected: isRejectedUserUpdate,
		isResolved: isResolvedUserUpdate,
	} = usePatchFetch("api/users/loggedUser", requestBodyForUpdatingCurrentUser, {
		Authorization: currentUserIdToken,
	});

	useEffect(() => {
		currentUser.getIdToken().then((idToken) => {
			setCurrentUserIdToken(idToken);
		});
	}, []);

	useEffect(() => {
		if (isResolvedUserUpdate) {
			const newUrl = requestBodyForUpdatingCurrentUser.match(/https.*\w/);
			setAdditionalUserInfo((prev) => ({ ...prev, avatar_url: newUrl }));
		}
	}, [isResolvedUserUpdate]);

	const handleUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		const uploadTask = storage.ref(`profiles/${currentUser.uid}`).put(file);
		props.setUploadingProgress(true);
		uploadTask.on("state_changed", {
			complete: () => {
				props.setUploadingProgress(false);
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
				id={props.uploadButtonLabel}
				multiple
				type="file"
			/>
		</>
	);
}
