/**
 * Form Workflow Service
 * Client-facing APIs for the 3 customer form workflows:
 * - Risk Profiler Only
 * - Client Onboarding Only
 * - Combined Risk Profiler + Client Onboarding
 */

import { getCsrfToken } from "../utils/csrf";

function extractErrorMessage(data, fallback = "Operation failed") {
  if (!data) return fallback;

  // 1. Frappe _server_messages (doubly-stringified JSON array of JSON strings)
  if (data._server_messages) {
    try {
      const parsed = JSON.parse(data._server_messages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let first = parsed[0];
        if (typeof first === "string") {
          try {
            first = JSON.parse(first);
          } catch {
            // keep string as is
          }
        }
        const firstMsg = typeof first === "object" ? first?.message : first;
        if (typeof firstMsg === "string" && firstMsg.trim()) {
          return firstMsg.replace(/<[^>]*>?/gm, "").trim();
        }
      }
    } catch {
      // ignore parse error
    }
  }

  // 2. Standard message string or nested message
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message.trim();
  }
  if (data.message?.message && typeof data.message.message === "string") {
    return data.message.message.trim();
  }

  // 3. Frappe _error_message
  if (typeof data._error_message === "string" && data._error_message.trim()) {
    return data._error_message.replace(/<[^>]*>?/gm, "").trim();
  }

  // 4. Exception message (clean exception prefix like "ValidationError: ...")
  if (typeof data.exception === "string" && data.exception.trim()) {
    const firstLine = data.exception.split("\n")[0];
    const clean = firstLine.replace(/^[\w.]*:\s*/, "").trim();
    if (clean) return clean;
  }

  // 5. exc_message
  if (typeof data.exc_message === "string" && data.exc_message.trim()) {
    const firstLine = data.exc_message.split("\n")[0];
    return firstLine.replace(/<[^>]*>?/gm, "").trim();
  }

  return fallback;
}

async function requestPublicFormApi(endpoint, method = "GET", body = null) {
  const headers = {
    Accept: "application/json",
  };
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const csrfToken = await getCsrfToken().catch(() => "");
  if (csrfToken) {
    headers["X-Frappe-CSRF-Token"] = csrfToken;
  }

  const payload = body ? { ...body, csrf_token: csrfToken || undefined } : null;

  const options = {
    method,
    headers,
    credentials: "include",
  };
  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const res = await fetch(endpoint, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(extractErrorMessage(data, "Form request failed"));
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data.message !== undefined ? data.message : data;
}

export const formWorkflowService = {
  /**
   * Loads public form context using secure token.
   * Returns prefill data, workflow type, expiry, and draft.
   */
  getPublicFormContext: (token) =>
    requestPublicFormApi(
      `/api/method/dhanada.form_workflow_api.get_public_form_context?token=${encodeURIComponent(
        token
      )}`
    ),

  /**
   * Saves partial draft progress.
   */
  saveFormProgress: (token, payload) =>
    requestPublicFormApi(
      "/api/method/dhanada.form_workflow_api.save_form_progress",
      "POST",
      { token, payload }
    ),

  /**
   * Helper lookup for IFSC code.
   */
  lookupIfsc: (ifscCode) =>
    requestPublicFormApi(
      `/api/method/dhanada.form_workflow_api.lookup_ifsc?ifsc_code=${encodeURIComponent(
        ifscCode
      )}`
    ),

  /**
   * Uploads bank proof file (cancelled cheque / passbook).
   */
  uploadBankProof: async (token, file) => {
    const csrfToken = await getCsrfToken().catch(() => "");
    const formData = new FormData();
    formData.append("token", token);
    formData.append("file", file);
    if (csrfToken) {
      formData.append("csrf_token", csrfToken);
    }

    const headers = {};
    if (csrfToken) {
      headers["X-Frappe-CSRF-Token"] = csrfToken;
    }

    const res = await fetch("/api/method/dhanada.form_workflow_api.upload_bank_proof", {
      method: "POST",
      headers,
      credentials: "include",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(extractErrorMessage(data, "File upload failed"));
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data.message !== undefined ? data.message : data;
  },

  /**
   * Submits Risk Profiler Only form.
   */
  submitRiskProfiler: (token, answers) =>
    requestPublicFormApi(
      "/api/method/dhanada.form_workflow_api.submit_risk_profiler_form",
      "POST",
      { token, answers }
    ),

  /**
   * Submits Client Onboarding Only form.
   */
  submitClientOnboarding: (token, payload) =>
    requestPublicFormApi(
      "/api/method/dhanada.form_workflow_api.submit_client_onboarding_form",
      "POST",
      { token, payload }
    ),

  /**
   * Submits Combined Risk Profiler + Client Onboarding form.
   */
  submitCombinedOnboarding: (token, payload) =>
    requestPublicFormApi(
      "/api/method/dhanada.form_workflow_api.submit_combined_form",
      "POST",
      { token, payload }
    ),
};
