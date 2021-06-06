import { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "components/authentication/Login";
import SignUp from "components/authentication/SignUp";
import ForgotPassword from "components/authentication/ForgotPassword";
import Particles from "particlesjs";

const canvasStyling = {
	backgroundColor: "#0F0B11",
	position: "absolute",
	display: "block",
	top: 0,
	left: 0,
	zIndex: -1,
};

export default function FrontPage() {
	// useEffect(() => {
	// 	Particles.init({
	// 		selector: ".background",
	// 		connectParticles: true,
	// 		color: "#88C8FF",
	// 		speed: 0.2,
	// 		minDistance: 160,
	// 		sizeVariations: 5,
	// 	});
	// }, []);
	return (
		<>
			{/* <canvas className="background" style={canvasStyling}></canvas> */}
			<Switch>
				<Route exact path="/" component={Login} />
				<Route path="/login" component={Login} />
				<Route path="/signup" component={SignUp} />
				<Route path="/forgotPassword" component={ForgotPassword} />
			</Switch>
		</>
	);
}
