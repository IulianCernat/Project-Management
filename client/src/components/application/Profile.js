import React from 'react'
import {useAuth} from '../../contexts/AuthContext';

export default function Profile() {
    const { currentUser, logout } = useAuth();
    return (
        <div>
            {currentUser.email};
        </div>
    )
}
