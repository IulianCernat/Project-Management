import { Box, Container, Paper, Link, Typography } from "@material-ui/core";
import ForgotPasswordForm from "../forms/ForgotPasswordForm";
import { Link as RouterLink } from "react-router-dom";

export default function ForgotPassword() {
	return (
		<Container maxWidth="sm">
			<Paper elevation={3}>
				<Box mt={8} p={5}>
					<ForgotPasswordForm />
					<Box
						display="flex"
						justifyContent="space-between"
						mt={4}
						flexWrap="wrap"
					>
						<Link component={RouterLink} to="/login">
							<Typography noWrap>Already have an account? Login</Typography>
						</Link>

						<Link component={RouterLink} to="/signup">
							<Typography noWrap>Don't have an account? Sign Up</Typography>
						</Link>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
