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
			if (user)
				try {
					const userIdToken = await user.getIdToken();
					const idTokenResult = await user.getIdTokenResult();
					const firebaseUserClaims = idTokenResult.claims;

					let { error, receivedData: profile } = await doGet("api/user_profiles/loggedUser", null, {
						Authorization: `firebase_id_token=${userIdToken}`,
					});
					setAdditionalUserInfo({ firebaseUserClaims, ...profile });

					if (error) throw error;
				} catch (err) {
					console.log(err);
				}
			setCurrentUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const value = {
		authIsLoading: loading,
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
