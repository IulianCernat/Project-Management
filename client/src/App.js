import "fontsource-roboto";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";
import ForgotPassword from "./components/authentication/ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectProvider } from "contexts/ProjectContext";
import PrivateRoute from "./utils/PrivateRoute";
import Profile from "./components/application/profile/Profile";
import Dashboard from "./components/application/dashboard/Dashboard";
function App() {
	return (
		<>
			<CssBaseline />
			<BrowserRouter>
				<AuthProvider>
					<ProjectProvider>
						<Switch>
							<PrivateRoute exact path="/">
								<Profile />
							</PrivateRoute>
							<PrivateRoute path="/dashboard">
								<Dashboard />
							</PrivateRoute>

							<Route path="/login">
								<Login />
							</Route>
							<Route path="/signUp">
								<SignUp />
							</Route>
							<Route path="/forgotPassword">
								<ForgotPassword />
							</Route>
						</Switch>
					</ProjectProvider>
				</AuthProvider>
			</BrowserRouter>
		</>
	);
}

export default App;
