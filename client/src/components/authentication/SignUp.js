import React from "react";
import { Box, Container, Paper, Link, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import SignUpForm from "../forms/SignUpForm";

export default function SignUp() {
	return (
		<Container maxWidth="sm">
			<Paper elevation={3}>
				<Box mt={8} p={5}>
					<SignUpForm />
					<Box
						display="flex"
						justifyContent="space-between"
						mt={4}
						flexWrap="wrap"
					>
						<Link component={RouterLink} to="/login">
							<Typography noWrap>Already have an account? Login</Typography>
						</Link>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
