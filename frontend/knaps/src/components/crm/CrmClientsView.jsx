import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPhone, faEnvelope, faUserCheck, faShieldHalved, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function CrmClientsView({ clients = [], loading = false }) {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col">
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
              <th className="py-3 px-4 sm:px-6 text-right">Connect</th>
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
                      <div className="text-[10px] text-gray-400 font-mono">{client.name}</div>
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
    </div>
  );
}
