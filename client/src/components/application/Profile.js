import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { Button, Typography } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom"

export default function Profile() {
    const { currentUser, logout, addiditionalUserInfo} = useAuth();
    const history = useHistory();
    async function handleLogout() {
        try {
            await logout()
            history.push("/login")
        } catch (e) {
            console.log(e)
        }

    }

    return (
        <>
            {currentUser.email}
            {addiditionalUserInfo.fullName}
            {addiditionalUserInfo.contact}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogout}
            >
                <Typography>
                    Logout
                </Typography>
            </Button>
        </>
    )
}
