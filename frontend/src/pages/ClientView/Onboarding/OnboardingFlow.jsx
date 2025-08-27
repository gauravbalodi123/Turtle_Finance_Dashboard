import React, { useState } from "react";
import RiskProfileForm from "./Steps/riskProfileForm";
import KYCUpload from "./Steps/KYCUpload";
import AgreementSigning from "./Steps/AgreementSigning";
import ClientOnboardingNavbar from "../../../components/MainNavigation/ClientOnboardingNavbar";
import PaymentPage from "./Steps/Payment/PaymentPage";
import OnboardingIntro from "../../../components/SmallerComponents/OnboardingIntro";
import OnboardingProgressHeader from "../../../components/SmallerComponents/OnboardingProgressHeader";
import styles from "../../../styles/ClientLayout/OnboardingFlow.module.css";
import RiskProfileComplete from "../../../components/SmallerComponents/RiskProfileComplete ";
import KYCComplete from "../../../components/SmallerComponents/KYCComplete";
import AgreementSigningComplete from "../../../components/SmallerComponents/AgreementSigningComplete";
import PaymentComplete from "../../../components/SmallerComponents/PaymentComplete";
import CalendlyBooking from "../../../components/SmallerComponents/CalendlyBooking";

// ✅ These are the 4 steps for the progress bar
const progressSteps = [
  { id: "risk", title: "Risk Profile" },
  { id: "kyc", title: "KYC Upload" },
  { id: "agreement", title: "Agreement Signing" },
  { id: "payment", title: "Payment" },
  { id: "bookCall", title: "Book a Call" },
];

// ✅ All onboarding steps including intro and risk-complete
// ✅ All onboarding steps including intro and completion screens

const steps = [
  { id: "intro", component: OnboardingIntro },

  { id: "risk", title: "Risk Profile", component: RiskProfileForm },
  { id: "risk-complete", component: RiskProfileComplete },

  { id: "kyc", title: "KYC Upload", component: KYCUpload },
  { id: "kyc-complete", component: KYCComplete },

  { id: "agreement", title: "Agreement Signing", component: AgreementSigning },
  { id: "agreement-complete", component: AgreementSigningComplete },

  { id: "payment", title: "Payment", component: PaymentPage },
  { id: "payment-complete", component: PaymentComplete },

  // ✅ New step for booking call
  { id: "bookCall", component: CalendlyBooking },
];



const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    riskAnswers: {},
    kyc: {},
    agreementSigned: false,
    paymentDone: false,
  });

  const updateData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const StepComponent = steps[currentStep].component;
  const currentStepId = steps[currentStep].id;

  // ✅ Map step ID to progress index
  const stepIdToProgressIndex = {
    risk: 0,
    "risk-complete": 0,
    kyc: 1,
    "kyc-complete": 1,
    agreement: 2,
    "agreement-complete": 2,
    payment: 3,
    "payment-complete": 3,
    bookCall: 4,
    "book-call": 4
  };



  const showProgress = stepIdToProgressIndex.hasOwnProperty(currentStepId);
  const progressIndex = stepIdToProgressIndex[currentStepId];

  return (
    <div className="min-vh-100 d-flex bg-white container-fluid p-0 flex-column">
      <ClientOnboardingNavbar />

      <div className={`${styles.innerOnboardingMargin} px-5 py-4`}>
        {showProgress && (
          <OnboardingProgressHeader
            progressIndex={progressIndex}
            steps={progressSteps}
          />
        )}

        <div className="container-fluid bg-white px-0">
          <StepComponent
            data={formData}
            updateData={updateData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
