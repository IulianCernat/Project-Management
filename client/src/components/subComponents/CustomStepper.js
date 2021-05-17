import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

function getSteps() {
	return ["Create team", "Select scrum master"];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return "Step 1: Select campaign settings...";
		case 1:
			return "Step 2: What is an ad group anyways?";
		default:
			return "Unknown step";
	}
}

export default function CustomStepper() {
	const [activeStep, setActiveStep] = useState(0);

	const steps = getSteps();

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<Stepper alternativeLabel linear activeStep={activeStep}>
			{steps.map((label, index) => (
				<Step key={label}>
					<StepButton>{label}</StepButton>
				</Step>
			))}
		</Stepper>
	);
}
