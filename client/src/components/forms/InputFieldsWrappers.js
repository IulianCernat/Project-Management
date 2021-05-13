import { useState, useRef } from "react";
import { useField } from "formik";
import {
	FormControl,
	FormHelperText,
	InputLabel,
	Select,
	TextField,
	Typography,
	TextareaAutosize,
	Box,
} from "@material-ui/core";
import PropTypes from "prop-types";

TextFieldWrapper.propTypes = {
	label: PropTypes.string.isRequired,
	maxTextWidth: PropTypes.number,
};
export function TextFieldWrapper({ label, maxTextWidth, ...props }) {
	const [field, meta] = useField(props);
	const currentText = useRef(null);
	return (
		<TextField
			label={label}
			{...field}
			{...props}
			inputRef={currentText}
			value={currentText.current ? currentText.current.value : ""}
			error={meta.touched && Boolean(meta.error)}
			helperText={
				<Box component="span" display="flex" justifyContent="space-between">
					{meta.touched && meta.error ? <span>{meta.error}</span> : null}
					{maxTextWidth ? (
						<span>
							{currentText.current ? currentText.current.value.length : 0}/
							{maxTextWidth}
						</span>
					) : null}
				</Box>
			}
		/>
	);
}

export function SelectFieldWrapper({ label, required, ...props }) {
	const [field, meta] = useField(props);
	return (
		<>
			<FormControl
				fullWidth
				required={required}
				error={meta.touched && Boolean(meta.error)}
			>
				<InputLabel id={props.id || props.name}>{label}</InputLabel>
				<Select labelId={label} {...field} {...props} />
				<FormHelperText>
					{meta.touched && meta.error ? meta.error : null}
				</FormHelperText>
			</FormControl>
		</>
	);
}
