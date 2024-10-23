import { FormikValues, useFormikContext } from "formik";
import { ElementType, ReactElement } from "react";
import { Form } from "react-bootstrap";

type FormikInputProps = {
  name: string;
  label: ReactElement | string;
  placeholder?: string;
  as?: ElementType<any>;
};
function FormikInput({
  name,
  label,
  placeholder,
  as = "input",
}: FormikInputProps) {
  const { values, errors, handleChange, touched } =
    useFormikContext<FormikValues>();
  const hasError = Boolean(touched[name] && errors[name]);

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        name={name}
        as={as}
        value={values[name]}
        onChange={handleChange}
        placeholder={placeholder}
        isInvalid={hasError}
        style={as === "input" ? { color: "#fff" } : undefined}
      />
      <Form.Control.Feedback type="invalid">
        {hasError && typeof errors[name] === "string" && errors[name]}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default FormikInput;
