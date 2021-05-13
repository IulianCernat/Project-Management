import React from "react";
import { Box, Container } from "@material-ui/core";
import LoginForm from "../forms/LoginForm";

export default function Login() {
	return (
		<Container maxWidth="sm">
			<Box mt={8}>
				<LoginForm />
			</Box>
		</Container>
	);
}
