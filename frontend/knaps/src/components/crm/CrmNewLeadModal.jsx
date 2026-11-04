import CrmSelect from './CrmSelect';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { crmService } from '../../services/crmService';

export default function CrmNewLeadModal({ isOpen, onClose, onCreated, sources = [], products = [] }) {
  const [formData, setFormData] = useState({
    lead_name: '',
    mobile_no: '',
    email: '',
    product_interest: 'Long-term wealth creation',
    source: 'Manual',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lead_name.trim()) {
      setError('Please enter the lead full name.');
      return;
    }
    const cleanPhone = formData.mobile_no.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newLead = await crmService.createLead(formData);
      onCreated && onCreated(newLead);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create lead. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#f8fafc]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] border border-blue-100 flex items-center justify-center text-sm font-bold shadow-2xs">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">Create New Lead</h3>
                <p className="text-xs text-gray-500 font-medium">Add prospect directly to the KNAPS pipeline</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Sharma"
                value={formData.lead_name}
                onChange={(e) => setFormData({ ...formData, lead_name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                autoFocus
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile_no}
                  onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Goal / Product of Interest
                </label>
                <CrmSelect
                  value={formData.product_interest}
                  onChange={(val) => setFormData({ ...formData, product_interest: val })}
                  options={products}
                  placeholder="Select product..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Acquisition Source
                </label>
                <CrmSelect
                  value={formData.source}
                  onChange={(val) => setFormData({ ...formData, source: val })}
                  options={sources}
                  placeholder="Select source..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Initial Notes / Goal Requirements
              </label>
              <textarea
                rows="2"
                placeholder="Client goals, preferred time to call, portfolio size..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-ripple px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#032e92] hover:bg-[#021d63] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Lead</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}