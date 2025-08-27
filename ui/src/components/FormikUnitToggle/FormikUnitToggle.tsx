import { Field, FieldProps } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

interface FormikUnitToggleProps {
    name: string;
    label: string;
    namespace?: string;
    className?: string;
    onUnitChange?: (unit: 'metric' | 'imperial') => void;
}

export const FormikUnitToggle: React.FC<FormikUnitToggleProps> = ({
    name,
    label,
    namespace = 'onboarding',
    className = 'mb-4',
    onUnitChange,
}) => {
    const { t } = useTranslation(namespace);

    return (
        <Field name={name}>
            {({ field, form }: FieldProps<string>) => (
                <Form.Group className={className}>
                    <Form.Label className="fw-semibold form-label">
                        {label}
                    </Form.Label>
                    <div className="d-flex justify-content-center">
                        <div className="shadow-sm btn-group btn-group-lg" role="group">
                            <Button
                                variant={field.value === 'metric' ? 'primary' : 'outline-primary'}
                                type="button"
                                onClick={() => {
                                    field.onChange({ target: { name: field.name, value: 'metric' } });
                                    form.setFieldValue('heightUnit', 'cm');
                                    form.setFieldValue('weightUnit', 'kg');
                                    onUnitChange?.('metric');
                                }}
                            >
                                {t('step1.units.metric')}
                            </Button>
                            <Button
                                variant={field.value === 'imperial' ? 'primary' : 'outline-primary'}
                                type="button"
                                onClick={() => {
                                    field.onChange({ target: { name: field.name, value: 'imperial' } });
                                    form.setFieldValue('heightUnit', 'ft_in');
                                    form.setFieldValue('weightUnit', 'lb');
                                    onUnitChange?.('imperial');
                                }}
                            >
                                {t('step1.units.imperial')}
                            </Button>
                        </div>
                    </div>
                </Form.Group>
            )}
        </Field>
    );
};
