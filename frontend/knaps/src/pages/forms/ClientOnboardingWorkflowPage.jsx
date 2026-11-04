import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { formWorkflowService } from "../../services/formWorkflowService";
import FormHeader from "../../components/forms/FormHeader";
import PersonalDetailsSection from "../../components/forms/PersonalDetailsSection";
import FinancialDetailsSection from "../../components/forms/FinancialDetailsSection";
import NomineeDetailsSection from "../../components/forms/NomineeDetailsSection";
import BankDetailsSection from "../../components/forms/BankDetailsSection";
import FormReviewSection from "../../components/forms/FormReviewSection";
import FormSuccessState from "../../components/forms/FormSuccessState";
import FormErrorState from "../../components/forms/FormErrorState";

export default function ClientOnboardingWorkflowPage() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [context, setContext] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
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

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const steps = [
    { id: "personal", title: "Personal Details" },
    { id: "nominee", title: "Nominee Details" },
    { id: "bank", title: "Bank Details" },
    { id: "review", title: "Review & Submit" },
  ];

  const loadFormContext = async () => {
    setLoading(true);
    setErrorState(null);
    try {
      const res = await formWorkflowService.getPublicFormContext(token);
      if (res.already_submitted) {
        setSubmissionResult({
          message: res.message || "This onboarding form has already been submitted.",
        });
      }
      setContext(res);

      // Merge prefill data and any saved draft
      const prefill = res.prefill || {};
      const draft = res.draft || {};
      setFormData((prev) => ({
        ...prev,
        ...prefill,
        ...draft,
        address: draft.address || prefill.address_line1 || prev.address,
      }));
    } catch (err) {
      setErrorState(err.message || "Failed to load onboarding form");
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
      // Background draft save
      formWorkflowService.saveFormProgress(token, updated).catch(() => {});
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // Step Validations
  const validateStep = (stepIdx) => {
    const errs = {};
    let valid = true;

    if (stepIdx === 0) {
      // Personal Details Validation
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
      if (!formData.income_slab) {
        errs.income_slab = "Please select annual income slab.";
        valid = false;
      }
      if (!formData.address?.trim() && !formData.address_line1?.trim()) {
        errs.address = "Address is required.";
        valid = false;
      }
    } else if (stepIdx === 1) {
      // Nominee Validation
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
        errs.guardian_name = "Guardian Name is required for minor nominee.";
        valid = false;
      }
    } else if (stepIdx === 2) {
      // Bank Validation
      if (formData.bank_entry_method === "Manual") {
        if (!formData.bank_ifsc?.trim()) {
          errs.bank_ifsc = "Bank IFSC code is required.";
          valid = false;
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bank_ifsc.trim().toUpperCase())) {
          errs.bank_ifsc = "Invalid IFSC format (e.g. HDFC0001234).";
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
    else if (section === "nominee") setCurrentStep(1);
    else if (section === "bank") setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    for (let s = 0; s < 3; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await formWorkflowService.submitClientOnboarding(token, formData);
      setSubmissionResult(res);
    } catch (err) {
      alert(err.message || "Failed to submit onboarding form");
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
            <h3 className="text-sm font-bold text-gray-900">Loading Client Onboarding</h3>
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
          title="Client Onboarding Form"
          subtitle="Customer Identification & Depository Registration"
          customerName={formData.full_name}
        />
        <FormSuccessState
          result={submissionResult}
          workflowType="client_onboarding"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <FormHeader
        title="Client Onboarding Form"
        subtitle="Complete your personal KYC, nomination, and registered bank details."
        steps={steps}
        currentStep={currentStep}
        onStepClick={(idx) => setCurrentStep(idx)}
        customerName={context?.prefill?.full_name}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-6 sm:p-8">
          {/* STEP 1: PERSONAL & FINANCIAL DETAILS */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <PersonalDetailsSection
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
                prefill={context?.prefill || {}}
              />

              <div className="pt-4 border-t border-gray-100">
                <FinancialDetailsSection
                  incomeSlab={formData.income_slab}
                  onChange={(val) => handleFieldChange("income_slab", val)}
                  error={errors.income_slab}
                />
              </div>

              <div className="pt-6 flex justify-end">
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

          {/* STEP 2: NOMINEE DETAILS */}
          {currentStep === 1 && (
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

          {/* STEP 3: BANK DETAILS */}
          {currentStep === 2 && (
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

          {/* STEP 4: REVIEW & SUBMIT */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <FormReviewSection
                workflowType="client_onboarding"
                personalData={formData}
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
