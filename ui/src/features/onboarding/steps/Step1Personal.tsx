import { useEffect, useState } from 'react';
import { Formik, Form as FormikForm, Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { createStep1Schema, Step1FormData } from '../validation';
import { OnboardingStore } from '../store';
import { useUserContext } from '../../../contexts';

interface Step1PersonalProps {
  onNext: (data: Step1FormData) => void;
  onBack?: () => void;
  initialData?: Partial<Step1FormData>;
}

export const Step1Personal: React.FC<Step1PersonalProps> = ({
  onNext,
  onBack,
  initialData: _initialData = {},
}) => {
    const { t } = useTranslation('onboarding');
    const { state: userState } = useUserContext();
    const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
    const [showSuccess, setShowSuccess] = useState(false);

    // Get user context data
    const userId = userState.user?.login || 'anonymous';
    const timezone = userState.user?.timezone || 'UTC';
    const language = userState.user?.language || 'en';

    // Load existing data from localStorage
    useEffect(() => {
        const savedData = OnboardingStore.getStep1(userId);
        if (savedData) {
            setUnitSystem(savedData.unitSystem);
        }
    }, [userId]);

    const getInitialValues = (): Step1FormData => {
        const savedData = OnboardingStore.getStep1(userId);
        
        // Convert stored data to form data format
        const convertStoredDataToFormData = (data: any): Step1FormData => ({
            unitSystem: data?.unitSystem || 'metric',
            dateOfBirth: data?.dateOfBirth instanceof Date 
              ? data.dateOfBirth.toISOString().split('T')[0] 
              : '',
            gender: data?.gender || 'na',
            activityLevel: data?.activityLevel || 'moderate',
            heightUnit: data?.heightUnit || 'cm',
            heightRaw: data?.heightRaw?.toString() || '',
            heightFtRaw: data?.heightFtRaw?.toString() || '',
            heightInRaw: data?.heightInRaw?.toString() || '',
            weightRaw: data?.weightRaw?.toString() || '',
            weightUnit: data?.weightUnit || 'kg',
            timezone,
            language,
        });
        
        return convertStoredDataToFormData(savedData);
    };

      const handleSubmit = (values: Step1FormData) => {
    // Save to localStorage (store expects Step1FormData)
    OnboardingStore.saveStep1(userId, values);
    
    // Show success message
    setShowSuccess(true);
    
    // Call the onNext callback with the original form data
    onNext(values);
  };

    const handleUnitSystemChange = (newUnitSystem: 'metric' | 'imperial') => {
        setUnitSystem(newUnitSystem);
    };

    const renderHeightInputs = () => {
        if (unitSystem === 'metric') {
            return (
                <Field name="heightRaw">
                    {({ field, meta }: FieldProps<string>) => (
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="heightRaw">{t('step1.height.metric')}</Form.Label>
                                          <Form.Control
                id="heightRaw"
                type="number"
                placeholder={t('step1.height.placeholder')}
                isValid={!meta.error && meta.touched}
                isInvalid={!!meta.error && meta.touched}
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value ?? ''}
              />
                            {meta.error && meta.touched && (
                                <div className="text-danger small mt-1">
                                    {meta.error}
                                </div>
                            )}
                        </Form.Group>
                    )}
                </Field>
            );
        }

        return (
            <Row>
                <Col md={6}>
                    <Field name="heightFtRaw">
                        {({ field, meta }: FieldProps<string>) => (
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="heightFtRaw">{t('step1.height.imperial')}</Form.Label>
                                                                   <Form.Control
                     id="heightFtRaw"
                     type="number"
                     placeholder="5"
                     min="1"
                     max="8"
                     isValid={!meta.error && meta.touched}
                     isInvalid={!!meta.error && meta.touched}
                     name={field.name}
                     onChange={field.onChange}
                     onBlur={field.onBlur}
                     value={field.value ?? ''}
                   />
                                {meta.error && meta.touched && (
                                    <div className="text-danger small mt-1">{meta.error}</div>
                                )}
                            </Form.Group>
                        )}
                    </Field>
                </Col>
                <Col md={6}>
                    <Field name="heightInRaw">
                        {({ field, meta }: FieldProps<string>) => (
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="heightInRaw">{t('step1.height.imperialInches')}</Form.Label>
                                                                   <Form.Control
                     id="heightInRaw"
                     type="number"
                     placeholder="10"
                     min="0"
                     max="11"
                     isValid={!meta.error && meta.touched}
                     isInvalid={!!meta.error && meta.touched}
                     name={field.name}
                     onChange={field.onChange}
                     onBlur={field.onBlur}
                     value={field.value ?? ''}
                   />
                                {meta.error && meta.touched && (
                                    <div className="text-danger small mt-1">{meta.error}</div>
                                )}
                            </Form.Group>
                        )}
                    </Field>
                </Col>
            </Row>
        );
    };

    const renderWeightInput = () => {
        const weightLabel = unitSystem === 'metric' ? t('step1.weight.metric') : t('step1.weight.imperial');

        return (
            <Field name="weightRaw">
                {({ field, meta }: FieldProps<string>) => (
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="weightRaw">{weightLabel}</Form.Label>
                                    <Form.Control
              id="weightRaw"
              type="number"
              step="0.1"
              placeholder={t('step1.weight.placeholder')}
              isValid={!meta.error && meta.touched}
              isInvalid={!!meta.error && meta.touched}
              name={field.name}
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value ?? ''}
            />
                        <Form.Text className="text-muted">
                            {t('step1.weight.baseline')}
                        </Form.Text>
                        {meta.error && meta.touched && (
                            <div className="text-danger small mt-1">{meta.error}</div>
                        )}
                    </Form.Group>
                )}
            </Field>
        );
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4 p-lg-5">
                                          <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">{t('step1.title')}</h2>
                <p className="text-muted mb-0">{t('step1.subtitle')}</p>
                {showSuccess && (
                  <div className="alert alert-success mt-3 mb-0" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {t('step1.successMessage')}
                  </div>
                )}
              </div>

                            <Formik
                                initialValues={getInitialValues()}
                                validationSchema={createStep1Schema(t)}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ setFieldValue, isValid }) => (
                                    <FormikForm>
                                        {/* Units Toggle */}
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold">{t('step1.units.label')}</Form.Label>
                                            <div className="d-flex justify-content-center">
                                                <ButtonGroup size="lg" className="shadow-sm">
                                                    <Button
                                                        variant={unitSystem === 'metric' ? 'primary' : 'outline-primary'}
                                                        onClick={() => {
                                                            handleUnitSystemChange('metric');
                                                            setFieldValue('unitSystem', 'metric');
                                                            setFieldValue('heightUnit', 'cm');
                                                            setFieldValue('weightUnit', 'kg');
                                                        }}
                                                    >
                                                        {t('step1.units.metric')}
                                                    </Button>
                                                    <Button
                                                        variant={unitSystem === 'imperial' ? 'primary' : 'outline-primary'}
                                                        onClick={() => {
                                                            handleUnitSystemChange('imperial');
                                                            setFieldValue('unitSystem', 'imperial');
                                                            setFieldValue('heightUnit', 'ft_in');
                                                            setFieldValue('weightUnit', 'lb');
                                                        }}
                                                    >
                                                        {t('step1.units.imperial')}
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                        </Form.Group>

                                        {/* Height */}
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold">{t('step1.height.label')}</Form.Label>
                                            {renderHeightInputs()}
                                        </Form.Group>

                                        {/* Weight */}
                                        <Form.Group className="mb-4">
                                            {renderWeightInput()}
                                        </Form.Group>

                                        {/* Date of Birth */}
                                        <Field name="dateOfBirth">
                                            {({ field, meta }: FieldProps<string>) => (
                                                <Form.Group className="mb-4">
                                                    <Form.Label htmlFor="dateOfBirth" className="fw-semibold">
                                                        {t('step1.dateOfBirth.label')}
                                                    </Form.Label>
                                                                              <Form.Control
                            id="dateOfBirth"
                            type="date"
                            max={`${new Date().getFullYear() - 8}-12-31`}
                            min="1930-01-01"
                            isValid={!meta.error && meta.touched}
                            isInvalid={!!meta.error && meta.touched}
                            name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            value={field.value || ''}
                          />
                            {meta.error && meta.touched && (
                                <div className="text-danger small mt-1">{meta.error}</div>
                            )}
                                                </Form.Group>
                                            )}
                                        </Field>

                                        {/* Gender */}
                                        <Field name="gender">
                                            {({ field, meta }: FieldProps<string>) => (
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="fw-semibold d-block">{t('step1.gender.label')}</Form.Label>
                                                    <div className="d-flex gap-3">
                                                        {[
                                                            { value: 'male', label: t('step1.gender.male') },
                                                            { value: 'female', label: t('step1.gender.female') },
                                                            { value: 'na', label: t('step1.gender.preferNotToSay') },
                                                        ].map((option) => (
                                                            <Form.Check
                                                                key={option.value}
                                                                type="radio"
                                                                id={`gender-${option.value}`}
                                                                name="gender"
                                                                value={option.value}
                                                                checked={field.value === option.value}
                                                                onChange={field.onChange}
                                                                label={option.label}
                                                                className="flex-fill"
                                                            />
                                                        ))}
                                                    </div>
                                                    {meta.error && meta.touched && (
                                                        <div className="text-danger small mt-1">{meta.error}</div>
                                                    )}
                                                </Form.Group>
                                            )}
                                        </Field>

                                        {/* Activity Level */}
                                        <Field name="activityLevel">
                                            {({ field, meta }: FieldProps<string>) => (
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="fw-semibold d-block">{t('step1.activityLevel.label')}</Form.Label>
                                                    <div className="d-flex flex-column gap-2">
                                                        {[
                                                            { value: 'sedentary', label: t('step1.activityLevel.sedentary'), description: t('step1.activityLevel.sedentaryDescription') },
                                                            { value: 'light', label: t('step1.activityLevel.light'), description: t('step1.activityLevel.lightDescription') },
                                                            { value: 'moderate', label: t('step1.activityLevel.moderate'), description: t('step1.activityLevel.moderateDescription') },
                                                            { value: 'high', label: t('step1.activityLevel.high'), description: t('step1.activityLevel.highDescription') },
                                                            { value: 'extreme', label: t('step1.activityLevel.extreme'), description: t('step1.activityLevel.extremeDescription') },
                                                        ].map((option) => (
                                                            <Form.Check
                                                                key={option.value}
                                                                type="radio"
                                                                id={`activity-${option.value}`}
                                                                name="activityLevel"
                                                                value={option.value}
                                                                checked={field.value === option.value}
                                                                onChange={field.onChange}
                                                                label={
                                                                    <div>
                                                                        <div className="fw-medium">{option.label}</div>
                                                                        <div className="text-muted small">{option.description}</div>
                                                                    </div>
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                    {meta.error && meta.touched && (
                                                        <div className="text-danger small mt-1">{meta.error}</div>
                                                    )}
                                                </Form.Group>
                                            )}
                                        </Field>

                                        {/* Navigation Buttons */}
                                        <div className="d-flex justify-content-between pt-3">
                                            {onBack && (
                                                <Button variant="outline-secondary" onClick={onBack}>
                                                    {t('navigation.back')}
                                                </Button>
                                            )}
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                size="lg"
                                                disabled={!isValid}
                                                className="ms-auto"
                                            >
                                                {t('navigation.next')}
                                            </Button>
                                        </div>
                                    </FormikForm>
                                )}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
