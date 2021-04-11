import React, { useState } from 'react'
import { Box, Typography, Button, Grid, Paper, Link, MenuItem, makeStyles } from '@material-ui/core';
import { TextFieldWrapper, SelectFieldWrapper } from './InputFieldsWrappers'
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom'
import {
    emailValidationSchema,

} from '../../utils/validationSchemas';


const validationSchema = Yup.object().shape({
    email: emailValidationSchema,
})


export default function ForgotPasswordForm() {
    return (
        <Paper elevation={3} >
            <Box p={2}>
                <Typography>
                    Sign up for your account
                </Typography>
                <Formik
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            console.log(values);
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({ isSubmitting }) => (
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
                                <Grid item>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        <Typography>
                                            Send email
                                        </Typography>

                                    </Button>
                                </Grid>
                                <Grid item container justify="space-between">
                                    <Grid item>
                                        <Link onMouseDown={(event) => { event.preventDefault() }} component={RouterLink} to="/login">
                                            <Typography >
                                                Already have an account? Login
                                        </Typography>
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

                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Paper>
    );
}
