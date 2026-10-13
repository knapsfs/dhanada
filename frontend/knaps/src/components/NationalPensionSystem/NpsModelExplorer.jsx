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
  faCircleCheck,
  faChartLine,
  faGraduationCap,
  faCoins,
  faPiggyBank,
  faArrowTrendUp,
  faShieldHeart,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function NpsModelExplorer() {
  const { openLeadModal } = useLeadModal();

  const [activeModelId, setActiveModelId] = useState('all-citizen');
  const [activeTabKey, setActiveTabKey] = useState('audience');

  const defaultTabs = [
    { key: 'audience', label: 'Who is it for?', icon: faUsers },
    { key: 'tax', label: 'Tax-Free Exit', icon: faReceipt },
    { key: 'withdrawals', label: 'Withdrawals & Exit', icon: faMoneyBillTransfer },
    { key: 'choices', label: 'Scheme Type', icon: faSliders },
    { key: 'tiers', label: 'Tier I / Tier II', icon: faLayerGroup },
  ];

  const vatsalyaTabs = [
    { key: 'audience', label: 'Who is it for?', icon: faUsers },
    { key: 'tax', label: 'Tax-Free Exit', icon: faReceipt },
    { key: 'withdrawals', label: 'Withdrawals & Exit', icon: faMoneyBillTransfer },
    { key: 'why-vatsalya', label: 'Why NPS Vatsalya', icon: faHeart },
  ];

  const activeTabs = activeModelId === 'vatsalya' ? vatsalyaTabs : defaultTabs;

  const handleModelSelect = (modelId) => {
    setActiveModelId(modelId);
    const targetTabs = modelId === 'vatsalya' ? vatsalyaTabs : defaultTabs;
    if (!targetTabs.some((t) => t.key === activeTabKey)) {
      setActiveTabKey(targetTabs[0].key);
    }
  };

  const models = [
    {
      id: 'all-citizen',
      name: 'All Citizen NPS',
      subtitle: 'For all Indian citizens (18-70 years)',
      badge: 'All Citizens',
      icon: faUserTie,
      pfrdaUrl: 'https://pfrda.org.in/en/schemes/national-pension-system/nps-for-all-citizen-models',
      sections: {
        audience: {
          title: 'Who is it for?',
          description:
            'NPS is a voluntary retirement savings scheme for resident Indians, NRIs and eligible PIOs above 18 years of age, who want to build a retirement corpus. An NPS account can be opened with a minimum contribution of ₹500 and ₹1,000 annually thereafter.',
          targetSubtitle: 'Best suited for:',
          targetList: [
            'Salaried professionals seeking structured retirement savings',
            'Self-employed & business owners planning for retirement',
            'Young investors starting early for long-term growth',
            'Indian citizens, NRIs & eligible OCIs aged 18–70'
          ]
        },
        tax: {
          title: 'Tax-Free Exit',
          description:
            'At exit, the lump-sum amount withdrawn and the amount used to purchase an annuity are completely tax-free. Only the income received from the annuity is taxable.',
          eeeBenefit: {
            title: 'E-E-E Benefit',
            subtitle: 'Triple Tax Exemption Framework',
            items: [
              {
                stage: 'Investment',
                label: 'Exemption on Investment',
                desc: 'Eligible contributions qualify for deduction under Sec 80CCD(1) and additional Sec 80CCD(1B).'
              },
              {
                stage: 'Growth',
                label: 'Exemption during growth',
                desc: 'Compounding capital gains and returns during the accumulation phase are exempt from annual tax.'
              },
              {
                stage: 'Withdrawals',
                label: 'Exemption at the time of withdrawals',
                desc: 'Lump-sum corpus withdrawal (up to 60%) and annuity investment are 100% tax-free.'
              }
            ]
          }
        },
        withdrawals: {
          title: 'Withdrawals & Exit',
          exitCards: [
            {
              type: 'normal',
              badge: 'Normal Exit',
              badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              accentColor: 'border-t-emerald-500',
              conditions: [
                'After 15 years, or',
                'At age 60, or',
                'Employment retirement age, or',
                'Defer exit till age 85'
              ],
              description: 'Withdraw up to 100%* of your retirement corpus.',
              footnote: '*if corpus less than Rs. 8 lakhs. Up to 80% if greater than 12 lakhs.'
            },
            {
              type: 'premature',
              badge: 'Premature Exit',
              badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200',
              accentColor: 'border-t-rose-500',
              conditions: [
                'After 5 years, before age 60'
              ],
              description:
                'Withdraw up to 20% of the corpus as lump sum/ Systematic Unit/ Lumpsum Withdrawl, with a minimum 80% used for annuity.'
            },
            {
              type: 'partial',
              badge: 'Partial Withdrawals',
              badgeStyle: 'bg-blue-100 text-[#032e92] border-blue-200',
              accentColor: 'border-t-[#032e92]',
              conditions: [
                'After 3 years, till age 60'
              ],
              description:
                'Up to 25% of investor contributions can be withdrawn up to 4 times, with a 4-year gap, for specified purposes.'
            }
          ],
          specifiedPurposes: {
            label: '...specified purposes like',
            items: [
              "child's education",
              "child's marriage",
              'buying a house',
              'medical treatment',
              'starting a business'
            ]
          }
        },
        choices: {
          title: 'Scheme Type',
          schemeFramework: {
            singleScheme: {
              title: 'Single Scheme Framework',
              summary: 'Choose one scheme for NPS investments.',
              details:
                'Subscribers can choose a single scheme or designated asset class with a selected Pension Fund Manager for complete streamlined investing.'
            },
            multiScheme: {
              title: 'Multi Scheme Framework',
              summary: 'Choose multiple schemes and divide the investment across them.',
              lifeCycle: {
                title: 'Life Cycle',
                summary: 'Asset allocation changes with age based on the selected investment strategy.',
                options: [
                  {
                    name: 'Active Choice',
                    badge: 'Custom Allocation',
                    summary:
                      'Decide the allocation across Equity, Bonds and Government Securities, with up to 100% allocation in any asset.'
                  },
                  {
                    name: 'Auto Choice',
                    badge: 'Age-based Glide Path',
                    summary:
                      'Asset allocation is automatically adjusted based on age, generally reducing equity exposure over time.'
                  }
                ]
              }
            }
          }
        },
        tiers: {
          title: 'Tier I / Tier II',
          table: {
            col1Header: 'Criteria',
            col2Header: 'Tier I (Retirement Account)',
            col3Header: 'Tier II (Voluntary Account)',
            rows: [
              {
                feature: 'What is it?',
                tier1: 'NPS retirement account',
                tier2: 'Optional account for additional investment'
              },
              {
                feature: 'Who can open?',
                tier1: 'Eligible NPS subscribers',
                tier2: 'Only with an active Tier I NPS account'
              },
              {
                feature: 'Min investment',
                tier1: '₹250/-',
                tier2: '₹1,000/-'
              },
              {
                feature: 'Withdrawals',
                tier1: 'Up to 25% of own contributions',
                tier2: 'No such restrictions. Withdraw anytime'
              },
              {
                feature: 'Tax on withdrawal',
                tier1: 'Tax-free lump-sum withdrawal',
                tier2: 'Taxable as per applicable tax rules'
              },
              {
                feature: 'Tax deductions',
                tier1: 'Available under applicable rules',
                tier2: 'No tax deductions available'
              },
              {
                feature: 'Best for',
                tier1: 'Retirement planning + tax benefits',
                tier2: 'Investing additional money with liquidity'
              }
            ]
          }
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
        audience: {
          title: 'Who is it for?',
          description:
            'NPS Vatsalya is a long-term savings scheme for children (Indian Citizen, NRI, or OCI) under 18, where parents or guardians contribute in the child’s name to help build financial security from an early age. NPS Vatsalya account can be opened with ₹250 and ₹1000 in each subsequent financial year. No maximum limit.',
          aashirwad: {
            title: 'Vatsalya Aashirwad',
            description:
              'Family, friends, and relatives can also contribute towards a child’s future through NPS Vatsalya.'
          }
        },
        tax: {
          title: 'Tax-Free Exit',
          description:
            'At exit, the lump-sum amount withdrawn and the amount used to purchase an annuity are completely tax-free. Only the income received from the annuity is taxable.'
        },
        withdrawals: {
          title: 'Withdrawals & Exit',
          vatsalyaWithdrawals: {
            whenTurns18: {
              title: 'When Child Turns 18',
              steps: [
                {
                  id: 1,
                  name: 'Continue',
                  badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  desc: 'Continue NPS Vatsalya till age 21'
                },
                {
                  id: 2,
                  name: 'Shift',
                  badgeStyle: 'bg-blue-100 text-[#032e92] border-blue-200',
                  desc: 'Shift to NPS Tier 1 anytime between age 18-21'
                },
                {
                  id: 3,
                  name: 'Exit',
                  badgeStyle: 'bg-purple-100 text-purple-800 border-purple-200',
                  desc: 'Exit with up to 80% lump sum + 20% annuity'
                }
              ],
              footerNotes: [
                'Full withdrawal if corpus is less than ₹8 lakhs',
                'Auto conversion to regular NPS if no action is taken till age 21.'
              ]
            },
            partialWithdrawal: {
              title: 'Partial Withdrawal',
              items: [
                {
                  label: 'After 3 years',
                  desc: 'You can withdraw up to 25% of your own contributions'
                },
                {
                  label: 'Upto 4 withdrawals',
                  desc: '2 times before 18 and 2 times between 18-21'
                },
                {
                  label: 'For specified needs',
                  desc: 'Child’s education, specified illnesses, or disability above 75%.'
                }
              ]
            }
          }
        },
        'why-vatsalya': {
          title: 'Why NPS Vatsalya',
          vatsalyaHighlights: [
            {
              icon: faChartLine,
              text: 'Compounding benefit over the long term',
              bgCircle: 'bg-[#fff4e5] text-[#b45309]'
            },
            {
              icon: faGraduationCap,
              text: 'Prepare for education and career goals',
              bgCircle: 'bg-[#e0edff] text-[#032e92]'
            },
            {
              icon: faCoins,
              text: 'Be ready for big future expenses',
              bgCircle: 'bg-[#e6f7ec] text-[#047857]'
            },
            {
              icon: faPiggyBank,
              text: 'Build saving habits from an early age',
              bgCircle: 'bg-[#f0e7ff] text-[#6d28d9]'
            },
            {
              icon: faArrowTrendUp,
              text: 'Market Linked Returns',
              bgCircle: 'bg-[#fff1f2] text-[#be123c]'
            },
            {
              icon: faShieldHeart,
              text: 'EEE tax benefit on contributions, growth and withdrawals',
              bgCircle: 'bg-[#e6f4ff] text-[#0284c7]'
            }
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
        audience: {
          title: 'Who is it for?',
          targetSubtitle: 'Recommended for:',
          targetList: [
            'Private-sector employees looking to reduce taxable salary income',
            'Employees whose employers offer corporate NPS benefit structuring',
            'Companies looking to provide an additional structured retirement benefit',
            'Employees seeking employer-supported retirement savings',
            'Organisations building structured employee benefits and retirement programs'
          ]
        },
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
        audience: {
          title: 'Who is it for?',
          targetSubtitle: 'Recommended for:',
          targetList: [
            'Central Government employees covered under NPS',
            'Eligible State Government employees covered under NPS',
            'Government employees looking for structured retirement savings',
            'Employees who benefit from both personal (10%) and government (14%) contributions',
            'Government-sector employees building a long-term retirement corpus'
          ]
        },
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
        }
      }
    }
  ];

  const currentModel = models.find((m) => m.id === activeModelId) || models[0];
  const currentSection = currentModel.sections[activeTabKey] || currentModel.sections.audience || currentModel.sections.tax;

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
            Pension <span className="text-[#032e92]">For All</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Explore NPS solutions designed for every stage of life - from your child’s future to your retirement.
          </motion.p>
        </div>

        {/* The 2-Tier Master-Detail Layout */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          {/* LEFT SIDEBAR: The 4 NPS Models */}
          <div className="lg:col-span-3 bg-gray-50/70 border-b lg:border-b-0 lg:border-r border-gray-200/80 p-4 sm:p-5 lg:p-6 flex flex-col">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Compare different NPS Schemes
              </span>
            </div>

            {/* Model Buttons Stack */}
            <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-3.5">
              {models.map((model) => {
                const isActive = model.id === activeModelId;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleModelSelect(model.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center justify-between cursor-pointer border ${isActive
                      ? 'bg-[#032e92] text-white shadow-md border-[#032e92]'
                      : 'bg-white hover:bg-blue-50/50 text-gray-800 border-gray-200/70 hover:border-blue-200'
                      }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 transition-colors ${isActive
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
                          className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-blue-100' : 'text-gray-500'
                            }`}
                        >
                          {model.subtitle}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Sub-Tabs + Active Content Information */}
          <div className="lg:col-span-9 p-5 sm:p-7 lg:p-8 flex flex-col justify-between">
            <div>
              {/* TOP HORIZONTAL SUB-TABS */}
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100 overflow-x-auto no-scrollbar">
                {activeTabs.map((tab) => {
                  const isTabActive = tab.key === activeTabKey;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTabKey(tab.key)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${isTabActive
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
                  {/* Top Section Description */}
                  {currentSection.description && (
                    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-blue-50/40 border border-blue-100/70 text-gray-700 text-xs sm:text-sm md:text-[15px] leading-relaxed shadow-xs">
                      <p>{currentSection.description}</p>
                    </div>
                  )}

                  {/* Vatsalya Aashirwad Callout (for NPS Vatsalya Who is it for?) */}
                  {currentSection.aashirwad && (
                    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-white border border-amber-200/80 shadow-xs">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                          {currentSection.aashirwad.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                        {currentSection.aashirwad.description}
                      </p>
                    </div>
                  )}

                  {/* Mode: E-E-E Benefit Display (All Citizen Tax-Free Exit) */}
                  {currentSection.eeeBenefit && (
                    <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/40 border border-emerald-100/90 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-100/70">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white tracking-wide uppercase">
                            Triple Exemption
                          </span>
                          <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                            {currentSection.eeeBenefit.title}
                          </h4>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 w-fit">
                          {currentSection.eeeBenefit.subtitle}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {currentSection.eeeBenefit.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-white border border-gray-100 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                  Stage 0{idx + 1}
                                </span>
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                  Exempt
                                </span>
                              </div>
                              <div className="font-bold text-xs sm:text-sm text-gray-900 mb-1.5">
                                {item.label}
                              </div>
                            </div>
                            {item.desc && (
                              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mode: Withdrawals & Exit 3-Cards Layout (All Citizen NPS) */}
                  {currentSection.exitCards && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentSection.exitCards.map((card, idx) => (
                          <div
                            key={idx}
                            className={`p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border-t-4 ${card.accentColor || 'border-t-[#032e92]'}`}
                          >
                            <div>
                              {/* Pill Badge Header */}
                              <div className="mb-4">
                                <span
                                  className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border tracking-wide ${card.badgeStyle || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                                >
                                  {card.badge}
                                </span>
                              </div>

                              {/* Conditions Bullets */}
                              <ul className="space-y-2 mb-4 text-xs sm:text-[13px] text-gray-700">
                                {card.conditions.map((cond, cIdx) => (
                                  <li key={cIdx} className="flex items-start gap-2">
                                    <span className="text-gray-400 font-bold leading-none mt-1">•</span>
                                    <span className="leading-snug">{cond}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed">
                                {card.description}
                              </p>
                              {card.footnote && (
                                <p className="mt-2 text-[11px] text-gray-500 leading-snug italic">
                                  {card.footnote}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Specified Purposes Footer */}
                      {currentSection.specifiedPurposes && (
                        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gray-50/90 border border-gray-200/80">
                          <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2.5">
                            {currentSection.specifiedPurposes.label}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {currentSection.specifiedPurposes.items.map((purpose, pIdx) => (
                              <span
                                key={pIdx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-800 shadow-xs"
                              >
                                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-[10px]" />
                                <span>{purpose}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode: NPS Vatsalya Withdrawals & Exit Layout (When Child Turns 18 + Partial Withdrawal) */}
                  {currentSection.vatsalyaWithdrawals && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      {/* Left: When Child Turns 18 (7 cols) */}
                      <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white border border-blue-200/90 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="mb-4">
                            <span className="text-base sm:text-lg font-bold text-gray-900">
                              {currentSection.vatsalyaWithdrawals.whenTurns18.title}
                            </span>
                          </div>

                          {/* 3 Step Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2 items-center mb-5">
                            {currentSection.vatsalyaWithdrawals.whenTurns18.steps.map((st, sIdx) => (
                              <React.Fragment key={st.id}>
                                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex flex-col justify-between h-full">
                                  <div className="mb-2">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${st.badgeStyle}`}
                                    >
                                      <span>{st.id}</span>
                                      <span>{st.name}</span>
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700 leading-snug font-medium">
                                    {st.desc}
                                  </p>
                                </div>
                                {sIdx < currentSection.vatsalyaWithdrawals.whenTurns18.steps.length - 1 && (
                                  <div className="hidden sm:flex justify-center -mx-3 z-10">
                                    <span className="text-[11px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-200">
                                      or
                                    </span>
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Footnotes */}
                        <div className="pt-3.5 border-t border-gray-100 space-y-1.5">
                          {currentSection.vatsalyaWithdrawals.whenTurns18.footerNotes.map((note, nIdx) => (
                            <div key={nIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-gray-600">
                              <span className="text-gray-400 font-bold leading-none mt-1">•</span>
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Partial Withdrawal (5 cols) */}
                      <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#fff7ed] to-[#fffaf5] border border-amber-200/90 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="mb-4">
                            <span className="text-base sm:text-lg font-bold text-amber-900">
                              {currentSection.vatsalyaWithdrawals.partialWithdrawal.title}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {currentSection.vatsalyaWithdrawals.partialWithdrawal.items.map((it, itIdx) => (
                              <div key={itIdx} className="p-3.5 rounded-xl bg-white/95 border border-amber-100 shadow-2xs">
                                <div className="font-bold text-xs sm:text-sm text-gray-900 mb-0.5">
                                  {it.label}
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                                  {it.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Why NPS Vatsalya (6 Feature Circular Cards) */}
                  {currentSection.vatsalyaHighlights && (
                    <div className="p-5 sm:p-7 rounded-2xl bg-white border border-gray-200/90 shadow-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                        {currentSection.vatsalyaHighlights.map((hl, hlIdx) => (
                          <div
                            key={hlIdx}
                            className="flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl bg-gray-50/70 hover:bg-blue-50/30 border border-gray-100 hover:border-blue-100 transition-all group"
                          >
                            <div
                              className={`w-13 h-13 rounded-full flex items-center justify-center text-lg mb-3 shadow-2xs group-hover:scale-105 transition-transform ${hl.bgCircle}`}
                            >
                              <FontAwesomeIcon icon={hl.icon} />
                            </div>
                            <p className="text-xs sm:text-[13px] font-semibold text-gray-800 leading-snug">
                              {hl.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mode: Tier I / Tier II Comparison Table */}
                  {currentSection.table && (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/90 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                              <th className="py-3.5 px-4 sm:px-5 font-bold text-gray-600 w-1/4">
                                {currentSection.table.col1Header || ''}
                              </th>
                              <th className="py-3.5 px-4 sm:px-5 font-bold text-[#032e92] w-[37.5%] border-l border-gray-200/80">
                                {currentSection.table.col2Header}
                              </th>
                              <th className="py-3.5 px-4 sm:px-5 font-bold text-[#032e92] w-[37.5%] border-l border-gray-200/80">
                                {currentSection.table.col3Header}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                            {currentSection.table.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={`hover:bg-blue-50/30 transition-colors ${rIdx % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'}`}
                              >
                                <td className="py-3 px-4 sm:px-5 font-semibold text-gray-900 align-top">
                                  {row.feature}
                                </td>
                                <td className="py-3 px-4 sm:px-5 text-gray-700 border-l border-gray-100 align-top leading-relaxed font-normal">
                                  {row.tier1}
                                </td>
                                <td className="py-3 px-4 sm:px-5 text-gray-700 border-l border-gray-100 align-top leading-relaxed font-normal">
                                  {row.tier2}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Mode: Scheme Type Framework (Single Scheme & Multi Scheme Framework with Life Cycle) */}
                  {currentSection.schemeFramework && (
                    <div className="space-y-4">
                      {/* 1. Single Scheme Framework */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:border-blue-200 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-base sm:text-lg text-gray-900">
                            {currentSection.schemeFramework.singleScheme.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-100 uppercase tracking-wider">
                            Single Choice
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 font-medium mb-1">
                          {currentSection.schemeFramework.singleScheme.summary}
                        </p>
                        {currentSection.schemeFramework.singleScheme.details && (
                          <p className="text-xs text-gray-500 leading-relaxed font-normal">
                            {currentSection.schemeFramework.singleScheme.details}
                          </p>
                        )}
                      </div>

                      {/* 2. Multi Scheme Framework */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-200/90 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-base sm:text-lg text-gray-900">
                            {currentSection.schemeFramework.multiScheme.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                            Multi Choice
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 font-medium mb-4">
                          {currentSection.schemeFramework.multiScheme.summary}
                        </p>

                        {/* Nested Life Cycle */}
                        {currentSection.schemeFramework.multiScheme.lifeCycle && (
                          <div className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
                            <div className="mb-4">
                              <div className="font-bold text-sm sm:text-base text-gray-900 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                                <span>{currentSection.schemeFramework.multiScheme.lifeCycle.title}:</span>
                                <span className="font-normal text-xs sm:text-sm text-gray-600">
                                  {currentSection.schemeFramework.multiScheme.lifeCycle.summary}
                                </span>
                              </div>
                            </div>

                            {/* Active Choice & Auto Choice */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pl-3 sm:pl-4 border-l-2 border-blue-200">
                              {currentSection.schemeFramework.multiScheme.lifeCycle.options.map((opt, optIdx) => (
                                <div
                                  key={optIdx}
                                  className="p-4 rounded-xl bg-gray-50/60 border border-gray-100 hover:border-blue-200 transition-all flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="font-bold text-xs sm:text-sm text-gray-900">
                                        {opt.name}
                                      </span>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#032e92] border border-blue-100">
                                        {opt.badge}
                                      </span>
                                    </div>
                                    <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                                      {opt.summary}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mode A: Standard Points Grid */}
                  {currentSection.points && !currentSection.exitCards && !currentSection.vatsalyaWithdrawals && (
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

                  {/* Mode B: Tier I and Tier II SubCards (Fallback for Corporate / Govt) */}
                  {currentSection.subCards && !currentSection.table && (
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
                      <p className="text-xs sm:text-sm text-gray-900 mb-4 font-bold flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-[#032e92] rounded-full inline-block"></span>
                        <span>{currentSection.targetSubtitle || 'This model is primarily recommended for the following investor profiles:'}</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentSection.targetList.map((target, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-gray-100 shadow-xs hover:border-blue-200 transition-all"
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
