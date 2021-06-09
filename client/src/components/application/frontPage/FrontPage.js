import { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "components/authentication/Login";
import SignUp from "components/authentication/SignUp";
import ForgotPassword from "components/authentication/ForgotPassword";
import Particles from "particlesjs";
import PrivateRoute from "utils/PrivateRoute";
import Profile from "components/application/profile/Profile";
import { useAuth } from "contexts/AuthContext";

const canvasStyling = {
	backgroundColor: "#0F0B11",
	position: "absolute",
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	zIndex: -1,
};

export default function FrontPage() {
	const { currentUser } = useAuth();
	useEffect(() => {
		Particles.init({
			selector: ".background",
			connectParticles: true,
			color: "#88C8FF",
			speed: 0.2,
			minDistance: 160,
			sizeVariations: 5,
		});
	}, []);
	return (
		<>
			<canvas className="background" style={canvasStyling}></canvas>
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
						return currentUser ? <Redirect to="/" /> : <SignUp />;
					}}
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
