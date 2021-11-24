import TrelloClient from "react-trello-client";

export default function TrelloAuthorization({ authorizeOnSuccess }) {
	return (
		<TrelloClient
			apiKey={process.env.REACT_APP_TRELLO_API_KEY}
			clientVersion={1} // number: {1}, {2}, {3}
			apiEndpoint="https://api.trello.com" // string: "https://api.trello.com"
			authEndpoint="https://trello.com" // string: "https://trello.com"
			intentEndpoint="https://trello.com" // string: "https://trello.com"
			authorizeName="React Trello Client" // string: "React Trello Client"
			authorizeType="popup" // string: popup | redirect
			authorizePersist={true}
			authorizeInteractive={true}
			authorizeScopeRead={false} // boolean: {true} | {false}
			authorizeScopeWrite={true} // boolean: {true} | {false}
			authorizeScopeAccount={true} // boolean: {true} | {false}
			authorizeExpiration="never" // string: "1hour", "1day", "30days" | "never"
			authorizeOnSuccess={authorizeOnSuccess} // function: {() => console.log('Login successful!')}
			authorizeOnError={() => console.log("Login error!")} // function: {() => console.log('Login error!')}
			autoAuthorize={false} // boolean: {true} | {false}
			authorizeButton={true} // boolean: {true} | {false}
			buttonStyle="flat" // string: "metamorph" | "flat"
			buttonColor="green" // string: "green" | "grayish-blue" | "light"
			buttonText="Link your Trello account" // string: "Login with Trello"></TrelloClient>;
		/>
	);
}
