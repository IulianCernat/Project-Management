import { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "components/authentication/Login";
import SignUp from "components/authentication/SignUp";
import ForgotPassword from "components/authentication/ForgotPassword";
import { Particle } from "jparticles";
import PrivateRoute from "utils/PrivateRoute";
import Profile from "components/application/profile/Profile";
import { useAuth } from "contexts/AuthContext";
import { Box } from "@material-ui/core";

const backgroundParticlesStyling = {
	backgroundColor: "#0F0B11",
	position: "absolute",
	flexGrow: 1,
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	zIndex: -1,
};

export default function FrontPage() {
	const { currentUser, additionalUserInfo } = useAuth();
	useEffect(() => {
		new Particle("#backgroundParticlesStyling", {
			range: 0,
			num: 0.1,
			minSpeed: 0.04,
			maxSpeed: 0.09,
			minR: 1,
			maxR: 2,
		});
	}, []);
	return (
		<Box display="flex" flexDirection="column">
			<div
				id="backgroundParticlesStyling"
				style={backgroundParticlesStyling}
			></div>
			<Switch>
				<PrivateRoute exact path="/" component={Profile} />
				<Route
					path="/login"
					render={() => {
						return currentUser ? <Redirect to="/" /> : <Login />;
					}}
				/>
				<Route
					path="/signup"
					render={() => {
						return currentUser && additionalUserInfo ? (
							<Redirect to="/" />
						) : (
							<SignUp />
						);
					}}
					component={SignUp}
				/>
				<Route
					path="/forgotPassword"
					render={() => {
						return currentUser ? <Redirect to="/" /> : <ForgotPassword />;
					}}
				/>
			</Switch>
		</Box>
	);
}
