import React from "react";
import ForgotPasswordForm from "../forms/ForgotPasswordForm";
import { Container, Box } from "@material-ui/core";

export default function ForgotPassword() {
	return (
		<Container maxWidth="sm">
			<Box mt={8}>
				<ForgotPasswordForm />
			</Box>
		</Container>
	);
}
