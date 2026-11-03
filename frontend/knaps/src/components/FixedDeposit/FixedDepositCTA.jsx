import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPhone,
  faCheckCircle,
  faShieldHalved,
  faLandmark,
  faBuildingColumns,
  faCoins
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

export default function FixedDepositCTA() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#032e92] to-[#021d63] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-blue-900/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-10 sm:mb-12" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">


            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-tight mb-4">
              Build a Resilient Fixed Income Portfolio <br className="hidden sm:inline" />
              <span className="text-blue-100">
                with Top FDs & Sovereign GoI Bonds
              </span>
            </h2>

            <p className="text-sm sm:text-base text-blue-100/90 font-normal max-w-2xl mx-auto leading-relaxed mt-3.5 mb-8">
              Combine the flexibility of Bank and Corporate FDs with the unmatched 100% sovereign guarantee of Government of India (GoI) Bonds. Plan your cashflows with precision and zero market risk.
            </p>



            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() =>
                  openLeadModal({
                    title: "Explore Fixed Income Options",
                    defaultService: "Fixed Income Products"
                  })
                }
                className="w-full sm:w-auto btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>Explore Fixed Income Options</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-sm transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() =>
                  openLeadModal({
                    title: "Consult a Fixed Income Specialist",
                    defaultService: "Fixed Income Products"
                  })
                }
                className="w-full sm:w-auto btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faPhone} className="text-sm text-blue-200" />
                <span>Call a Fixed Income Specialist</span>
              </button>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
