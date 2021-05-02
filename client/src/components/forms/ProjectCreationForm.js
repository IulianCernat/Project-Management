import { Formik, Form } from "formik";
import * as Yup from "yup";
import {Button, Typography} from "@material-ui/core"
import { TextFieldWrapper, TextAreaWrapper} from "./InputFieldsWrappers";
import {
  projectNameValidSchema,
  projectDescriptionValidSchema,
} from "../../utils/validationSchemas";

const validationSchema = Yup.object({
  projectName: projectNameValidSchema,
  projectDescription: projectDescriptionValidSchema,
});
export default function ProjectCreationForm() {
  return (
    <Formik
      initialValues={{
        projectName: "",
        projectDescription: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        console.log(JSON.stringify(values));
        
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <TextFieldWrapper
            variant="outlined"
            required
            fullWidth
            margin="normal"
            id="projectName"
            label="Name"
            name="projectName"
          />
          
          <TextFieldWrapper
            multiline
            variant="outlined"
            required
            fullWidth
            rows={8}
            maxTextWidth={500}
            margin="normal"
            id="projectDescription"
            label="Description"
            name="projectDescription"
          />
        
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            <Typography>Sign In</Typography>
          </Button>
        </Form>
      )}
    </Formik>
  );
}
