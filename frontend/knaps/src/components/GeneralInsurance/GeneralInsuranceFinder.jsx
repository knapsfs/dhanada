import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCar, 
  faHeartPulse, 
  faHouseChimney, 
  faPlaneDeparture, 
  faBuilding, 
  faCheckCircle, 
  faArrowRight, 
  faStar, 
  faCircleQuestion, 
  faPhone 
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const requirementCategories = [
  {
    id: 'motor',
    label: 'Vehicle & Mobility',
    icon: faCar,
    tagline: 'Comprehensive protection for cars, two-wheelers & commercial fleets',
    subOptions: [
      {
        id: 'car',
        title: 'Private Car Insurance',
        desc: 'Bumper-to-bumper zero dep cover with 24x7 roadside assistance and instant cashless claims.',
        idealFor: 'Personal hatchback, sedan, EV or luxury SUV owners',
        coverageHighlights: [
          'Zero Depreciation coverage on all plastic, glass & metal parts',
          '24/7 Roadside Assistance & towing within 50 km',
          'Engine & Electronic gearbox protection against water ingress',
          'No Claim Bonus (NCB) retention shield up to 50%',
          'Return to Invoice (RTI) covering total on-road price',
          'Cashless settlement across 7,500+ authorized brand workshops'
        ],
        popularAddons: ['Zero Dep', 'Engine Protect', 'Consumables Cover', 'NCB Shield'],
        indicativeBadge: 'Instant Cashless at 7,500+ Garages'
      },
      {
        id: 'bike',
        title: 'Two-Wheeler Insurance',
        desc: 'Mandatory third-party and complete own damage shield for motorbikes, scooters & superbikes.',
        idealFor: 'Daily commuters, bike enthusiasts & delivery fleets',
        coverageHighlights: [
          'Mandatory 5-year third-party liability cover compliance',
          'Accidental damage, fire, vandalism & natural calamity cover',
          'Personal Accident cover of ₹15 Lakh for the owner-driver',
          'Pillion rider personal accidental cover add-on',
          'Emergency breakdown assistance & flat tyre support'
        ],
        popularAddons: ['Zero Depreciation', 'Pillion Cover', 'Helmet & Gear Cover'],
        indicativeBadge: 'Starts from ₹1.5/day'
      },
      {
        id: 'fleet',
        title: 'Commercial Vehicle Insurance',
        desc: 'Reliable business protection for cabs, auto-rickshaws, transport trucks & cargo carriers.',
        idealFor: 'Logistics owners, cab aggregators & goods transporters',
        coverageHighlights: [
          'Extensive third-party property damage & legal liability',
          'Driver, conductor & paid cleaner accidental cover',
          'Damage due to overturning, fire, explosion & lightning',
          'Transit cargo protection add-on option'
        ],
        popularAddons: ['Legal Liability to Paid Drivers', 'IMT 23 Endorsement', 'Towing Cover'],
        indicativeBadge: 'Fleet Discount Available'
      }
    ]
  },
  {
    id: 'health',
    label: 'Health & Medical',
    icon: faHeartPulse,
    tagline: 'Comprehensive hospitalization shields safeguarding personal savings',
    subOptions: [
      {
        id: 'family',
        title: 'Family Floater Health Cover',
        desc: 'A single high-sum insured policy protecting self, spouse, and up to 4 dependent children.',
        idealFor: 'Young families wanting seamless combined medical security',
        coverageHighlights: [
          'Sum insured options from ₹10 Lakh to ₹1 Crore with unlimited restoration',
          'Cashless hospitalization at 14,000+ top network hospitals nationwide',
          'Zero room rent capping & zero disease-wise sub-limits',
          'Pre & post hospitalization expenses covered (60 & 180 days)',
          'Annual comprehensive health check-ups for all adult members',
          'Tax savings up to ₹75,000 under Section 80D'
        ],
        popularAddons: ['Maternity & Newborn Care', 'Consumables Shield', 'OPD Consultations'],
        indicativeBadge: '100% Bill Payment & Zero Deduction'
      },
      {
        id: 'senior',
        title: 'Senior Citizen Health Plan',
        desc: 'Tailored healthcare shield for parents and seniors (aged 60+) with simplified underwriting.',
        idealFor: 'Elderly parents with pre-existing conditions like diabetes or hypertension',
        coverageHighlights: [
          'Day 1 or reduced waiting periods (1-2 years) for pre-existing diseases',
          'In-home healthcare, AYUSH treatments & dialysis coverage',
          'Cataract, joint replacement & cardiac procedure covers',
          'No mandatory pre-policy medical tests for select partner insurers'
        ],
        popularAddons: ['Critical Illness Rider', 'Home Healthcare Cover', 'OPD Care'],
        indicativeBadge: 'Tax Rebate up to ₹50,000 u/s 80D'
      },
      {
        id: 'topup',
        title: 'Super Top-Up Health Shield',
        desc: 'Affordable high-value safety net to boost your corporate or basic health insurance cushion.',
        idealFor: 'Salaried professionals with low corporate health coverage',
        coverageHighlights: [
          'Get ₹25L to ₹1Cr additional coverage at just 15-20% of base policy cost',
          'Deductibles starting from ₹3 Lakh to ₹10 Lakh aligned with base policy',
          'Cumulative claims aggregation across the entire policy year',
          'Seamless cashless switch once base deductible is reached'
        ],
        popularAddons: ['Inflation Shield', 'Global Emergency Cover'],
        indicativeBadge: '₹50L Cover from ~₹300/mo'
      }
    ]
  },
  {
    id: 'home',
    label: 'Home & Property',
    icon: faHouseChimney,
    tagline: 'Safeguard your most prized sanctuary against fire, flood, theft & disasters',
    subOptions: [
      {
        id: 'structure_contents',
        title: 'Structure & Content Shield (Homeowners)',
        desc: 'Complete 360-degree protection covering the physical house building and interior assets.',
        idealFor: 'Independent homeowners, villa & apartment owners',
        coverageHighlights: [
          'Reconstruction cost coverage for earthquake, flood, storm & fire damage',
          'Valuable interior contents: electronics, modular kitchen, furniture & appliances',
          'Burglary, housebreaking & attempted theft protection',
          'Alternative accommodation rent reimbursement if home becomes uninhabitable',
          'Personal liability cover for third-party injury occurring on premises'
        ],
        popularAddons: ['Jewellery & Valuables Floater', 'Terrorism Cover', 'Electronic Breakdown'],
        indicativeBadge: 'Starts at ₹3/day for ₹50L Cover'
      },
      {
        id: 'tenant',
        title: 'Tenants Interior & Belongings Shield',
        desc: 'Designed exclusively for renters to protect personal furniture, gadgets, and appliances.',
        idealFor: 'Tenants living in rented apartments or houses',
        coverageHighlights: [
          'Loss or breakdown of TVs, refrigerators, laptops & home audio',
          'Fire, electrical short-circuit and water leakage damage to contents',
          'Theft & accidental damage protection during household relocation',
          'Low cost, paperless policy setup without landlord involvement'
        ],
        popularAddons: ['Portable Equipment Cover', 'Accidental Damage to Gadgets'],
        indicativeBadge: 'Instant 2-Minute Issuance'
      }
    ]
  },
  {
    id: 'travel',
    label: 'Travel & Global Mobility',
    icon: faPlaneDeparture,
    tagline: 'Stress-free journeys across domestic destinations and overseas continents',
    subOptions: [
      {
        id: 'international',
        title: 'International Travel Insurance',
        desc: 'Mandatory coverage for Schengen, USA, UK, Europe, UAE & worldwide journeys.',
        idealFor: 'Vacationers, business executives & family tourists',
        coverageHighlights: [
          'Cashless overseas medical hospitalization up to $500,000 USD',
          'Medical evacuation & emergency repatriation assistance',
          'Loss or delayed checked-in baggage compensation',
          'Passport loss assistance & emergency financial cash advance',
          'Trip cancellation, curtailment & missed flight connection reimbursement',
          'Complies 100% with Schengen visa requirements (€30,000+ medical cover)'
        ],
        popularAddons: ['Adventure Sports Cover', 'Pre-existing Medical Emergency Rider'],
        indicativeBadge: 'Embassy Approved & Instant Policy'
      },
      {
        id: 'student',
        title: 'Student Overseas Education Cover',
        desc: 'Comprehensive medical and study-continuity shield for students attending foreign universities.',
        idealFor: 'Students studying in USA, Canada, UK, Australia & Europe',
        coverageHighlights: [
          'Meets mandatory US university insurance waiver requirements',
          'Study interruption cover in case of medical distress or family emergency',
          'Compassionate visit expenses for parents if student is hospitalized',
          'Bail bond, legal fees & personal liability protection abroad'
        ],
        popularAddons: ['Sponsor Protection', 'Mental Health & Wellness Cover'],
        indicativeBadge: 'Save up to 70% vs University Plans'
      }
    ]
  },
  {
    id: 'business',
    label: 'Business & Commercial',
    icon: faBuilding,
    tagline: 'Enterprise-grade risk management for shops, factories, offices & cargo',
    subOptions: [
      {
        id: 'sme_shop',
        title: 'Shopkeeper & Office Comprehensive Policy',
        desc: 'All-in-one package policy safeguarding small businesses, retail outlets and consulting offices.',
        idealFor: 'Retail retailers, clinic owners, IT offices, cafes & warehouses',
        coverageHighlights: [
          'Damage to stock-in-trade, fixtures, fittings & office machines due to fire or flood',
          'Theft, cash-in-safe, and cash-in-transit robbery protection',
          'Public liability cover protecting against visitor accidents or slips',
          'Plate glass breakage and electronic equipment failure cover'
        ],
        popularAddons: ['Business Interruption Cover', 'Employee Dishonesty (Fidelity)'],
        indicativeBadge: 'Custom SME Packages'
      },
      {
        id: 'marine_liability',
        title: 'Marine Cargo & Commercial Liabilities',
        desc: 'Protect cargo in transit and shield your corporate directors and operations from litigation.',
        idealFor: 'Exporters, importers, manufacturers & corporate directors',
        coverageHighlights: [
          'Transit damage by rail, road, sea & air across national and global routes',
          'Directors & Officers (D&O) liability safeguarding executive decisions',
          'Professional Indemnity (PI) for consulting, tech, accounting & healthcare firms',
          'Workmen’s Compensation cover complying with the Employees Compensation Act'
        ],
        popularAddons: ['Cyber Risk Liability', 'Commercial General Liability (CGL)'],
        indicativeBadge: 'Institutional Advisory'
      }
    ]
  }
];

