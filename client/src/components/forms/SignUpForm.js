import React, { useState } from 'react'
import { Box, Typography, Button, Grid, Paper, Link } from '@material-ui/core';
import { TextFieldWrapper } from './InputFieldsWrappers'
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';
import {
    emailValidationSchema,
    passwordValidationSchema,
    fullNameValidationSchema,
} from '../../utils/validationSchemas';

const validationSchema = Yup.object().shape({
    email: emailValidationSchema,
    fullName: fullNameValidationSchema,
    password: passwordValidationSchema
})



export default function SignUpForm() {
    const { signUp } = useAuth();
    const [error, setError] = useState('');
    const history = useHistory();

    return (
        <Paper elevation={3} >
            <Box p={2}>
                <Typography>
                    Sign up for your account
                </Typography>
                <Formik
                    initialValues={{
                        email: '',
                        fullName: '',
                        password: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            setError('');
                            let userCredential = await signUp(values.email, values.fullName, values.password);
                            let userIdToken = await userCredential.user.getIdToken()
                            let response = await fetch('api/users/',
                                {
                                    headers: {
                                        'Authorization': userIdToken,
                                        'Content-Type': 'application/json',
                                    },
                                    method: 'POST',
                                    body: JSON.stringify({ fullName: values.fullName })
                                });

                            history.push('/');
                            setSubmitting(false);

                        } catch (err) {
                            console.log(err)
                            setError("Failed to create an account");
                        }
                    }}
                >
                    {({ values, isSubmitting }) => (
                        <Form>
                            <Grid direction="column" container spacing={2}>
                                <Grid item>
                                    <TextFieldWrapper
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"

                                    />
                                </Grid>
                                <Grid item xs={false} sm={6}>
                                    <TextFieldWrapper
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="fullName"
                                        label="Full name"
                                        type="text"
                                        id="fullName"
                                    />
                                </Grid>

                                <Grid item>
                                    <TextFieldWrapper
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        <Typography>
                                            Sign In
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Link onMouseDown={(event) => { event.preventDefault() }} component={RouterLink} to="/login">
                                        <Typography align="center">
                                            Already have an account? Login
                                        </Typography>
                                    </Link>
                                    {error && <Button color="secondary">{error}</Button>}
                                </Grid>

                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Paper>
    );
}
