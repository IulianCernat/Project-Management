import { useField } from 'formik';
import { FormControl, FormHelperText, InputLabel, Select, TextField, Typography } from '@material-ui/core';

export function TextFieldWrapper({ label, ...props }) {
    const [field, meta] = useField(props);
    return (
        <>
            <TextField
                label={label}
                {...field}
                {...props}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error ? meta.error : null}
            />
        </>
    );
}

export function SelectFieldWrapper({ label, required,...props }) {
    const [field, meta] = useField(props);
    return (
        <>
            <FormControl
                fullWidth
                required={required}
                error={meta.touched && Boolean(meta.error)}
                
            >
                <InputLabel id={props.id || props.name}>{label}</InputLabel>
                <Select
                    labelId={label}
                    {...field}
                    {...props}

                />
                <FormHelperText>
                    {meta.touched && meta.error ? meta.error : null}
                </FormHelperText>
            </FormControl>

        </>
    )
}