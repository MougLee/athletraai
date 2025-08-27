import { Field, FieldProps } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';

interface FormikDateInputProps {
  name: string;
  label: string;
  min?: string;
  max?: string;
  className?: string;
  namespace?: string;
}

export const FormikDateInput: React.FC<FormikDateInputProps> = ({
  name,
  label,
  min,
  max,
  className = 'mb-4',
  namespace = 'onboarding',
}) => {
  const { t } = useTranslation(namespace);

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
        <Form.Group className={className}>
          <Form.Label htmlFor={name} className="fw-semibold">
            {label}
          </Form.Label>
          <Form.Control
            id={name}
            type="date"
            min={min}
            max={max}
            isValid={!meta.error && meta.touched}
            isInvalid={!!meta.error && meta.touched}
            name={field.name}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value || ''}
          />
          {meta.error && meta.touched && (
            <div className="text-danger small mt-1">
              {translateError(meta.error)}
            </div>
          )}
        </Form.Group>
      )}
    </Field>
  );
};
