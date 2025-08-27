import { Field, FieldProps } from 'formik';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';

interface RadioOption {
    value: string;
    label: string;
    description?: string;
}

interface FormikRadioGroupProps {
    name: string;
    label: string;
    options: RadioOption[];
    className?: string;
    namespace?: string;
}

export const FormikRadioGroup: React.FC<FormikRadioGroupProps> = ({
    name,
    label,
    options,
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
                    <Form.Label className="fw-semibold d-block">
                        {label}
                    </Form.Label>
                    <div className="d-flex flex-column gap-2">
                        {options.map((option) => (
                            <Form.Check key={option.value} type="radio">
                                <Form.Check.Input
                                    id={`${name}-${option.value}`}
                                    name={name}
                                    type="radio"
                                    value={option.value}
                                    checked={field.value === option.value}
                                    onChange={field.onChange}
                                />
                                <Form.Check.Label
                                    htmlFor={`${name}-${option.value}`}
                                    title=""
                                >
                                    {option.description ? (
                                        <div>
                                            <div className="fw-medium">{option.label}</div>
                                            <div className="text-muted small">{option.description}</div>
                                        </div>
                                    ) : (
                                        option.label
                                    )}
                                </Form.Check.Label>
                            </Form.Check>
                        ))}
                    </div>
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
