import { useRef } from "react";
import { useField } from "formik";
import { TextField, Box, MenuItem } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";

TextFieldWrapper.propTypes = {
	label: PropTypes.string.isRequired,
	maxTextWidth: PropTypes.number,
};
export function TextFieldWrapper({ label, maxTextWidth, children, value, ...props }) {
	const [field, meta] = useField(props);
	const currentText = useRef(null);
	return (
		<TextField
			{...field}
			{...props}
			label={label}
			inputRef={currentText}
			value={value ? value : currentText.current ? currentText.current.value : ""}
			error={meta.touched && Boolean(meta.error)}
			helperText={
				<Box component="span" display="flex" justifyContent="space-between">
					{meta.touched && Boolean(meta.error) ? <span>{meta.error}</span> : null}
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
export function DatetimePickerWrapper({ runChangeEffect, ...props }) {
	const [field, meta] = useField(props);
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<DateTimePicker
				{...props}
				{...field}
				onChange={(date) => {
					runChangeEffect(date);
				}}
				format="dd/MM/yyyy HH:mm"
			/>
		</MuiPickersUtilsProvider>
	);
}

export function TextFieldSelectWrapper({
	label,
	menuOptions,
	runChangeEffect,
	selectComponentMenuProps,
	...props
}) {
	const [field, meta] = useField(props);

	return (
		<TextField
			{...props}
			{...field}
			select
			label={label}
			error={meta.touched && Boolean(meta.error)}
			helperText={meta.touched && Boolean(meta.error) ? <span>{meta.error}</span> : ""}
			onChange={(event) => {
				runChangeEffect(event.target.value);
			}}
			SelectProps={{ MenuProps: selectComponentMenuProps }}
		>
			{menuOptions.map((option) => (
				<MenuItem key={option.label} value={option.value}>
					{option.label.length > 50 ? option.label.slice(0, 50) + "..." : option.label}
				</MenuItem>
			))}
		</TextField>
	);
}
