import "fontsource-roboto";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";
import ForgotPassword from "./components/authentication/ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import Profile from "./components/application/profile/Profile";
import Dashboard from "./components/application/dashboard/Dashboard";
import FrontPage from "./components/application/frontPage/FrontPage";
function App() {
	return (
		<>
			<CssBaseline />
			<BrowserRouter>
				<AuthProvider>
					<Switch>
						<PrivateRoute
							strict
							path="/dashboard/project/:projectId"
							component={Dashboard}
						/>
						<Route exact path="/" component={FrontPage} />
					</Switch>
				</AuthProvider>
			</BrowserRouter>
		</>
	);
}

export default App;
