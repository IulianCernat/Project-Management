import * as Yup from "yup";
const minPasswordLen = 8;

const minFullNameLen = 2;

const minProjectNameLen = 2;
const maxProjectNameLen = 255;
const minProjectDescriptionLen = 50;
const maxProjectDescriptionLen = 500;

const minTeamNameLen = 2;
const maxTeamNameLen = 255;
const minTeamDescriptionLen = 50;
const maxTeamDescriptionLen = 500;

const maxIssueTitleLen = 255;
const maxIssueDescriptionLen = 500;

const maxSprintGoalLen = 500;
const maxSprintNameLen = 255;

export const generalInputString = Yup.string().required();

export const emailValidationSchema = Yup.string("Enter your email")
	.email("Enter a valid email")
	.required("Email is required");

export const passwordValidationSchema = Yup.string("Enter your password")
	.min(
		minPasswordLen,
		`Password must be of minimum ${minPasswordLen} characters length`
	)
	.required("Password is required");

export const fullNameValidationSchema = Yup.string("Enter your full name")
	.required("Full name is required")
	.min(
		minFullNameLen,
		`Full name must be of minimum ${minFullNameLen} characters length`
	);

export const projectNameValidSchema = Yup.string("Enter project name")
	.required("Project name is required")
	.min(
		minProjectNameLen,
		`Project name must be of minimum ${minProjectNameLen} characters length`
	)
	.max(
		maxProjectNameLen,
		`Project name must be of maximum ${maxProjectNameLen}`
	);

export const projectDescriptionValidSchema = Yup.string(
	"Enter project description"
)
	.required("Project description is required")
	.min(
		minProjectDescriptionLen,
		`Project description must be of minimum ${minProjectDescriptionLen} characters length`
	)
	.max(
		maxProjectDescriptionLen,
		`Project description must be of maximum ${maxProjectDescriptionLen} characters length`
	);

export const teamNameValidSchema = Yup.string("Enter team name")
	.required("Team name is required")
	.min(
		minTeamNameLen,
		`Team name must be of minimum ${minTeamNameLen} characters length`
	)
	.max(
		maxTeamNameLen,
		`Tea name must of maximum ${maxTeamNameLen} characters length`
	);

export const teamDescriptionValidSchema = Yup.string("Enter team description")
	.required("Team description is required")
	.min(
		minTeamDescriptionLen,
		`Team description must be of minimum ${minTeamDescriptionLen} characters length`
	)
	.max(
		maxTeamDescriptionLen,
		`Team description must be of maximum ${maxTeamDescriptionLen} characters length`
	);

export const searchTermValidSchema = Yup.string("Search")
	.required("Search term is required")
	.max(40, `Search term be of maximum ${5} characters length`);

export const issueTitleValidSchema = Yup.string("Enter issue title")
	.required("Issue title is required")
	.max(
		maxIssueTitleLen,
		`Issue title must be of maximum ${maxIssueTitleLen} characters length`
	);

export const issueDescriptionValidSchema = Yup.string(
	"Enter issue description"
).max(
	maxIssueDescriptionLen,
	`Issue description must be of maximum ${maxIssueDescriptionLen}`
);

export const issueTypeValidSchema = Yup.mixed("Select issue type")
	.oneOf(["bug", "story", "task"])
	.required("Issue type is required");

export const issuePriorityValidSchema = Yup.mixed("Select issue priority")
	.oneOf(["1", "2", "3", "4", "5"])
	.required("Issue priority is required");

export const sprintNameValidSchema = Yup.string("Type sprint name")
	.required("Sprint name is required")
	.max(
		maxSprintNameLen,
		`Sprint name must be of maximum ${maxSprintNameLen} characters length`
	);
export const sprintGoalValidSchema = Yup.string("Enter goal")
	.required("Sprint goal is required")
	.max(
		maxSprintGoalLen,
		`Sprint goal must be of maximum ${maxSprintGoalLen} characters length`
	);

export const sprintDurationValidSchema = Yup.mixed(
	"Choose sprint duration in weeks"
)
	.oneOf(["1", "2", "3", "4"])
	.required("Sprint duration is required");

export const trelloBoardUrlValidSchema = Yup.string(
	"Paste the public trello board link"
)
	.url("Enter a valid url")
	.max(255, "Url must be of maximum 255 characters length");

export const versioningSystemUrlValidShema = Yup.string(
	"Paste the public version control system"
)
	.url("Enter a valid url")
	.max(255, "Url must be of maximum 255 characters length");
