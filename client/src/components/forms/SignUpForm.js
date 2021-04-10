import React from 'react'
import { Box, Typography, Button, Grid, Paper, Link } from '@material-ui/core';
import { TextFieldWrapper } from './InputFields'
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {emailValidationSchema, passwordValidationSchema} from '../../utils/validationSchemas';

const validationSchema = Yup.object({
    email: emailValidationSchema,
    password: passwordValidationSchema
});

export default function SignUpForm() {
    return (
        <Paper elevation={3} >
            <Box p={5}>

                <Typography>
                    Sign up for your account
                    </Typography>
                <Formik
                    initialValues={{
                        email: '',
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
                            autoFocus
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
                        >
                            Sign In
                        </Button>
                    </Form>
                </Formik>

                <Grid container justify="space-between" mt={8}>
                    <Grid item>
                        <Link href="#">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#">
                            Don't have an account? Sign Up
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
