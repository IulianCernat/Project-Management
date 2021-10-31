import React, { useContext, createContext, useState, useEffect } from "react";
import { auth } from "utils/firebase";
import { doGet } from "customHooks/useFetch";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [additionalUserInfo, setAdditionalUserInfo] = useState();
	const [loading, setLoading] = useState(true);

	function signUp(email, password) {
		return auth.createUserWithEmailAndPassword(email, password);
	}

	function login(email, password) {
		return auth.signInWithEmailAndPassword(email, password);
	}

	function logout() {
		return auth.signOut();
	}

	function resetPassword(email) {
		return auth.sendPasswordResetEmail(email);
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setCurrentUser(user);

			if (user)
				try {
					const userIdToken = await user.getIdToken();
					let { error, receivedData: profile } = await doGet(
						"api/users/loggedUser",
						null,
						false,
						{
							Authorization: `firebase_token_id=${userIdToken}`,
						}
					);
					setAdditionalUserInfo(profile);
				} catch (err) {
					console.log(err);
				}

			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const value = {
		additionalUserInfo,
		setAdditionalUserInfo,
		currentUser,
		login,
		signUp,
		logout,
		resetPassword,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
