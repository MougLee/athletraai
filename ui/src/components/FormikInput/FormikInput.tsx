import { Field, FieldProps } from 'formik';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';

interface FormikInputProps {
  type?: string;
  name: string;
  label: string;
}

export const FormikInput: React.FC<FormikInputProps> = ({
  type = 'text',
  name,
  label,
}) => {
  const { t } = useTranslation();

  const translateError = (error: string) => {
    if (error.includes(':')) {
      const [namespace, key] = error.split(':');
      return t(key, { ns: namespace });
    }
    return error;
  };

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps<string>) => (
        <Form.Group className="mb-4" as={Row}>
          <Form.Label column sm={3} htmlFor={name}>
            {label}
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              id={name}
              type={type}
              isValid={!meta.error && meta.touched}
              isInvalid={!!meta.error && meta.touched}
              {...field}
            />
            <Form.Control.Feedback type="invalid" className="text-end">
              {meta.error ? translateError(meta.error) : ''}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
      )}
    </Field>
  );
};
