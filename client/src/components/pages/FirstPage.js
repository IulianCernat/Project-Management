import React from 'react';

import { Box, Container } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignUpForm from '../forms/SignUpForm';
import LoginForm from '../forms/LoginForm';
import ForgotPasswordForm from '../forms/ForgotPasswordForm';

export default function FirstPage() {
    return (
        <Container maxWidth="sm">

            <Box mt={8}>
                <Router>
                    <Switch>
                        <Route path="/signup" component={SignUpForm} />
                        <Route path="/login" component={LoginForm} />
                        <Route path="/forgotPassword" component={ForgotPasswordForm} />
                    </Switch>

                </Router>

            </Box>

        </Container>

    )
}
