import { getCsrfToken } from '../utils/csrf';

async function fetchCrmApi(endpoint, method = 'GET', body = null) {
  const csrfToken = await getCsrfToken();
  const headers = {
    'Accept': 'application/json',
  };
  if (csrfToken) {
    headers['X-Frappe-CSRF-Token'] = csrfToken;
  }
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message?.message || data?._server_messages || data?.exc_message || 'CRM request failed';
    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  }

  return data.message !== undefined ? data.message : data;
}

export const crmService = {
  getBootstrap: () => fetchCrmApi('/api/method/dhanada.crm_api.get_crm_bootstrap'),
  
  getLeads: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchCrmApi(`/api/method/dhanada.crm_api.get_leads?${query}`);
  },

  getLeadDetails: (leadName) => 
    fetchCrmApi(`/api/method/dhanada.crm_api.get_lead_details?lead_name=${encodeURIComponent(leadName)}`),

  createLead: (leadData) => 
    fetchCrmApi('/api/method/dhanada.crm_api.create_crm_lead', 'POST', leadData),

  updateLeadStatus: (leadName, status, reason = '') =>
    fetchCrmApi('/api/method/dhanada.crm_api.update_crm_lead_status', 'POST', {
      lead_name: leadName,
      status,
      reason,
    }),

  logInteraction: (data) =>
    fetchCrmApi('/api/method/dhanada.crm_api.quick_log_interaction', 'POST', data),

  getClients: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchCrmApi(`/api/method/dhanada.crm_api.get_clients?${query}`);
  },

  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchCrmApi(`/api/method/dhanada.crm_api.get_tasks?${query}`);
  },

  updateTaskStatus: (taskName, status, outcome = '') =>
    fetchCrmApi('/api/method/dhanada.crm_api.update_task_status', 'POST', {
      task_name: taskName,
      status,
      outcome,
    }),

  createTask: (data) =>
    fetchCrmApi('/api/method/dhanada.crm_api.create_crm_task', 'POST', data),

  getRenewals: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchCrmApi(`/api/method/dhanada.crm_api.get_renewals?${query}`);
  },

  sendWelcomeEmail: (leadName) =>
    fetchCrmApi('/api/method/dhanada.crm_api.trigger_welcome_email', 'POST', { lead_name: leadName }),

  sendOnboardingAndProfiler: (leadName) =>
    fetchCrmApi('/api/method/dhanada.crm_api.trigger_onboarding_and_profiler', 'POST', { lead_name: leadName }),

  convertToClient: (leadName) =>
    fetchCrmApi('/api/method/dhanada.crm_api.trigger_convert_to_client', 'POST', { lead_name: leadName }),
};