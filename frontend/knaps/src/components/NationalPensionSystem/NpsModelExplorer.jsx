import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faChild,
  faBuilding,
  faLandmark,
  faReceipt,
  faMoneyBillTransfer,
  faSliders,
  faLayerGroup,
  faUsers,
  faCheckCircle,
  faArrowRight,
  faArrowUpRightFromSquare,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function NpsModelExplorer() {
  const { openLeadModal } = useLeadModal();

  const [activeModelId, setActiveModelId] = useState('all-citizen');
  const [activeTabKey, setActiveTabKey] = useState('tax');

  const tabs = [
    { key: 'tax', label: 'Tax Benefits', icon: faReceipt },
    { key: 'withdrawals', label: 'Withdrawals & Exit', icon: faMoneyBillTransfer },
    { key: 'choices', label: 'Scheme Choices', icon: faSliders },
    { key: 'tiers', label: 'Tier I & II', icon: faLayerGroup },
    { key: 'audience', label: 'Who is it for?', icon: faUsers },
  ];

  const models = [
    {
      id: 'all-citizen',
      name: 'All Citizen NPS',
      subtitle: 'For all Indian citizens (18-70 years)',
      badge: 'All Citizens',
      icon: faUserTie,
      pfrdaUrl: 'https://pfrda.org.in/en/schemes/national-pension-system/nps-for-all-citizen-models',
      sections: {
        tax: {
          title: 'Tax Benefits',
          points: [
            {
              label: 'Section 80CCD(1)',
              desc: 'Deduction on eligible self-contributions, subject to applicable overall Section 80C limits.'
            },
            {
              label: 'Section 80CCD(1B)',
              desc: 'Additional exclusive deduction of up to ₹50,000 for eligible Tier I contributions over and above Section 80C.'
            },
            {
              label: 'Section 80CCD(2)',
              desc: 'Employer contribution benefit, where applicable.'
            },
            {
              label: 'Exit Tax Treatment',
              desc: 'Tax treatment at exit is subject to prevailing Income-tax rules.'
            }
          ]
        },
        withdrawals: {
          title: 'Withdrawals and Exit',
          points: [
            {
              label: 'Tier I Core Account',
              desc: 'Designed primarily for retirement and strictly subject to PFRDA withdrawal rules.'
            },
            {
              label: 'Partial Withdrawal',
              desc: 'Up to 25% of eligible own contributions allowed for specified emergencies and purposes, subject to applicable conditions.'
            },
            {
              label: 'Normal Exit',
              desc: 'Under current All Citizen Model rules, generally up to 80% may be taken as lump sum and at least 20% used for annuity, subject to applicable vesting/corpus conditions.'
            },
            {
              label: 'Tier II Account',
              desc: 'Allows unrestricted withdrawals with zero lock-in period at any time.'
            }
          ]
        },
        choices: {
          title: 'Scheme Choices',
          points: [
            {
              label: 'Active Choice',
              desc: 'Select your own asset allocation across Equity (E, up to 75%), Corporate Debt (C), Government Securities (G), and permitted Alternative Assets (A).'
            },
            {
              label: 'Auto Choice',
              desc: 'Choose a lifecycle strategy where asset allocation recalibrates automatically based on your age.'
            },
            {
              label: 'Pension Fund Managers (PFMs)',
              desc: 'Select from available top PFRDA-registered Pension Fund Managers (SBI, HDFC, ICICI, UTI, etc.).'
            },
            {
              label: 'Switching Flexibility',
              desc: 'Investment choices and asset allocations can be changed periodically subject to applicable PFRDA rules.'
            }
          ]
        },
        tiers: {
          title: 'Tier I and Tier II Accounts',
          subCards: [
            {
              name: 'Tier I — Retirement Account',
              tag: 'Core Pension Account',
              items: [
                'Core NPS pension account designed for long-term retirement savings.',
                'Withdrawals governed by PFRDA rules.',
                'Eligible for applicable NPS tax benefits (80CCD(1) and 80CCD(1B)).'
              ]
            },
            {
              name: 'Tier II — Voluntary Account',
              tag: 'Liquid Investment Account',
              items: [
                'Optional account linked to an active Tier I account.',
                'Flexible and liquid with unrestricted withdrawals at any time.',
                'Generally no tax benefit on contributions.'
              ]
            }
          ]
        },
        audience: {
          title: 'Who is it for?',
          targetList: [
            'Salaried professionals seeking structured retirement corpus and extra tax savings',
            'Self-employed individuals building an independent post-retirement income',
            'Business owners looking for regulated low-cost retirement wealth',
            'Young investors starting retirement planning early with the power of compounding',
            'Individuals looking for a low-cost, structured, institutional retirement investment',
            'Indian citizens, NRIs and eligible OCIs within the applicable age (18-70) and KYC requirements'
          ]
        }
      }
    },
    {
      id: 'vatsalya',
      name: 'NPS Vatsalya',
      subtitle: 'For minor children below 18 years',
      badge: 'Minors (<18)',
      icon: faChild,
      pfrdaUrl: 'https://pfrda.org.in/en/schemes/national-pension-system/nps-vatsalya',
      sections: {
        tax: {
          title: 'Tax Benefits',
          points: [
            {
              label: 'Parent/Guardian Contribution',
              desc: 'Eligible parent/guardian contributions can qualify for a deduction of up to ₹50,000, subject to the applicable tax regime and Income-tax provisions.'
            },
            {
              label: 'Partial Withdrawals',
              desc: 'Eligible partial withdrawals receive the applicable statutory tax exemption.'
            },
            {
              label: 'Lump-Sum Exit Benefits',
              desc: 'Eligible lump-sum exit benefits receive the applicable tax treatment.'
            }
          ]
        },
        withdrawals: {
          title: 'Withdrawals and Exit',
          points: [
            {
              label: '3-Year Requirement',
              desc: 'Partial withdrawal is allowed after 3 years from account opening.'
            },
            {
              label: 'Up to 25% Own Contribution',
              desc: "Up to 25% of the minor's own contributions, excluding investment returns, can be withdrawn for specified purposes."
            },
            {
              label: 'Permitted Purposes',
              desc: 'Permitted purposes include higher education, specified medical treatment, and specified disability-related needs.'
            },
            {
              label: 'Two Withdrawals Before 18',
              desc: 'Before age 18, up to two partial withdrawals are permitted, subject to applicable conditions.'
            },
            {
              label: 'Transition at Age 18',
              desc: 'At 18, the subscriber can continue up to 21, shift into standard All Citizen NPS, or exit under the applicable rules.'
            }
          ]
        },
        choices: {
          title: 'Scheme Choices',
          points: [
            {
              label: 'Guardian Operation',
              desc: 'Parent or legal guardian operates and monitors the account until the child turns 18.'
            },
            {
              label: 'Registered Pension Funds',
              desc: 'Guardian can select from trusted PFRDA-registered Pension Funds.'
            },
            {
              label: 'Market-Linked Growth',
              desc: 'Investments are market-linked across equity and debt for optimal long-term compounding.'
            },
            {
              label: 'Investment Approach',
              desc: 'Available investment approach depends on the applicable NPS Vatsalya framework and selected Pension Fund.'
            }
          ]
        },
        tiers: {
          title: 'Account Architecture',
          subCards: [
            {
              name: 'NPS Vatsalya Dedicated Account',
              tag: 'Dedicated Minor Account',
              items: [
                'Dedicated NPS account opened in the minor child’s name.',
                'Parent or legal guardian operates the account until age 18.',
                'Minimum contribution: ₹250 with no maximum contribution limit.',
                'At 18, the child becomes responsible for the account after completing the required adult KYC.'
              ]
            }
          ]
        },
        audience: {
          title: 'Who is it for?',
          targetList: [
            'Children below 18 years of age',
            "Parents planning for their child's long-term financial future and independence",
            'Guardians looking to start disciplined investing and compounding early',
            'Families wanting to introduce children to long-term saving and investing',
            'Suitable for building a generational financial corpus from an early age'
          ]
        }
      }
    },
    {
      id: 'corporate',
      name: 'Corporate NPS',
      subtitle: 'Employer-employee structured retirement',
      badge: 'Corporate',
      icon: faBuilding,
      pfrdaUrl: 'https://pfrda.org.in/en/schemes/national-pension-system/nps-for-corporates',
      sections: {
        tax: {
          title: 'Tax Benefits',
          points: [
            {
              label: 'Employee Contributions',
              desc: 'Employee contributions can qualify for applicable NPS tax deductions (Sec 80CCD(1) and 80CCD(1B)).'
            },
            {
              label: 'Employer Contribution (Sec 80CCD(2))',
              desc: 'Employer contributions qualify for deduction under Section 80CCD(2) up to 10% of salary (Basic + DA), over and above Section 80C!'
            },
            {
              label: 'Employer Business Expense',
              desc: 'Corporate NPS can provide an additional retirement benefit through employer contributions deductible as business expense.'
            },
            {
              label: 'Both Tax Regimes',
              desc: 'Tax treatment depends on prevailing Income-tax provisions and is beneficial under both old and new regimes.'
            }
          ]
        },
        withdrawals: {
          title: 'Withdrawals and Exit',
          points: [
            {
              label: 'Tier I Core Account',
              desc: 'Core retirement account with restricted withdrawals governed by applicable PFRDA regulations.'
            },
            {
              label: 'Partial Withdrawals',
              desc: 'Partial withdrawals may be permitted for specified purposes, subject to conditions.'
            },
            {
              label: 'Tier II Voluntary Account',
              desc: 'Optional account with unrestricted anytime withdrawals.'
            },
            {
              label: 'Employment / Retirement Exit',
              desc: 'Exit treatment depends on the subscriber’s employment/retirement status and applicable NPS rules.'
            }
          ]
        },
        choices: {
          title: 'Scheme Choices',
          subCards: [
            {
              name: 'For Employees',
              tag: 'Subscriber Choice',
              items: [
                'Choose from available Pension Fund Managers.',
                'Select an investment approach and permitted asset allocation.',
                'Choose between Active Choice and applicable Auto/Lifecycle Choice options.'
              ]
            },
            {
              name: 'For Employers',
              tag: 'Corporate Structure',
              items: [
                'Employer can structure its NPS contribution policy.',
                'Employer and employee contribution structures can be customized according to the organisation’s policy.'
              ]
            }
          ]
        },
        tiers: {
          title: 'Tier I and Tier II Accounts',
          subCards: [
            {
              name: 'Tier I — Corporate Retirement Account',
              tag: 'Employer + Employee',
              items: [
                'Core retirement account receiving contributions from both employer and employee.',
                'Restricted withdrawals safeguarding long-term retirement security.',
                'Eligible for maximum combined tax deductions (80CCD(1), 80CCD(1B), 80CCD(2)).'
              ]
            },
            {
              name: 'Tier II — Voluntary Investment Account',
              tag: 'No Lock-in',
              items: [
                'Optional account for existing Tier I subscribers.',
                'No lock-in period with anytime liquidity.',
                'Generally no tax benefit on contributions or returns.'
              ]
            }
          ]
        },
        audience: {
          title: 'Who is it for?',
          targetList: [
            'Private-sector employees looking to reduce taxable salary income',
            'Employees whose employers offer corporate NPS benefit structuring',
            'Companies looking to provide an additional structured retirement benefit',
            'Employees seeking employer-supported retirement savings',
            'Organisations building structured employee benefits and retirement programs'
          ]
        }
      }
    },
    {
      id: 'government',
      name: 'Government NPS',
      subtitle: 'Central & State Government personnel',
      badge: 'Govt Sector',
      icon: faLandmark,
      pfrdaUrl: 'https://pfrda.org.in/en/schemes/national-pension-system/nps-for-central-government',
      sections: {
        tax: {
          title: 'Tax Benefits',
          points: [
            {
              label: 'Employee Contribution',
              desc: 'Mandatory employee contributions (10% of Basic + DA) qualify for applicable NPS tax deductions.'
            },
            {
              label: '14% Government Contribution',
              desc: 'For Central Government employees, employer/government contribution is currently 14% of Basic + DA into Tier I.'
            },
            {
              label: 'Section 80CCD(2) Exemption',
              desc: 'Government contribution is eligible for full tax exemption under Section 80CCD(2).'
            },
            {
              label: 'Exit Tax Provisions',
              desc: 'Applicable tax treatment depends on prevailing Income-tax provisions and superannuation exit rules.'
            }
          ]
        },
        withdrawals: {
          title: 'Withdrawals and Exit',
          points: [
            {
              label: 'Tier I Account',
              desc: 'Primary retirement account with withdrawals governed strictly by government-sector NPS rules.'
            },
            {
              label: 'Normal Superannuation Exit',
              desc: 'Normal retirement exit provides for a lump-sum component and annuity component according to applicable PFRDA rules.'
            },
            {
              label: 'Partial Withdrawals',
              desc: 'Partial withdrawals are permitted subject to prescribed government-sector conditions.'
            },
            {
              label: 'Tier II Account',
              desc: 'Provides flexible access to funds while Tier I remains active; on Tier I exit, Tier II is generally closed along with it.'
            }
          ]
        },
        choices: {
          title: 'Scheme Choices',
          points: [
            {
              label: 'Default Scheme',
              desc: 'Statutory default investment scheme managed by designated public sector PFMs.'
            },
            {
              label: 'G-100 Scheme',
              desc: '100% investment in Government Securities for complete sovereign capital preservation.'
            },
            {
              label: 'LC-25 (Conservative)',
              desc: 'Conservative Life Cycle option with a maximum of 25% equity exposure.'
            },
            {
              label: 'LC-50 (Moderate)',
              desc: 'Moderate Life Cycle option with up to 50% equity allocation.'
            }
          ]
        },
        tiers: {
          title: 'Tier I and Tier II Accounts',
          subCards: [
            {
              name: 'Tier I — Government Retirement Account',
              tag: 'Mandatory Sovereign Pension',
              items: [
                'Mandatory/core pension account for covered government employees.',
                'Employee (10%) and Government (14%) both contribute every month.',
                'Designed for long-term retirement accumulation under government regulations.'
              ]
            },
            {
              name: 'Tier II — Voluntary Account',
              tag: 'Liquidity & Tax Saver',
              items: [
                'Optional investment account providing greater liquidity than Tier I.',
                'Withdrawals can be made as permitted under the applicable rules.',
                'Central Government employees also have access to the Tier II Tax Saver Scheme (3-year lock-in).'
              ]
            }
          ]
        },
        audience: {
          title: 'Who is it for?',
          targetList: [
            'Central Government employees covered under NPS',
            'Eligible State Government employees covered under NPS',
            'Government employees looking for structured retirement savings',
            'Employees who benefit from both personal (10%) and government (14%) contributions',
            'Government-sector employees building a long-term retirement corpus'
          ]
        }
      }
    }
  ];

  const currentModel = models.find((m) => m.id === activeModelId) || models[0];
  const currentSection = currentModel.sections[activeTabKey] || currentModel.sections.tax;

  return (
    <section className="py-12 sm:py-16 bg-[#f8fafc] relative overflow-hidden border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-4"
          >
            <span className="text-[#032e92] text-xs font-bold tracking-widest uppercase">
              Compare NPS Schemes &amp; Frameworks
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto mb-3"
          >
            NPS Models <span className="text-[#032e92]">Explained in Detail</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Select an NPS model on the left, then toggle across tax benefits, exit rules, scheme choices, account tiers, and eligibility.
          </motion.p>
        </div>

        {/* The 2-Tier Master-Detail Layout matching User Sketch */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          {/* LEFT SIDEBAR: The 4 NPS Models */}
          <div className="lg:col-span-4 bg-gray-50/70 border-b lg:border-b-0 lg:border-r border-gray-200/80 p-4 sm:p-5 lg:p-6 flex flex-col">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Select NPS Model
              </span>
              <span className="text-[11px] font-semibold text-[#032e92] bg-blue-50 px-2.5 py-0.5 rounded-md">
                4 Schemes
              </span>
            </div>

            {/* Model Buttons Stack - Increased height & padding to eliminate empty whitespace */}
            <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-3.5">
              {models.map((model) => {
                const isActive = model.id === activeModelId;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setActiveModelId(model.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center justify-between cursor-pointer border ${
                      isActive
                        ? 'bg-[#032e92] text-white shadow-md border-[#032e92]'
                        : 'bg-white hover:bg-blue-50/50 text-gray-800 border-gray-200/70 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-[#eef5ff] text-[#032e92]'
                        }`}
                      >
                        <FontAwesomeIcon icon={model.icon} />
                      </div>
                      <div className="min-w-0 pr-1">
                        <div className="font-bold text-[15px] sm:text-base leading-snug">
                          {model.name}
                        </div>
                        <div
                          className={`text-xs mt-1 leading-relaxed ${
                            isActive ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {model.subtitle}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {model.badge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Sub-Tabs + Active Content Information */}
          <div className="lg:col-span-8 p-5 sm:p-7 lg:p-8 flex flex-col justify-between">
            <div>
              {/* TOP HORIZONTAL SUB-TABS (Wireframe: Tax Benefits | Withdraw Exit | Scheme Choices | Tier I & II | Who is it for?) */}
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                  const isTabActive = tab.key === activeTabKey;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTabKey(tab.key)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                        isTabActive
                          ? 'bg-[#032e92] text-white shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'
                      }`}
                    >
                      <FontAwesomeIcon icon={tab.icon} className="text-xs" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* CURRENT MODEL BADGE / HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-xs font-bold text-[#032e92] uppercase tracking-wider">
                    {currentModel.name}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    {currentSection.title}
                  </h3>
                </div>

                <a
                  href={currentModel.pfrdaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#032e92] hover:underline"
                  title="View official PFRDA regulatory details"
                >
                  <span>PFRDA Reference</span>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                </a>
              </div>

              {/* ACTIVE TAB CONTENT DISPLAY */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeModelId}-${activeTabKey}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Mode A: Standard Points Grid (Tax Benefits, Withdrawals, Scheme Choices) */}
                  {currentSection.points && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentSection.points.map((pt, idx) => (
                        <div
                          key={idx}
                          className="p-4 sm:p-5 rounded-xl bg-gray-50/70 border border-gray-100 hover:border-blue-200 transition-all"
                        >
                          <div className="flex items-center gap-2 text-sm font-bold text-[#032e92] mb-1.5">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs shrink-0" />
                            <span>{pt.label}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                            {pt.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mode B: Tier I and Tier II SubCards */}
                  {currentSection.subCards && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {currentSection.subCards.map((sc, scIdx) => (
                        <div
                          key={scIdx}
                          className="p-5 rounded-2xl bg-[#f8fafc] border border-blue-100 shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-sm sm:text-base text-gray-900">
                                {sc.name}
                              </h4>
                              <span className="text-[10px] font-bold text-[#032e92] bg-white px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                                {sc.tag || sc.badge}
                              </span>
                            </div>

                            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                              {sc.items.map((itemStr, iIdx) => (
                                <li key={iIdx} className="flex items-start gap-2">
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-emerald-500 text-xs mt-1 shrink-0"
                                  />
                                  <span className="leading-relaxed">{itemStr}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mode C: Who is it for? Checklist List */}
                  {currentSection.targetList && (
                    <div className="bg-gray-50/80 p-5 sm:p-6 rounded-2xl border border-gray-100">
                      <p className="text-xs sm:text-sm text-gray-500 mb-4 font-medium">
                        This model is primarily recommended for the following investor profiles:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentSection.targetList.map((target, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-xs"
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-emerald-500 text-xs mt-1 shrink-0"
                            />
                            <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                              {target}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Panel Action Footer */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                <span>Want to register or open an account under </span>
                <strong className="text-gray-900">{currentModel.name}</strong>?
              </div>

              <button
                type="button"
                onClick={() =>
                  openLeadModal({
                    title: `Start ${currentModel.name} Investment`,
                    defaultService: 'National Pension System (NPS)'
                  })
                }
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#032e92] hover:bg-[#022169] text-white transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Inquire About {currentModel.name}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
