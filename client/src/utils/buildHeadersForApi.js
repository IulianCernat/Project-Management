export async function buildHeadersForApi(currentUser) {
	const firebaseIdToken = await currentUser.getIdToken();
	const trelloToken = localStorage.getItem("trello_token");

	return { Authorization: `firebase_id_token=${firebaseIdToken},trello_token=${trelloToken}` };
}
