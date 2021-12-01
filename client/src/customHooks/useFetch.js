import { useReducer, useEffect } from "react";
import useGetHeaders from "customHooks/useGetHeaders";

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
			if (result.hasOwnProperty("location"))
				return { error: null, location: result["location"] };
			return { error: null, receivedData: result };
		default:
			return { error: result.message, receivedData: null };
	}
}

export async function doPost(url, stringifiedData, headers = null) {
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

export async function doPatch(url, stringifiedData, headers = null) {
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

export async function doGet(url, parameters = null, foreignUrl = false, headers = null) {
	try {
		if (!foreignUrl) url = process.env.REACT_APP_API_URL + "/" + url;
		if (parameters) url += "?" + new URLSearchParams(parameters).toString();

		let response = await fetch(url, {
			method: "GET",
			headers: {
				...headers,
			},
		});
		return await processResponse(response);
	} catch (err) {
		return { error: err, receivedData: null };
	}
}

async function doDelete(url, headers) {
	try {
		url = process.env.REACT_APP_API_URL + "/" + url;

		let response = await fetch(url, {
			method: "DELETE",
			headers,
		});

		return await processResponse(response);
	} catch (err) {
		return { error: err, receivedData: null };
	}
}

export function useGetFetch(
	url,
	parameters = null,
	start = true,
	foreignUrl = false,
	headers = null
) {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		if (!start) return;

		async function doFetch() {
			dispatch({ type: "started" });
			let fetchResponse = await doGet(url, parameters, foreignUrl, headers);

			if (fetchResponse.error) {
				dispatch({ type: "error", error: fetchResponse.error.toString() });
				console.log(fetchResponse.error);
				return;
			}

			dispatch({ type: "success", receivedData: fetchResponse.receivedData });
		}

		doFetch();
	}, [url, parameters, start, foreignUrl, headers]);

	return transformState(state);
}
export function useDeleteFetch(url) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const headers = useGetHeaders();
	useEffect(() => {
		if (!url) return;

		async function doFetch() {
			dispatch({ type: "started" });

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

	return transformState(state);
}
export function usePostFetch(url, bodyContent, headers) {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		async function doFetch() {
			if (!bodyContent) {
				dispatch({ type: "idle" });
				return;
			}
			dispatch({ type: "started" });
			let fetchResponse = await doPost(url, bodyContent, headers);

			if (fetchResponse.error) {
				dispatch({ type: "error", error: fetchResponse.error.toString() });
				return;
			}
			dispatch({
				type: "success",
				receivedData: fetchResponse.location ? "undefined" : fetchResponse.receivedData,
			});
		}

		doFetch(url, bodyContent);
	}, [url, bodyContent, headers]);

	return transformState(state);
}

export function usePatchFetch(url, bodyContent, headers = null) {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		async function doFetch() {
			if (!bodyContent) {
				dispatch({ type: "idle" });
				return;
			}
			dispatch({ type: "started" });
			let fetchResponse = await doPatch(url, bodyContent, headers);
			if (fetchResponse.error) {
				dispatch({ type: "error", error: fetchResponse.error.toString() });
				return;
			}
			dispatch({ type: "success", receivedData: fetchResponse.location });
		}

		doFetch(url, bodyContent);
	}, [url, bodyContent, headers]);

	return transformState(state);
}

export function doTrelloApiFetch({
	method,
	apiUri,
	apiParams = null,
	successHandler,
	errorHandler,
}) {
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
