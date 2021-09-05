import { Box, Container, Paper, Link, Typography } from "@material-ui/core";
import LoginForm from "../forms/LoginForm";
import { Link as RouterLink } from "react-router-dom";

export default function Login() {
	return (
		<Container maxWidth="sm">
			<Paper elevation={3}>
				<Box mt={8} p={5}>
					<LoginForm />
					<Box display="flex" justifyContent="space-between" mt={4} flexWrap="wrap">
						<Link component={RouterLink} to="/forgotPassword">
							<Typography noWrap>Forgot password?</Typography>
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
