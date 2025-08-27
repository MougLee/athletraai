import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Step1Personal } from './steps/Step1Personal';
import { Step1FormData } from './validation';
import { OnboardingStore } from './store';
import { useUserContext } from '../../contexts';

interface OnboardingContainerProps {
  initialStep?: number;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  initialStep = 1,
}) => {
  const navigate = useNavigate();
  const { state: userState } = useUserContext();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [onboardingData, setOnboardingData] = useState<{
    step1?: Step1FormData;
  }>({});

  const userId = userState.user?.login || 'anonymous';
  const totalSteps = 7; // Total number of onboarding steps

  // Load existing data on mount
  React.useEffect(() => {
    const savedData = OnboardingStore.load(userId);
    setOnboardingData(savedData);
  }, [userId]);

  const handleStep1Complete = (data: Step1FormData) => {
    setOnboardingData(prev => ({ ...prev, step1: data }));
    // Step 1 completed successfully - data is saved
    // In a real implementation, you'd move to the next step
    // For now, we stay on step 1 so users can review/edit their data
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/main'); // Go back to main app
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Personal
            onNext={handleStep1Complete}
            onBack={handleBack}
            initialData={onboardingData.step1}
          />
        );
      // Future steps will be added here
      // case 2:
      //   return <Step2Component onNext={handleStep2Complete} onBack={handleBack} />;
      default:
        return (
          <Container className="py-5 text-center">
            <h3>Step {currentStep}</h3>
            <p>This step is not yet implemented.</p>
          </Container>
        );
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Progress Bar */}
      <div className="bg-white border-bottom">
        <Container className="py-3">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted small">
                  Step {currentStep} of {totalSteps}
                </span>
                <ProgressBar
                  now={getProgressPercentage()}
                  className="flex-grow-1"
                  style={{ height: '8px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Step Content */}
      {renderCurrentStep()}
    </div>
  );
};
