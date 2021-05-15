import { useState, useRef, useEffect, cloneElement } from "react";
import { Autocomplete } from "@material-ui/lab";
import { useGetFetch } from "../../customHooks/useFetch";
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
};
export function SearchField({
	optionLabel,
	isOptionDisabled,
	optionWireFrame,
	inputNode,
	...other
}) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [options, setOptions] = useState([]);
	const getParams = useRef({ search: "", part_of_project_id: 73 });

	const [start, setStart] = useState(false);

	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch("api/users/", getParams.current, start);

	useEffect(() => {
		setOptions((prev) => (receivedData ? receivedData : []));
	}, [isResolved, receivedData]);

	useEffect(() => {
		if (!searchTerm) {
			setStart(false);
			setOptions([]);

			return;
		}
		getParams.current.search = searchTerm;
		setStart(true);
	}, [searchTerm]);

	return (
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
			onInputChange={async (event, value, reason) => {
				await sleep();
				setSearchTerm(value);
			}}
			getOptionSelected={(option, value) => option === value}
			getOptionLabel={(option) => option[optionLabel]}
			getOptionDisabled={isOptionDisabled}
			options={options}
			loading={isLoading}
			renderOption={optionWireFrame}
			renderInput={(params) => cloneElement(inputNode, params)}
		/>
	);
}
