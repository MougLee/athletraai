import { useEffect, useState } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FormikUnitToggle, FormikRadioGroup, FormikDateInput, FormikNumberInput } from '../../../components';
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
                                {({ isValid }) => (
                                    <FormikForm>
                                        {/* Units Toggle */}
                                        <FormikUnitToggle
                                            name="unitSystem"
                                            label={t('step1.units.label')}
                                            onUnitChange={handleUnitSystemChange}
                                        />

                                        {/* Height */}
                                        <div className="mb-4">
                                            <label className="fw-semibold form-label">
                                                {t('step1.height.label')}
                                            </label>
                                            {unitSystem === 'metric' ? (
                                                <FormikNumberInput
                                                    name="heightRaw"
                                                    label={t('step1.height.metric')}
                                                    placeholder={t('step1.height.placeholder')}
                                                    className="mb-0"
                                                />
                                            ) : (
                                                <Row>
                                                    <Col md={6}>
                                                        <FormikNumberInput
                                                            name="heightFtRaw"
                                                            label={t('step1.height.imperial')}
                                                            placeholder="5"
                                                            min={1}
                                                            max={8}
                                                            className="mb-0"
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormikNumberInput
                                                            name="heightInRaw"
                                                            label={t('step1.height.imperialInches')}
                                                            placeholder="10"
                                                            min={0}
                                                            max={11}
                                                            className="mb-0"
                                                        />
                                                    </Col>
                                                </Row>
                                            )}
                                        </div>

                                        {/* Weight */}
                                        <div className="mb-4">
                                            <FormikNumberInput
                                                name="weightRaw"
                                                label={unitSystem === 'metric' ? t('step1.weight.metric') : t('step1.weight.imperial')}
                                                placeholder={t('step1.weight.placeholder')}
                                                step={0.1}
                                                helpText={t('step1.weight.baseline')}
                                                className="mb-0"
                                            />
                                        </div>

                                        {/* Date of Birth */}
                                        <FormikDateInput
                                            name="dateOfBirth"
                                            label={t('step1.dateOfBirth.label')}
                                            max={`${new Date().getFullYear() - 8}-12-31`}
                                            min="1930-01-01"
                                        />

                                        {/* Gender */}
                                        <FormikRadioGroup
                                            name="gender"
                                            label={t('step1.gender.label')}
                                            options={[
                                                { value: 'male', label: t('step1.gender.male') },
                                                { value: 'female', label: t('step1.gender.female') },
                                                { value: 'na', label: t('step1.gender.preferNotToSay') },
                                            ]}
                                        />

                                        {/* Activity Level */}
                                        <FormikRadioGroup
                                            name="activityLevel"
                                            label={t('step1.activityLevel.label')}
                                            options={[
                                                { value: 'sedentary', label: t('step1.activityLevel.sedentary'), description: t('step1.activityLevel.sedentaryDescription') },
                                                { value: 'light', label: t('step1.activityLevel.light'), description: t('step1.activityLevel.lightDescription') },
                                                { value: 'moderate', label: t('step1.activityLevel.moderate'), description: t('step1.activityLevel.moderateDescription') },
                                                { value: 'high', label: t('step1.activityLevel.high'), description: t('step1.activityLevel.highDescription') },
                                                { value: 'extreme', label: t('step1.activityLevel.extreme'), description: t('step1.activityLevel.extremeDescription') },
                                            ]}
                                        />

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
