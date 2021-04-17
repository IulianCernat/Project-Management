import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [addiditionalUserInfo, setAdditionalUserInfo] = useState();

    const [loading, setLoading] = useState(true);

    function signUp(email, password, fullName) {
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
        const unsubscribe = auth.onAuthStateChanged(user => {
            try {
                setCurrentUser(user);
            } catch (err) {
                console.log(err);

            }

            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, [])

    const value = {
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