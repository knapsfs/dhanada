import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faCalendarAlt, faClock, faUserTie } from '@fortawesome/free-solid-svg-icons';

const STATUS_BADGES = {
  Upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-[#032e92] border-blue-200',
  Renewed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lapsed: 'bg-red-50 text-red-700 border-red-200',
  Cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function CrmRenewalsView({ renewals = [], loading = false }) {
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = renewals.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  const getDaysDiff = (dateStr) => {
    if (!dateStr) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Upcoming', 'In Progress', 'Renewed', 'Lapsed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-[#032e92] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold text-gray-500">
          Showing <span className="font-bold text-gray-900">{filtered.length}</span> Renewals
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/80">
              <th className="py-3 px-4 sm:px-6">Client</th>
              <th className="py-3 px-4">Product / Mandate</th>
              <th className="py-3 px-4">Renewal Date</th>
              <th className="py-3 px-4">Timeline</th>
              <th className="py-3 px-4">Relationship Mgr</th>
              <th className="py-3 px-4 sm:px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400 font-medium">
                  {loading ? 'Loading renewals...' : 'No renewal records found.'}
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const days = getDaysDiff(item.renewal_date);

                return (
                  <tr key={item.name} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-gray-900">{item.client_name || item.client}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{item.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800">{item.product_name}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-700">
                        {item.renewal_date ? new Date(item.renewal_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {days !== null ? (
                        days < 0 ? (
                          <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded text-[10px]">
                            {Math.abs(days)} days ago
                          </span>
                        ) : days === 0 ? (
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px] animate-pulse">
                            Due Today
                          </span>
                        ) : (
                          <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                            In {days} days
                          </span>
                        )
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faUserTie} className="text-gray-400 text-[10px]" />
                        <span>{item.relationship_manager || 'Administrator'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGES[item.status] || 'bg-gray-100 text-gray-700'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
