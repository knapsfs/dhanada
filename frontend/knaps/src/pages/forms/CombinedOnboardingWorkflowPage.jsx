import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faSpinner,
  faShieldHalved,
  faUser,
  faWallet,
  faChartLine,
  faUsers,
  faBuildingColumns,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { formWorkflowService } from "../../services/formWorkflowService";
import FormHeader from "../../components/forms/FormHeader";
import PersonalDetailsSection from "../../components/forms/PersonalDetailsSection";
import FinancialDetailsSection from "../../components/forms/FinancialDetailsSection";
import RiskQuestionCard from "../../components/forms/RiskQuestionCard";
import NomineeDetailsSection from "../../components/forms/NomineeDetailsSection";
import BankDetailsSection from "../../components/forms/BankDetailsSection";
import FormReviewSection from "../../components/forms/FormReviewSection";
import FormSuccessState from "../../components/forms/FormSuccessState";
import FormErrorState from "../../components/forms/FormErrorState";

export default function CombinedOnboardingWorkflowPage() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [context, setContext] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);

  // Form Data
  const [formData, setFormData] = useState({
    full_name: "",
    pan: "",
    email: "",
    mobile_no: "",
    dob: "",
    gender: "",
    place_of_birth: "",
    occupation: "",
    income_slab: "",
    address: "",
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    // Nominee
    nominee_name: "",
    nominee_relationship: "",
    nominee_dob: "",
    is_nominee_minor: false,
    nominee_id_type: "",
    nominee_id_number: "",
    nominee_mobile: "",
    nominee_email: "",
    nominee_address: "",
    statement_name: "",
    guardian_name: "",
    guardian_relationship: "",
    guardian_pan: "",
    // Bank
    bank_entry_method: "Manual",
    bank_name: "",
    bank_account_no: "",
    confirm_bank_account_no: "",
    bank_ifsc: "",
    bank_proof_file: "",
    bank_proof_filename: "",
  });

  const [riskAnswers, setRiskAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const steps = [
    { id: "personal", title: "Personal Details" },
    { id: "financial", title: "Financial Situation" },
    { id: "investment", title: "Investment Priorities" },
    { id: "nominee", title: "Nominee Details" },
    { id: "bank", title: "Bank Details" },
    { id: "review", title: "Review & Submit" },
  ];

  // Helper to derive Age Band from DOB
  const deriveAgeBandOption = (dobStr) => {
    if (!dobStr) return null;
    try {
      const dob = new Date(dobStr);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 30) return { text: "Less than 30 years", score: 8 };
      if (age <= 40) return { text: "Between 30 and 40 years", score: 6 };
      if (age <= 50) return { text: "Between 40 and 50 years", score: 4 };
      return { text: "Above 50 years", score: 2 };
    } catch {
      return null;
    }
  };

  const loadFormContext = async () => {
    setLoading(true);
    setErrorState(null);
    try {
      const res = await formWorkflowService.getPublicFormContext(token);
      if (res.already_submitted) {
        setSubmissionResult({
          message: res.message || "This form has already been completed.",
        });
      }
      setContext(res);

      const prefill = res.prefill || {};
      const draft = res.draft || {};
      const mergedForm = {
        ...formData,
        ...prefill,
        ...draft,
        address: draft.address || prefill.address_line1 || "",
      };

      setFormData(mergedForm);

      // Restore risk answers
      const restoredAnswers = draft.risk_answers || draft.answers || {};
      if (mergedForm.dob && !restoredAnswers[1]) {
        const derived = deriveAgeBandOption(mergedForm.dob);
        if (derived) {
          restoredAnswers[1] = {
            questionId: 1,
            selectedOptionText: derived.text,
            score: derived.score,
            autoDerived: true,
          };
        }
      }
      setRiskAnswers(restoredAnswers);
    } catch (err) {
      setErrorState(err.message || "Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadFormContext();
    }
  }, [token]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // If DOB changes, automatically update Q1 Age Band
      if (field === "dob" && value) {
        const derived = deriveAgeBandOption(value);
        if (derived) {
          setRiskAnswers((rPrev) => ({
            ...rPrev,
            1: {
              questionId: 1,
              selectedOptionText: derived.text,
              score: derived.score,
              autoDerived: true,
            },
          }));
        }
      }

      // Auto save draft
      formWorkflowService
        .saveFormProgress(token, { ...updated, risk_answers: riskAnswers })
        .catch(() => {});

      return updated;
    });

    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSelectRiskOption = (qid, optionText, score) => {
    setRiskAnswers((prev) => {
      const updated = {
        ...prev,
        [qid]: {
          questionId: qid,
          selectedOptionText: optionText,
          score,
          autoDerived: false,
        },
      };
      formWorkflowService
        .saveFormProgress(token, { ...formData, risk_answers: updated })
        .catch(() => {});
      return updated;
    });
    setErrors((prev) => ({ ...prev, [`q_${qid}`]: null }));
  };

  // Step Validation
  const validateStep = (stepIdx) => {
    const errs = {};
    let valid = true;

    if (stepIdx === 0) {
      // Step 1: Personal Details + Risk Question 1
      if (!formData.full_name?.trim()) {
        errs.full_name = "Full Name is required.";
        valid = false;
      }
      if (!formData.pan?.trim()) {
        errs.pan = "PAN Number is required.";
        valid = false;
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan.trim().toUpperCase())) {
        errs.pan = "Invalid PAN format (e.g. ABCDE1234F).";
        valid = false;
      }
      if (!formData.dob) {
        errs.dob = "Date of Birth is required.";
        valid = false;
      }
      if (!formData.email?.trim()) {
        errs.email = "Email Address is required.";
        valid = false;
      }
      if (!formData.mobile_no || formData.mobile_no.length < 10) {
        errs.mobile_no = "A valid 10-digit mobile number is required.";
        valid = false;
      }
      if (!formData.gender) {
        errs.gender = "Please select gender.";
        valid = false;
      }
      if (!formData.place_of_birth?.trim()) {
        errs.place_of_birth = "Place of birth (City) is required.";
        valid = false;
      }
      if (!formData.occupation) {
        errs.occupation = "Please select occupation.";
        valid = false;
      }
      if (!formData.address?.trim() && !formData.address_line1?.trim()) {
        errs.address = "Address is required.";
        valid = false;
      }
      // Risk Q1 validation
      if (!riskAnswers[1]?.selectedOptionText) {
        errs.q_1 = "Please confirm your age band.";
        valid = false;
      }
    } else if (stepIdx === 1) {
      // Step 2: Financial Situation (Income Slab + Risk Q2 + Risk Q3)
      if (!formData.income_slab) {
        errs.income_slab = "Please select your income slab.";
        valid = false;
      }
      if (!riskAnswers[2]?.selectedOptionText) {
        errs.q_2 = "Please answer how many financial dependents you have.";
        valid = false;
      }
      if (!riskAnswers[3]?.selectedOptionText) {
        errs.q_3 = "Please answer regarding monthly expenses and EMI portion.";
        valid = false;
      }
    } else if (stepIdx === 2) {
      // Step 3: Investment Priorities (Risk Q5 + Risk Q14)
      if (!riskAnswers[5]?.selectedOptionText) {
        errs.q_5 = "Please select which investment you would withdraw from first.";
        valid = false;
      }
      if (!riskAnswers[14]?.selectedOptionText) {
        errs.q_14 = "Please select your investment priority.";
        valid = false;
      }
    } else if (stepIdx === 3) {
      // Step 4: Nominee
      if (!formData.nominee_name?.trim()) {
        errs.nominee_name = "Nominee Name is required.";
        valid = false;
      }
      if (!formData.nominee_relationship?.trim()) {
        errs.nominee_relationship = "Nominee Relationship is required.";
        valid = false;
      }
      if (!formData.nominee_dob) {
        errs.nominee_dob = "Nominee Date of Birth is required.";
        valid = false;
      }
      if (!formData.nominee_address?.trim()) {
        errs.nominee_address = "Nominee Address is required.";
        valid = false;
      }
      if (formData.is_nominee_minor && !formData.guardian_name?.trim()) {
        errs.guardian_name = "Guardian Name is required when nominee is a minor.";
        valid = false;
      }
    } else if (stepIdx === 4) {
      // Step 5: Bank
      if (formData.bank_entry_method === "Manual") {
        if (!formData.bank_ifsc?.trim()) {
          errs.bank_ifsc = "Bank IFSC code is required.";
          valid = false;
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bank_ifsc.trim().toUpperCase())) {
          errs.bank_ifsc = "Invalid IFSC format.";
          valid = false;
        }
        if (!formData.bank_name?.trim()) {
          errs.bank_name = "Bank Name is required.";
          valid = false;
        }
        if (!formData.bank_account_no?.trim()) {
          errs.bank_account_no = "Bank account number is required.";
          valid = false;
        }
        if (!formData.confirm_bank_account_no?.trim()) {
          errs.confirm_bank_account_no = "Please confirm your bank account number.";
          valid = false;
        } else if (formData.bank_account_no !== formData.confirm_bank_account_no) {
          errs.confirm_bank_account_no = "Bank account numbers do not match.";
          valid = false;
        }
      } else if (formData.bank_entry_method === "Upload") {
        if (!formData.bank_proof_file) {
          errs.bank_proof_file = "Please upload a cancelled cheque or bank passbook document.";
          valid = false;
        }
      }
    }

    setErrors(errs);
    return valid;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToStep = (section) => {
    if (section === "personal") setCurrentStep(0);
    else if (section === "risk") setCurrentStep(1);
    else if (section === "nominee") setCurrentStep(3);
    else if (section === "bank") setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    for (let s = 0; s < 5; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        answers: Object.values(riskAnswers),
      };
      const res = await formWorkflowService.submitCombinedOnboarding(token, payload);
      setSubmissionResult(res);
    } catch (err) {
      alert(err.message || "Failed to submit combined onboarding form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-xs text-center space-y-4 max-w-sm w-full">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-[#032e92]" />
          <div>
            <h3 className="text-sm font-bold text-gray-900">Loading Combined Onboarding</h3>
            <p className="text-xs text-gray-400 mt-1">Verifying secure token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <FormErrorState message={errorState} onRetry={loadFormContext} />
      </div>
    );
  }

  if (submissionResult) {
    return (
      <div className="min-h-screen bg-slate-50">
        <FormHeader
          title="Client Onboarding & Risk Profiler"
          subtitle="Integrated Financial Onboarding Journey"
          customerName={formData.full_name}
        />
        <FormSuccessState
          result={submissionResult}
          workflowType="combined_onboarding"
        />
      </div>
    );
  }

  const questions = context?.risk_questions || [];
  const q1 = questions.find((q) => q.id === 1);
  const q2 = questions.find((q) => q.id === 2);
  const q3 = questions.find((q) => q.id === 3);
  const q5 = questions.find((q) => q.id === 5);
  const q14 = questions.find((q) => q.id === 14);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <FormHeader
        title="Client Onboarding & Risk Profiler"
        subtitle="Complete your comprehensive account setup and investor assessment in one seamless journey."
        steps={steps}
        currentStep={currentStep}
        onStepClick={(idx) => setCurrentStep(idx)}
        customerName={context?.prefill?.full_name}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-6 sm:p-8">
          {/* STEP 1: PERSONAL INFORMATION + RISK QUESTION 1 (AGE BAND) */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <PersonalDetailsSection
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
                prefill={context?.prefill || {}}
              />

              {/* INTEGRATED RISK QUESTION 1: AGE BAND */}
              {q1 && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    <span className="text-xs font-extrabold text-[#032e92] uppercase tracking-wider block">
                      Financial Profile Integration
                    </span>
                    <p className="text-[11px] text-gray-500">
                      Based on your date of birth, we have pre-selected your age band for your
                      advisory risk profile. You can confirm or adjust below.
                    </p>
                  </div>
                  <RiskQuestionCard
                    question={q1}
                    selectedOptionText={riskAnswers[1]?.selectedOptionText}
                    onSelect={(optText, score) => handleSelectRiskOption(1, optText, score)}
                    note={
                      riskAnswers[1]?.autoDerived
                        ? "Automatically calculated from Date of Birth"
                        : null
                    }
                    error={errors.q_1}
                  />
                </div>
              )}

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl text-xs font-extrabold bg-[#032e92] hover:bg-[#021d63] text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Financial Situation</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCIAL SITUATION (INCOME SLAB + RISK Q2 & Q3) */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faWallet} className="text-[#032e92] text-sm" />
                  <span>Step 2: Financial Situation & Dependents</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  These details help us align your investment portfolio with your monthly cash flows
                  and financial obligations.
                </p>
              </div>

              {/* 1. Income Slab */}
              <FinancialDetailsSection
                incomeSlab={formData.income_slab}
                onChange={(val) => handleFieldChange("income_slab", val)}
                error={errors.income_slab}
              />

              {/* 2. Risk Q2: Dependents */}
              {q2 && (
                <div className="pt-4 border-t border-gray-100">
                  <RiskQuestionCard
                    question={q2}
                    selectedOptionText={riskAnswers[2]?.selectedOptionText}
                    onSelect={(optText, score) => handleSelectRiskOption(2, optText, score)}
                    error={errors.q_2}
                  />
                </div>
              )}

              {/* 3. Risk Q3: Monthly income to expenses & EMI */}
              {q3 && (
                <div className="pt-4 border-t border-gray-100">
                  <RiskQuestionCard
                    question={q3}
                    selectedOptionText={riskAnswers[3]?.selectedOptionText}
                    onSelect={(optText, score) => handleSelectRiskOption(3, optText, score)}
                    error={errors.q_3}
                  />
                </div>
              )}

              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl text-xs font-extrabold bg-[#032e92] hover:bg-[#021d63] text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Investment Priorities</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: INVESTMENT BEHAVIOR & PRIORITIES (RISK Q5 & Q14) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartLine} className="text-[#032e92] text-sm" />
                  <span>Step 3: Investment Behavior & Priorities</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tell us about your emergency liquidity preferences and long-term investment goals.
                </p>
              </div>

              {/* Risk Q5: Emergency withdrawal */}
              {q5 && (
                <RiskQuestionCard
                  question={q5}
                  selectedOptionText={riskAnswers[5]?.selectedOptionText}
                  onSelect={(optText, score) => handleSelectRiskOption(5, optText, score)}
                  error={errors.q_5}
                />
              )}

              {/* Risk Q14: Investment priority */}
              {q14 && (
                <div className="pt-4 border-t border-gray-100">
                  <RiskQuestionCard
                    question={q14}
                    selectedOptionText={riskAnswers[14]?.selectedOptionText}
                    onSelect={(optText, score) => handleSelectRiskOption(14, optText, score)}
                    error={errors.q_14}
                  />
                </div>
              )}

              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl text-xs font-extrabold bg-[#032e92] hover:bg-[#021d63] text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Nominee Details</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: NOMINEE DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <NomineeDetailsSection
                data={formData}
                onChange={handleFieldChange}
                clientAddress={formData.address || formData.address_line1}
                errors={errors}
              />

              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl text-xs font-extrabold bg-[#032e92] hover:bg-[#021d63] text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Bank Details</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: BANK DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <BankDetailsSection
                data={formData}
                onChange={handleFieldChange}
                token={token}
                errors={errors}
              />

              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl text-xs font-extrabold bg-[#032e92] hover:bg-[#021d63] text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Review and Submit</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & SUBMIT */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <FormReviewSection
                workflowType="combined_onboarding"
                personalData={formData}
                riskAnswers={riskAnswers}
                riskQuestions={questions}
                nomineeData={formData}
                bankData={formData}
                onJumpToStep={handleJumpToStep}
                onSubmit={handleSubmit}
                submitting={submitting}
              />

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Back to Bank Details</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
