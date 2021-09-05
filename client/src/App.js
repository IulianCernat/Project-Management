import "fontsource-roboto";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

import Dashboard from "./components/application/dashboard/Dashboard";
import FrontPage from "./components/application/frontPage/FrontPage";
function App() {
	return (
		<>
			<CssBaseline />
			<BrowserRouter>
				<AuthProvider>
					<Switch>
						<PrivateRoute path="/dashboard/project/:projectId" component={Dashboard} />
						<Route path="/" component={FrontPage} />
					</Switch>
				</AuthProvider>
			</BrowserRouter>
		</>
	);
}

export default App;
