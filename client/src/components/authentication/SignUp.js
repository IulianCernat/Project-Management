import React from "react";
import { Box, Container } from "@material-ui/core";
import SignUpForm from "../forms/SignUpForm";

export default function SignUp() {
	return (
		<Container maxWidth="sm">
			<Box mt={8}>
				<SignUpForm />
			</Box>
		</Container>
	);
}
