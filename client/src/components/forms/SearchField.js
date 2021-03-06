import { useState, useRef, useEffect, cloneElement } from "react";
import { Autocomplete } from "@material-ui/lab";
import { useGetFetch } from "customHooks/useFetch";
import PropTypes from "prop-types";

function sleep(delay = 10) {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
}

SearchField.propTypes = {
	/**
	 * The field from option wich will be displayed as a selctable label
	 */
	optionLabel: PropTypes.string.isRequired,
	/**
	 * A function with parameters: option, which returns a boolean value
	 * if the option should be selectable or not
	 */
	isOptionDisabled: PropTypes.func.isRequired,
	/**
	 * A function with parameters: option, which returns a componenet
	 * which will be displayed as a selectable option in the pop up menu
	 */
	optionWireFrame: PropTypes.func.isRequired,
	/**
	 * A component which will be used as input
	 */
	inputNode: PropTypes.node.isRequired,
	/**
	 * Function that sets the id of the searched resources in a hidden
	 * textfield
	 */
	setSelectedResource: PropTypes.func.isRequired,
	/**
	 * The url which which will be called with user's search input
	 */
	fetchUrl: PropTypes.string.isRequired,
};
export function SearchField({
	optionLabel,
	isOptionDisabled,
	optionWireFrame,
	inputNode,
	setSelectedResource,
	fetchUrl,
	partOfProjectId,
	...other
}) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [options, setOptions] = useState([]);
	const [startFetching, setStartFetching] = useState(false);
	const getParams = useRef({ search: "" });

	const getItemsStatus = useGetFetch(fetchUrl, getParams.current, startFetching);

	useEffect(() => {
		if (getItemsStatus.isResolved)
			setOptions((prev) => (getItemsStatus.receivedData ? getItemsStatus.receivedData : []));
	}, [getItemsStatus]);

	useEffect(() => {
		if (!searchTerm) {
			setStartFetching(false);
			setOptions([]);
			return;
		}
		getParams.current.search = searchTerm;
		setStartFetching(true);
	}, [searchTerm]);

	return (
		<>
			<Autocomplete
				{...other}
				noOptionsText={null}
				open={open}
				onOpen={() => {
					setOpen(true);
				}}
				onClose={() => {
					setOpen(false);
				}}
				onChange={(event, value) => {
					if (!value) {
						setSelectedResource("");
						return;
					}
					if (typeof value === "object") {
						setSelectedResource(JSON.stringify(value));
						return;
					}

					setSelectedResource(value.id);
				}}
				onInputChange={async (event, value, reason) => {
					await sleep();
					setSearchTerm(value);
				}}
				getOptionSelected={(option, value) => {
					return option.fullName === value.fullName;
				}}
				getOptionLabel={(option) => option[optionLabel]}
				getOptionDisabled={isOptionDisabled}
				options={options}
				loading={getItemsStatus.isLoading}
				renderOption={optionWireFrame}
				renderInput={(params) => cloneElement(inputNode, params)}
				fullWidth
			/>
		</>
	);
}
