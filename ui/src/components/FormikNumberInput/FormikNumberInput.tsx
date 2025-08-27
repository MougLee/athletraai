import { Field, FieldProps } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';

interface FormikNumberInputProps {
  name: string;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  className?: string;
  namespace?: string;
}

export const FormikNumberInput: React.FC<FormikNumberInputProps> = ({
  name,
  label,
  placeholder,
  min,
  max,
  step,
  helpText,
  className = 'mb-3',
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
          <Form.Label htmlFor={name}>
            {label}
          </Form.Label>
          <Form.Control
            id={name}
            type="number"
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            isValid={!meta.error && meta.touched}
            isInvalid={!!meta.error && meta.touched}
            name={field.name}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value ?? ''}
          />
          {helpText && (
            <small className="text-muted form-text">
              {helpText}
            </small>
          )}
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
