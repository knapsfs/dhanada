import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faPhone, faEnvelope, faUserCheck, faShieldHalved, faUsers,
  faCommentDots, faTriangleExclamation, faClock, faUser, faFloppyDisk,
  faSpinner, faXmark, faCheckCircle, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { crmService } from '../../services/crmService';
import { getContactStatus, formatContactDate } from '../../utils/crmContactUtils';

export default function CrmClientsView({ clients = [], loading = false, onClientUpdated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientForRemark, setSelectedClientForRemark] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [savingRemark, setSavingRemark] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const filtered = clients.filter((c) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      (c.client_name && c.client_name.toLowerCase().includes(s)) ||
      (c.email && c.email.toLowerCase().includes(s)) ||
      (c.mobile_no && c.mobile_no.includes(s)) ||
      (c.pan && c.pan.toLowerCase().includes(s)) ||
      (c.name && c.name.toLowerCase().includes(s))
    );
  });

  const handleSaveClientRemark = async (e) => {
    e.preventDefault();
    if (!remarkText.trim() || !selectedClientForRemark) return;
    setSavingRemark(true);
    setFeedback({ type: '', message: '' });
    try {
      const res = await crmService.saveContactRemark('Client', selectedClientForRemark.name, remarkText.trim());
      const updatedClient = {
        ...selectedClientForRemark,
        latest_remark: res.latest_remark,
        last_contacted_by: res.last_contacted_by,
        last_contacted_on: res.last_contacted_on,
        days_since_contact: res.days_since_contact,
        is_contact_overdue: res.is_contact_overdue,
      };
      setSelectedClientForRemark(updatedClient);
      setRemarkText('');
      setFeedback({ type: 'success', message: 'Latest remark and contact timestamp saved successfully!' });
      onClientUpdated && onClientUpdated(updatedClient);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save remark' });
    } finally {
      setSavingRemark(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col relative">
      {/* Top Search Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search by client name, mobile, PAN, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
          />
        </div>

        <div className="text-xs font-semibold text-gray-500">
          Showing <span className="font-bold text-gray-900">{filtered.length}</span> Clients
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/80">
              <th className="py-3 px-4 sm:px-6">Client</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">PAN & KYC</th>
              <th className="py-3 px-4">Family Role</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400 font-medium">
                  {loading ? 'Loading clients...' : 'No clients found in records.'}
                </td>
              </tr>
            ) : (
              filtered.map((client) => {
                const cleanPhone = client.mobile_no ? client.mobile_no.replace(/\D/g, '') : '';
                const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                return (
                  <tr key={client.name} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-gray-900">{client.client_name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-gray-400 font-mono">{client.name}</span>
                        {(() => {
                          const contactInfo = getContactStatus(
                            client.last_contacted_on,
                            client.days_since_contact,
                            client.is_contact_overdue
                          );
                          if (contactInfo.isOverdue) {
                            return (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-[9px]" />
                                <span>{contactInfo.label}</span>
                              </span>
                            );
                          }
                          return (
                            <span className="text-[10px] text-gray-400">
                              · {contactInfo.label}
                            </span>
                          );
                        })()}
                      </div>
                      {client.latest_remark && (
                        <p className="text-[11px] text-gray-600 italic mt-1 line-clamp-1 max-w-xs">
                          <span className="font-semibold not-italic text-gray-700">Remark: </span>{client.latest_remark}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-800">{client.mobile_no || '—'}</div>
                      <div className="text-[11px] text-gray-400">{client.email || ''}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs font-bold text-gray-700">{client.pan || 'PAN Pending'}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${client.kyc_status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        KYC: {client.kyc_status || 'Pending'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {client.family ? (
                        <div className="flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faUsers} className="text-[#032e92] text-[10px]" />
                          <span className="font-semibold text-gray-700">{client.family_role || 'Member'}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Individual</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700">
                        {client.investor_category || 'Retail'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${client.client_status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {client.client_status || 'Active'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClientForRemark(client);
                            setRemarkText('');
                            setFeedback({ type: '', message: '' });
                          }}
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-[#032e92] text-[#032e92] hover:text-white flex items-center justify-center transition-colors text-xs cursor-pointer"
                          title="Record / View Contact Remark"
                        >
                          <FontAwesomeIcon icon={faCommentDots} />
                        </button>

                        {cleanPhone && (
                          <>
                            <a
                              href={`tel:${cleanPhone}`}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#032e92] flex items-center justify-center transition-colors text-xs"
                              title="Call Client"
                            >
                              <FontAwesomeIcon icon={faPhone} />
                            </a>
                            <a
                              href={`https://wa.me/${waPhone}?text=Hello%20${encodeURIComponent(client.client_name || '')},%20greetings%20from%20KNAPS%20Wealth%20Advisory.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors text-[10px] font-bold"
                              title="WhatsApp"
                            >
                              WA
                            </a>
                          </>
                        )}
                        {client.email && (
                          <a
                            href={`mailto:${client.email}`}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#032e92] flex items-center justify-center transition-colors text-xs"
                            title="Email Client"
                          >
                            <FontAwesomeIcon icon={faEnvelope} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Client Latest Remark Modal */}
      {selectedClientForRemark && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] text-gray-400 block">{selectedClientForRemark.name}</span>
                <h3 className="text-lg font-bold text-gray-900">{selectedClientForRemark.client_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClientForRemark(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Overdue Warning Badge */}
            <div>
              {(() => {
                const contactInfo = getContactStatus(
                  selectedClientForRemark.last_contacted_on,
                  selectedClientForRemark.days_since_contact,
                  selectedClientForRemark.is_contact_overdue
                );
                if (contactInfo.isOverdue) {
                  return (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600" />
                      <span>{contactInfo.label}</span>
                    </div>
                  );
                }
                if (contactInfo.status === 'never_contacted') {
                  return (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                      <span>{contactInfo.label}</span>
                    </div>
                  );
                }
                return (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <span>{contactInfo.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* Current Latest Remark Box */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-gray-200 text-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Current Latest Remark</span>
              {selectedClientForRemark.latest_remark ? (
                <div>
                  <p className="text-gray-900 font-medium leading-relaxed whitespace-pre-wrap">
                    "{selectedClientForRemark.latest_remark}"
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between gap-3 text-[11px] text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 text-[10px]" />
                      <span>Contacted by: <strong className="text-gray-700">{selectedClientForRemark.last_contacted_by || 'Unknown'}</strong></span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faClock} className="text-gray-400 text-[10px]" />
                      <span>{formatContactDate(selectedClientForRemark.last_contacted_on)}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic">No contact remark recorded yet.</p>
              )}
            </div>

            {/* Notifications */}
            {feedback.message && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                <FontAwesomeIcon icon={feedback.type === 'success' ? faCheckCircle : faCircleExclamation} />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Record New Remark Form */}
            <form onSubmit={handleSaveClientRemark} className="space-y-3 pt-1">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Record New Contact Remark
              </label>
              <textarea
                rows={3}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter client portfolio review notes, follow-up call, or discussion outcome..."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors resize-none"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedClientForRemark(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={savingRemark || !remarkText.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                >
                  {savingRemark ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                      <span>Saving Remark...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />
                      <span>Save Remark</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
