import { useField } from 'formik';
import { TextField, Typography } from '@material-ui/core';

export function TextFieldWrapper({ label, ...props }) {
    const [field, meta] = useField(props);
    return (
        <>
            <TextField
                label={props.id || props.name}
                {...field}
                {...props}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error ? meta.error : null}
            />
        </>
    );
}