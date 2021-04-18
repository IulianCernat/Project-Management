import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [addiditionalUserInfo, setAdditionalUserInfo] = useState();
    const [tokenId, setTokenId] = useState();
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
        const unsubscribe = auth.onAuthStateChanged(async user => {
            setCurrentUser(user);
            if (user)
            try {
                let userIdToken = await user.getIdToken();
                let response = await fetch('api/users/loggedUser',
                    {
                        headers: {
                            'Authorization': userIdToken,
                        },
                        method: 'GET'
                    });
                setTokenId(userIdToken)
                let profile = await response.json()
                setAdditionalUserInfo(profile)

            } catch (err) {
                console.log(err);

            }


            setLoading(false);
        });
        return unsubscribe;
    }, [])

    const value = {
        addiditionalUserInfo,
        setAdditionalUserInfo,
        currentUser,
        login,
        signUp,
        logout,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}