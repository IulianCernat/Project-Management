import { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "components/authentication/Login";
import SignUp from "components/authentication/SignUp";
import ForgotPassword from "components/authentication/ForgotPassword";
import { Particle } from "jparticles";
import PrivateRoute from "utils/PrivateRoute";
import Profile from "components/application/profile/Profile";
import { useAuth } from "contexts/AuthContext";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const backgroundParticlesStyling = {
	backgroundColor: "#0F0B11",
	height: "auto",
	position: "absolute",
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	zIndex: -1,
	overflow: "hidden",
};

export default function FrontPage() {
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.up("sm"));
	const { currentUser, additionalUserInfo } = useAuth();
	useEffect(() => {
		new Particle("#backgroundParticlesStyling", {
			range: 0,
			num: matches ? 0.08 : 0.05,
			minSpeed: 0.04,
			maxSpeed: 0.09,
			minR: matches ? 10 : 4,
			maxR: matches ? 50 : 10,
		});
	}, [matches]);
	return (
		<>
			<div id="backgroundParticlesStyling" style={backgroundParticlesStyling}></div>
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
						return currentUser && additionalUserInfo ? <Redirect to="/" /> : <SignUp />;
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
		</>
	);
}
