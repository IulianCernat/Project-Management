import { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";

export default function useGetHeaders() {
	const [firebaseIdToken, setFirebaseIdToken] = useState(null);
	const [trelloToken, setTrelloToken] = useState(null);
	const { currentUser } = useAuth();

	useEffect(() => {
		const getCurrentUserIdToken = async () => {
			const idToken = await currentUser.getIdToken();
			setFirebaseIdToken(idToken);
		};
		getCurrentUserIdToken();
		setTrelloToken(localStorage.getItem("trello_token"));
	}, [currentUser]);

	return { Authorization: `firebase_id_token=${firebaseIdToken},trelloToken=${trelloToken}` };
}
