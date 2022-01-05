import { useReducer, useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { buildHeadersForApi } from "utils/buildHeadersForApi";
const initialState = {
	status: "idle",
	receivedData: null,
	error: null,
};
function reducer(state, action) {
	switch (action.type) {
		case "idle":
			return {
				...initialState,
			};
		case "started":
			return {
				receivedData: null,
				error: null,
				status: "pending",
			};
		case "success":
			return {
				error: null,
				status: "resolved",
				receivedData: action.receivedData,
			};
		case "error": {
			return {
				receivedData: null,
				status: "rejected",
				error: action.error,
			};
		}
		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
}

function transformState(state) {
	return {
		...state,
		isIdle: state.status === "idle",
		isLoading: state.status === "pending",
		isResolved: state.status === "resolved",
		isRejected: state.status === "rejected",
	};
}

async function processResponse(response) {
	// if (!response.ok)
	// 	return {
	// 		error: response.statusText ? response.statusText : "unknown error",
	// 		receivedData: null,
	// 	};

	let status = response.status;
	let result = await response.json();
	switch (status) {
		case 200:
			return { error: null, receivedData: result };
		case 201:
			if (result.hasOwnProperty("location")) return { error: null, receivedData: result["location"] };
			return { error: null, receivedData: result };
		default:
			return { error: result.message, receivedData: null };
	}
}

export async function doPost(url, stringifiedData, headers) {
	try {
		url = process.env.REACT_APP_API_URL + "/" + url;
		let response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
				...headers,
			},
			body: stringifiedData,
		});

		return await processResponse(response);
	} catch (err) {
		return { error: err, location: null };
	}
}

export async function doPatch(url, stringifiedData, headers) {
	try {
		url = process.env.REACT_APP_API_URL + "/" + url;
		let response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
				...headers,
			},
			body: stringifiedData,
		});

		return await processResponse(response);
	} catch (err) {
		return { error: err, location: null };
	}
}

export async function doGet(url, parameters = null, headers) {
	try {
		if (parameters) url = `${process.env.REACT_APP_API_URL}/${url}?${new URLSearchParams(parameters).toString()}`;
		else url = `${process.env.REACT_APP_API_URL}/${url}`;

		let response = await fetch(url, {
			method: "GET",
			headers: {
				...headers,
			},
		});
		return await processResponse(response);
	} catch (err) {
		return { error: `Cannot fetch: ${err}`, receivedData: null };
	}
}

async function doDelete(url, headers) {
	try {
		url = process.env.REACT_APP_API_URL + "/" + url;

		let response = await fetch(url, {
			method: "DELETE",
			headers: {
				...headers,
			},
		});

		return await processResponse(response);
	} catch (err) {
		return { error: err, receivedData: null };
	}
}

export function useGetFetch(url, parameters = null, start = true) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [transformedState, setTransformedState] = useState(state);
	const { currentUser } = useAuth();
	useEffect(() => {
		if (!start) {
			dispatch({ type: "idle" });
			return;
		}

		async function doFetch() {
			const headers = await buildHeadersForApi(currentUser);
			dispatch({ type: "started" });
			let fetchResponse = await doGet(url, parameters, headers);

			if (fetchResponse.error) {
				dispatch({ type: "error", error: fetchResponse.error.toString() });
				console.log(fetchResponse.error);
				return;
			}

			dispatch({ type: "success", receivedData: fetchResponse.receivedData });
		}

		doFetch();
	}, [url, parameters, start]);

	useEffect(() => {
		setTransformedState(transformState(state));
	}, [state]);

	return transformedState;
}

export function useDeleteFetch(url) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [transformedState, setTransformedState] = useState(transformState(state));
	const { currentUser } = useAuth();

	useEffect(() => {
		if (!url) {
			dispatch({ type: "idle" });
			return;
		}
		async function doFetch() {
			dispatch({ type: "started" });
			const headers = await buildHeadersForApi(currentUser);
			let fetchResponse = await doDelete(url, headers);
			if (fetchResponse.error) {
				dispatch({ type: "error", error: fetchResponse.error.toString() });
				return;
			}
			dispatch({
				type: "success",
				receivedData: fetchResponse.receivedData,
			});
		}
		doFetch();
	}, [url]);

	useEffect(() => {
		setTransformedState(transformState(state));
	}, [state]);

	return transformedState;
}
export function usePostFetch(url, bodyContent) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [transformedState, setTransformedState] = useState(state);
	const { currentUser } = useAuth();
	useEffect(() => {
		if (!bodyContent) {
			dispatch({ type: "idle" });
			return;
		}
		async function doFetch() {
			dispatch({ type: "started" });
			const headers = await buildHeadersForApi(currentUser);

			let fetchResponse = await doPost(url, bodyContent, headers);

			if (fetchResponse.error) {
				dispatch({ type: "error", error: fetchResponse.error.toString() });
				return;
			}
			dispatch({
				type: "success",
				receivedData: fetchResponse.receivedData,
			});
		}

		doFetch(url, bodyContent);
	}, [url, bodyContent]);

	useEffect(() => {
		setTransformedState(transformState(state));
	}, [state]);

	return transformedState;
}

export function usePatchFetch(url, bodyContent) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [transformedState, setTransformedState] = useState(state);
	const { currentUser } = useAuth();
	useEffect(() => {
		async function doFetch() {
			if (!bodyContent || !url) {
				dispatch({ type: "idle" });
				return;
			}
			dispatch({ type: "started" });
			const headers = await buildHeadersForApi(currentUser);

			let fetchResponse = await doPatch(url, bodyContent, headers);
			if (fetchResponse.error) {
				dispatch({ type: "error", error: fetchResponse.error.toString() });
				return;
			}
			dispatch({ type: "success", receivedData: fetchResponse.receivedData });
		}

		doFetch(url, bodyContent);
	}, [url, bodyContent]);

	useEffect(() => {
		setTransformedState(transformState(state));
	}, [state]);

	return transformedState;
}

export function doTrelloApiFetch({ method, apiUri, apiParams = null, successHandler, errorHandler }) {
	const key = process.env.REACT_APP_TRELLO_API_KEY;
	const token = localStorage.getItem("trello_token");

	let url = `https://api.trello.com/1/${apiUri}?key=${key}&token=${token}`;

	const options = {
		method,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	};
	if (method !== "GET") {
		options["body"] = JSON.stringify(apiParams);
	} else url += "&" + new URLSearchParams(apiParams).toString();

	fetch(url, options)
		.then((response) => response.json())
		.then((data) => successHandler(data))
		.catch((error) => errorHandler(error));
}