const GeneralInsuranceFinder = () => {
  const { openLeadModal } = useLeadModal();
  const [selectedCatId, setSelectedCatId] = useState('motor');
  const [selectedSubIndex, setSelectedSubIndex] = useState(0);

  const activeCategory = requirementCategories.find((c) => c.id === selectedCatId) || requirementCategories[0];
  const activeOption = activeCategory.subOptions[selectedSubIndex] || activeCategory.subOptions[0];

  const handleCategoryChange = (catId) => {
    setSelectedCatId(catId);
    setSelectedSubIndex(0);
  };

  const handleGetQuote = () => {
    openLeadModal({
      title: `Get Quote: ${activeOption.title}`,
      defaultService: 'General Insurance'
    });
  };

  return (
    <section id="insurance-finder" className="py-20 lg:py-28 bg-[#f7f9fc] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-[#032e92]" />
            <span>Interactive Cover Matcher</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Find the <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">Right Cover</span> for Your Need
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Select what you wish to protect and explore tailored policy configurations, essential add-ons, and instant quotation guidance.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
          {requirementCategories.map((cat) => {
            const isActive = cat.id === selectedCatId;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-sm cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/25 scale-[1.02]'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200/80 hover:border-blue-200'
                }`}
              >
                <FontAwesomeIcon icon={cat.icon} className={`text-base ${isActive ? 'text-white' : 'text-[#032e92]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tagline for selected category */}
        <div className="text-center mb-8">
          <p className="text-sm sm:text-base font-medium text-[#032e92] bg-blue-50/80 border border-blue-100/60 inline-block px-4 py-1.5 rounded-full">
            {activeCategory.tagline}
          </p>
        </div>

        {/* Sub-options selection pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {activeCategory.subOptions.map((sub, idx) => {
            const isSubActive = idx === selectedSubIndex;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubIndex(idx)}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-[#032e92] text-white shadow-md'
                    : 'bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-white'
                }`}
              >
                {sub.title}
              </button>
            );
          })}
        </div>

        {/* Main Recommendation Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/80 shadow-xl relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#032e92] via-[#0066cc] to-[#021d63]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Overview & Key Highlights (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeOption.indicativeBadge}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0a192f] tracking-tight">
                  {activeOption.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {activeOption.desc}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="font-semibold text-gray-700">Ideal For:</span>
                  <span>{activeOption.idealFor}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#032e92]" />
                  What is Covered Under This Plan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeOption.coverageHighlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 mt-0.5 text-xs" />
                      <span className="text-xs sm:text-sm text-gray-700 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Add-ons & Instant Action Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#f8fafc] to-[#eef4ff] rounded-2xl p-6 sm:p-7 border border-blue-100/80 space-y-6 flex flex-col justify-between h-full">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#032e92] mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-amber-500" />
                  Recommended Add-Ons for Complete Peace of Mind
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Strengthen your policy with rider covers to eliminate out-of-pocket costs during claim settlements:
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeOption.popularAddons.map((addon, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#032e92] border border-blue-200/70 shadow-xs"
                    >
                      + {addon}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Insurer Comparison:</span>
                    <span className="font-semibold text-gray-900">15+ IRDAI Partners</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Claim Settlement Assistance:</span>
                    <span className="font-semibold text-emerald-700">Dedicated Concierge</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Policy Issuance:</span>
                    <span className="font-semibold text-gray-900">100% Instant & Paperless</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={handleGetQuote}
                  className="w-full btn-ripple px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/30 hover:shadow-xl hover:shadow-[#032e92]/40 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span>Get Customized {activeOption.title} Quote</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-sm group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-1">
                  <a href="tel:+918080808080" className="inline-flex items-center gap-1.5 hover:text-[#032e92] font-medium transition-colors">
                    <FontAwesomeIcon icon={faPhone} className="text-[#032e92] text-xs" />
                    <span>Or Speak with Insurance Advisor</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unsure Note */}
        <div className="mt-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-gray-400" />
            <span>Unsure which policy fits your exact requirements? Our IRDAI certified experts provide free, zero-bias comparative analysis.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default GeneralInsuranceFinder;
