import { useState, useRef, useEffect, cloneElement } from "react";
import { Autocomplete } from "@material-ui/lab";
import { useGetFetch } from "../../customHooks/useFetch";
import { TextFieldWrapper } from "../forms/InputFieldsWrappers";
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
	setResourceId: PropTypes.func.isRequired,
};
export function SearchField({
	optionLabel,
	isOptionDisabled,
	optionWireFrame,
	inputNode,
	setResourceId,
	...other
}) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [options, setOptions] = useState([]);
	const [start, setStart] = useState(false);
	const getParams = useRef({ search: "", part_of_project_id: 73 });

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
					setResourceId(value ? value.id : "");
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
				loading={isLoading}
				renderOption={optionWireFrame}
				renderInput={(params) => cloneElement(inputNode, params)}
			/>
		</>
	);
}
