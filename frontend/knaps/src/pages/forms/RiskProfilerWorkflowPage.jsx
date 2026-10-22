import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faArrowRight,
  faArrowLeft,
  faSpinner,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { formWorkflowService } from "../../services/formWorkflowService";
import FormHeader from "../../components/forms/FormHeader";
import RiskQuestionCard from "../../components/forms/RiskQuestionCard";
import FormReviewSection from "../../components/forms/FormReviewSection";
import FormSuccessState from "../../components/forms/FormSuccessState";
import FormErrorState from "../../components/forms/FormErrorState";

export default function RiskProfilerWorkflowPage() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [context, setContext] = useState(null);

  // Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const steps = [
    { id: "questions", title: "Risk Questions" },
    { id: "review", title: "Review & Submit" },
  ];

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
      // Restore draft answers if present
      if (res.draft?.answers) {
        setAnswers(res.draft.answers);
      }
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

  const handleSelectOption = (qid, optionText, score) => {
    const updated = {
      ...answers,
      [qid]: {
        questionId: qid,
        selectedOptionText: optionText,
        score,
      },
    };
    setAnswers(updated);
    setErrors((prev) => ({ ...prev, [qid]: null }));

    // Auto-save draft in background
    formWorkflowService.saveFormProgress(token, { answers: updated }).catch(() => {});
  };

  const validateQuestions = () => {
    const qList = context?.risk_questions || [];
    const newErrors = {};
    let valid = true;

    for (const q of qList) {
      if (!answers[q.id] || !answers[q.id].selectedOptionText) {
        newErrors[q.id] = "Please select an answer for this question.";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!validateQuestions()) return;
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateQuestions()) {
      setCurrentStep(0);
      return;
    }

    setSubmitting(true);
    try {
      const ansPayload = Object.values(answers);
      const res = await formWorkflowService.submitRiskProfiler(token, ansPayload);
      setSubmissionResult(res);
    } catch (err) {
      alert(err.message || "Failed to submit risk profile");
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
            <h3 className="text-sm font-bold text-gray-900">Loading Risk Profiler</h3>
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
          title="Risk Profiler Assessment"
          subtitle="AMFI Compliant Investor Profiling"
          customerName={context?.prefill?.full_name}
        />
        <FormSuccessState
          result={submissionResult}
          workflowType="risk_profiler"
        />
      </div>
    );
  }

  const questions = context?.risk_questions || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <FormHeader
        title="Investor Risk Profiler Questionnaire"
        subtitle="Help us understand your investment horizon, risk appetite, and financial priorities."
        steps={steps}
        currentStep={currentStep}
        onStepClick={(idx) => setCurrentStep(idx)}
        customerName={context?.prefill?.full_name}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        {/* STEP 1: RISK QUESTIONS */}
        {currentStep === 0 && (
          <div className="space-y-5">
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#032e92] mt-0.5 text-base" />
              <div className="text-xs text-gray-700 leading-relaxed">
                <span className="font-extrabold text-[#032e92] block mb-0.5">
                  Transparent Risk Assessment
                </span>
                This assessment consists of 5 essential questions designed to evaluate your
                investment risk capacity and allocation profile. All answers are processed securely
                and scored by our advisory engine.
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <RiskQuestionCard
                  key={q.id}
                  question={q}
                  selectedOptionText={answers[q.id]?.selectedOptionText}
                  onSelect={(optText, score) => handleSelectOption(q.id, optText, score)}
                  error={errors[q.id]}
                />
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl text-xs font-extrabold bg-[#032e92] hover:bg-[#021d63] text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Review</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & SUBMIT */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <FormReviewSection
              workflowType="risk_profiler"
              riskAnswers={answers}
              riskQuestions={questions}
              onJumpToStep={() => setCurrentStep(0)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Questions</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
