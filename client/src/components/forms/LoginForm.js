import React, { useState } from 'react'
import { Box, Typography, Button, Grid, Paper, Link } from '@material-ui/core';
import { TextFieldWrapper } from './InputFieldsWrappers'
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { emailValidationSchema, passwordValidationSchema } from '../../utils/validationSchemas';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const validationSchema = Yup.object({
    email: emailValidationSchema,
    password: passwordValidationSchema
});

export default function LoginForm() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const history = useHistory();

    return (
        <Paper elevation={3} >
            <Box p={5}>

                <Typography>
                    Login into your account
                </Typography>
                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await login(values.email, values.password);
                           
                            history.push('/')
                            setSubmitting(false);
                        } catch (err) {
                            console.log(err);
                        }

                    }}
                >
                    {({ isSubmitting }) => (


                        <Form>
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
                        </Form>
                    )}
                </Formik>

                <Grid container justify="space-between" mt={8}>
                    <Grid item>
                        <Link onMouseDown={(event) => { event.preventDefault() }} component={RouterLink} to="/forgotPassword">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link onMouseDown={(event) => { event.preventDefault() }} component={RouterLink} to="/signup">
                            <Typography>
                                Don't have an account? Sign Up
                            </Typography>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Paper>

    );
}
