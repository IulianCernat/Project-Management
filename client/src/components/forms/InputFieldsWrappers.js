import { useState, useRef } from "react";
import { useField } from "formik";
import { TextField, Box } from "@material-ui/core";

import PropTypes from "prop-types";

TextFieldWrapper.propTypes = {
	label: PropTypes.string.isRequired,
	maxTextWidth: PropTypes.number,
};
export function TextFieldWrapper({
	label,
	maxTextWidth,
	children,
	value,
	...props
}) {
	const [field, meta] = useField(props);
	const currentText = useRef(null);
	return (
		<TextField
			label={label}
			{...field}
			{...props}
			inputRef={currentText}
			value={
				value ? value : currentText.current ? currentText.current.value : ""
			}
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
		>
			{children}
		</TextField>
	);
}
