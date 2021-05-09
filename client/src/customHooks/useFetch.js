import { useReducer, useEffect} from "react";

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

async function doPost(url, stringifiedData) {
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: stringifiedData,
    });

    if (!response.ok) return { error: response.statusText, location: null };

    let status = response.status;
    let result = await response.json();

    switch (status) {
      case 201:
        return { error: null, location: result["location"] };
      default:
        return { error: result["message"], location: null };
    }
  } catch (err) {
    return { error: err, location: null };
  }
}

async function doGet(url, parameters = null) {
  try {
    url += "?" + new URLSearchParams(parameters).toString();
    let response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) return { error: response.statusText, receivedData: null };
    
    let status = response.status;
    let result = await response.json();
    switch (status) {
      case 200:
        return { error: null, receivedData: result };
      default:
        return { error: result.message, receivedData: null };
    }
  } catch (err) {
    return { error: err, receivedData: null };
  }
}
export function useGetFetch(url, parameters) {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("Fetch custom hook run", url, parameters, state)
  useEffect(() => {
    console.log("UseEffect from fetch run", parameters, state);
    async function doFetch() {
      dispatch({ type: "started" });
      let fetchResponse = await doGet(url, parameters);
      if (fetchResponse.error) {
        dispatch({ type: "error", error: fetchResponse.error });
        return;
      }

      dispatch({ type: "success", receivedData: fetchResponse.receivedData });
    }

    doFetch();
  }, [url, parameters]);

  return {
    isLoading: state.status === "pending",
    isResolved: state.status === "resolved",
    isRejected: state.status === "rejected",
    ...state,
  };
}
export function usePostFetch(url, bodyContent) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function doFetch() {
      if (!bodyContent) {
        dispatch({ type: "idle" });
        return;
      }
      dispatch({ type: "started" });
      let fetchResponse = await doPost(url, bodyContent);
      if (fetchResponse.error) {
        dispatch({ type: "error", error: fetchResponse.error });
        return;
      }
      dispatch({ type: "success", receivedData: fetchResponse.location });
    }

    doFetch(url, bodyContent);
  }, [url, bodyContent]);

  return {
    isLoading: state.status === "pending",
    isResolved: state.status === "resolved",
    isRejected: state.status === "rejected",
    ...state,
  };
}
