import React, { useState } from 'react'
import { Box, Typography, Button, Grid, Paper, Link, MenuItem, makeStyles } from '@material-ui/core';
import { TextFieldWrapper, SelectFieldWrapper } from './InputFieldsWrappers'
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom'
import {
    emailValidationSchema,
    passwordValidationSchema,
    firstNameValidationSchema,
    lastNameValidationSchema,
    studentGroupValidationSchema,
    jobTypeValidationSchema,
    userTypeValidationSchema
} from '../../utils/validationSchemas';


const validationSchema = Yup.object().shape({
    email: emailValidationSchema,
    lastName: lastNameValidationSchema,
    firstName: firstNameValidationSchema,
    password: passwordValidationSchema
})



export default function SignUpForm() {


    return (
        <Paper elevation={3} >
            <Box p={2}>
                <Typography>
                    Sign up for your account
                </Typography>
                <Formik
                    initialValues={{
                        email: '',
                        lastName: '',
                        firstName: '',
                        password: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            console.log(values);
                            setSubmitting(false);
                        }, 400);
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

                                <Grid item container spacing={3}>
                                    <Grid item xs={false} sm={6}>
                                        <TextFieldWrapper
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="lastName"
                                            label="Last name"
                                            type="text"
                                            id="lastName"
                                        />
                                    </Grid>
                                    <Grid item xs={false} sm={6}>
                                        <TextFieldWrapper
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="firstName"
                                            label="first name"
                                            type="text"
                                            id="firstName"
                                        />
                                    </Grid>
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
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Paper>
    );
}
