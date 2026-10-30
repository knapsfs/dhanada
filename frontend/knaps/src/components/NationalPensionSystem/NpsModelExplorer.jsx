import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faChild,
  faBuilding,
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
  faHeart,
  faTable,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const AUTO_CHOICE_ALLOCATION_DATA = [
  { age: 'Up to 35 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 75%, C: 10%, G: 15%', lc50: 'E: 50%, C: 30%, G: 20%', lc25: 'E: 25%, C: 45%, G: 30%' },
  { age: '36 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 71%, C: 11%, G: 18%', lc50: 'E: 48%, C: 29%, G: 23%', lc25: 'E: 24%, C: 43%, G: 33%' },
  { age: '37 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 67%, C: 12%, G: 21%', lc50: 'E: 46%, C: 28%, G: 26%', lc25: 'E: 23%, C: 41%, G: 36%' },
  { age: '38 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 63%, C: 13%, G: 24%', lc50: 'E: 44%, C: 27%, G: 29%', lc25: 'E: 22%, C: 39%, G: 39%' },
  { age: '39 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 59%, C: 14%, G: 27%', lc50: 'E: 42%, C: 26%, G: 32%', lc25: 'E: 21%, C: 37%, G: 42%' },
  { age: '40 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 55%, C: 15%, G: 30%', lc50: 'E: 40%, C: 25%, G: 35%', lc25: 'E: 20%, C: 35%, G: 45%' },
  { age: '41 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 51%, C: 16%, G: 33%', lc50: 'E: 38%, C: 24%, G: 38%', lc25: 'E: 19%, C: 33%, G: 48%' },
  { age: '42 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 47%, C: 17%, G: 36%', lc50: 'E: 36%, C: 23%, G: 41%', lc25: 'E: 18%, C: 31%, G: 51%' },
  { age: '43 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 43%, C: 18%, G: 39%', lc50: 'E: 34%, C: 22%, G: 44%', lc25: 'E: 17%, C: 29%, G: 54%' },
  { age: '44 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 39%, C: 19%, G: 42%', lc50: 'E: 32%, C: 21%, G: 47%', lc25: 'E: 16%, C: 27%, G: 57%' },
  { age: '45 Years', aggressive: 'E: 50%, C: 30%, G: 20%', lc75: 'E: 35%, C: 20%, G: 45%', lc50: 'E: 30%, C: 20%, G: 50%', lc25: 'E: 15%, C: 25%, G: 60%' },
  { age: '46 Years', aggressive: 'E: 48%, C: 28%, G: 24%', lc75: 'E: 32%, C: 20%, G: 48%', lc50: 'E: 28%, C: 19%, G: 53%', lc25: 'E: 14%, C: 23%, G: 63%' },
  { age: '47 Years', aggressive: 'E: 46%, C: 26%, G: 28%', lc75: 'E: 29%, C: 20%, G: 51%', lc50: 'E: 26%, C: 18%, G: 56%', lc25: 'E: 13%, C: 21%, G: 66%' },
  { age: '48 Years', aggressive: 'E: 44%, C: 24%, G: 32%', lc75: 'E: 26%, C: 20%, G: 54%', lc50: 'E: 24%, C: 17%, G: 59%', lc25: 'E: 12%, C: 19%, G: 69%' },
  { age: '49 Years', aggressive: 'E: 42%, C: 22%, G: 36%', lc75: 'E: 23%, C: 20%, G: 57%', lc50: 'E: 22%, C: 16%, G: 62%', lc25: 'E: 11%, C: 17%, G: 72%' },
  { age: '50 Years', aggressive: 'E: 40%, C: 20%, G: 40%', lc75: 'E: 20%, C: 20%, G: 60%', lc50: 'E: 20%, C: 15%, G: 65%', lc25: 'E: 10%, C: 15%, G: 75%' },
  { age: '51 Years', aggressive: 'E: 39%, C: 18%, G: 43%', lc75: 'E: 19%, C: 18%, G: 63%', lc50: 'E: 18%, C: 14%, G: 68%', lc25: 'E: 9%, C: 13%, G: 78%' },
  { age: '52 Years', aggressive: 'E: 38%, C: 16%, G: 46%', lc75: 'E: 18%, C: 16%, G: 66%', lc50: 'E: 16%, C: 13%, G: 71%', lc25: 'E: 8%, C: 11%, G: 81%' },
  { age: '53 Years', aggressive: 'E: 37%, C: 14%, G: 49%', lc75: 'E: 17%, C: 14%, G: 69%', lc50: 'E: 14%, C: 12%, G: 74%', lc25: 'E: 7%, C: 9%, G: 84%' },
  { age: '54 Years', aggressive: 'E: 36%, C: 12%, G: 52%', lc75: 'E: 16%, C: 12%, G: 72%', lc50: 'E: 12%, C: 11%, G: 77%', lc25: 'E: 6%, C: 7%, G: 87%' },
  { age: '55 Years', aggressive: 'E: 35%, C: 10%, G: 55%', lc75: 'E: 15%, C: 10%, G: 75%', lc50: 'E: 10%, C: 10%, G: 80%', lc25: 'E: 5%, C: 5%, G: 90%' },
];

const parseAllocation = (str) => {
  if (!str) return { e: 0, c: 0, g: 0 };
  const eMatch = str.match(/E:\s*(\d+)%/);
  const cMatch = str.match(/C:\s*(\d+)%/);
  const gMatch = str.match(/G:\s*(\d+)%/);
  return {
    e: eMatch ? parseInt(eMatch[1], 10) : 0,
    c: cMatch ? parseInt(cMatch[1], 10) : 0,
    g: gMatch ? parseInt(gMatch[1], 10) : 0
  };
};

const STRATEGY_TABS = [
  { id: 'all', label: 'All Strategies', key: null, title: 'All 4 Life Cycle Strategies', desc: 'Comparative view of all PFRDA Life Cycle glide paths across age bands.' },
  { id: 'low', label: 'Low — LC 25 (5E/55Y)', key: 'lc25', title: 'Low — Life Cycle 25 (5E/55Y)', startEq: '25%', endEq: '5%', desc: 'Conservative glide path reducing equity from 25% down to 5%.' },
  { id: 'moderate', label: 'Moderate — LC 50 (10E/55Y)', key: 'lc50', title: 'Moderate — Life Cycle 50 (10E/55Y)', startEq: '50%', endEq: '10%', desc: 'Balanced glide path reducing equity from 50% down to 10%.' },
  { id: 'high', label: 'High — LC 75 (15E/55Y)', key: 'lc75', title: 'High — Life Cycle 75 (15E/55Y)', startEq: '75%', endEq: '15%', desc: 'Growth glide path reducing equity from 75% down to 15%.' },
  { id: 'aggressive', label: 'Aggressive — Life Cycle (35E/55Y)', key: 'aggressive', title: 'Aggressive — Life Cycle (35E/55Y)', startEq: '50%', endEq: '35%', desc: 'Aggressive equity glide path retaining 35% equity at age 55.' }
];

export default function NpsModelExplorer() {
  const { openLeadModal } = useLeadModal();

  const [activeModelId, setActiveModelId] = useState('all-citizen');
  const [activeTabKey, setActiveTabKey] = useState('audience');
  const [showAutoChoiceModal, setShowAutoChoiceModal] = useState(false);
  const [modalActiveStrategy, setModalActiveStrategy] = useState('all');
  const [modalDisplayMode, setModalDisplayMode] = useState('table');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAutoChoiceModal(false);
      }
    };
    if (showAutoChoiceModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showAutoChoiceModal]);

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

  const corporateTabs = [
    { key: 'audience', label: 'Who is it for?', icon: faUsers },
    { key: 'eligibility', label: 'Eligibility', icon: faCircleCheck },
    { key: 'benefits', label: 'Benefits', icon: faShieldHeart },
    { key: 'tax', label: 'Tax Benefits', icon: faReceipt },
  ];

  const activeTabs =
    activeModelId === 'vatsalya'
      ? vatsalyaTabs
      : activeModelId === 'corporate'
        ? corporateTabs
        : defaultTabs;

  const handleModelSelect = (modelId) => {
    setActiveModelId(modelId);
    const targetTabs =
      modelId === 'vatsalya'
        ? vatsalyaTabs
        : modelId === 'corporate'
          ? corporateTabs
          : defaultTabs;
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
          // title: 'Who is it for?',
          description: 'NPS is a voluntary retirement savings scheme for resident Indians, NRIs and OCIs above 18 years of age, who want to build a retirement corpus. An NPS account can be opened with a minimum contribution of ₹500 and ₹1,000 annually thereafter.',
          targetSubtitle: 'Best suited for:',
          targetList: [
            'Salaried professionals seeking structured retirement savings',
            'Self-employed & business owners planning for retirement',
            'Young investors starting early for long-term growth',
            'Indian citizens, NRIs & eligible OCIs aged 18–85'
          ]
        },
        tax: {
          // title: 'Tax-Free Exit',
          description:
            'At exit, the lump-sum amount withdrawn and the amount used to purchase an annuity are completely tax-free. Only the income received from the annuity is taxable.',
          eeeBenefit: {
            title: 'E-E-E Benefit',
            // subtitle: 'Triple Tax Exemption Framework',
            items: [
              {
                stage: 'Investment',
                label: 'Exemption on Investment',
                // desc: 'Eligible contributions qualify for deduction under Sec 80CCD(1) and additional Sec 80CCD(1B).'
              },
              {
                stage: 'Growth',
                label: 'Exemption during growth',
                // desc: 'Compounding capital gains and returns during the accumulation phase are exempt from annual tax.'
              },
              {
                stage: 'Withdrawals',
                label: 'Exemption at the time of withdrawals',
                // desc: 'Lump-sum corpus withdrawal (up to 60%) and annuity investment are 100% tax-free.'
              }
            ]
          }
        },
        withdrawals: {
          // title: 'Withdrawals & Exit',
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
          // title: 'Scheme Type',
          msf: {
            title: 'Multiple Scheme Framework (MSF)',
            badge: 'Multi Choice',
            summary:
              'Choose multiple schemes offered by one or more Pension Funds and allocate your investments across them, subject to applicable NPS rules.',
            actionText: 'View Asset Allocation Table'
          },
          commonSchemes: {
            title: 'Common Schemes (CS)',
            summary: 'Choose an investment approach for your NPS contributions.',
            activeChoice: {
              title: 'Active Choice — Custom Allocation',
              name: 'Active Choice',
              // badge: 'Custom Allocation',
              summary:
                'Choose your own asset allocation across Equity (E), Corporate Bonds (C), and Government Securities (G), subject to applicable limits. Equity allocation can be up to 75%.'
            },
            autoChoice: {
              title: 'Auto Choice — Age-Based Glide Path',
              name: 'Auto Choice',
              // badge: 'Age-Based Glide Path',
              summary:
                'Asset allocation is automatically adjusted according to age through a predefined Life Cycle Fund, generally reducing equity exposure over time.',
              lifecycleTitle: 'Auto Choice Life Cycle Options',
              options: [
                {
                  id: 'low',
                  name: 'Low',
                  desc: 'Life Cycle 25 (5E/55Y)',
                  fullText: 'Low — Life Cycle 25 (5E/55Y)'
                },
                {
                  id: 'moderate',
                  name: 'Moderate',
                  desc: 'Life Cycle 50 (10E/55Y)',
                  fullText: 'Moderate — Life Cycle 50 (10E/55Y)'
                },
                {
                  id: 'high',
                  name: 'High',
                  desc: 'Life Cycle 75 (15E/55Y)',
                  fullText: 'High — Life Cycle 75 (15E/55Y)'
                },
                {
                  id: 'aggressive',
                  name: 'Aggressive',
                  desc: 'Life Cycle (35E/55Y)',
                  fullText: 'Aggressive — Life Cycle (35E/55Y)'
                }
              ],
              // footerNote: 'Select any Life Cycle Fund to view its age-wise asset allocation chart.'
            }
          }
        },
        tiers: {
          // title: 'Tier I / Tier II',
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
                tier1: '₹500/-',
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
            'NPS Vatsalya is a long-term savings scheme for children (Indian Citizen, NRI, or OCI) under 18, where parents or guardians contribute in the child’s name to help build financial security from an early age. NPS Vatsalya account can be opened with ₹250 and ₹250 in each subsequent financial year. No maximum limit.',
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
          dualAudience: {
            employee: {
              title: 'For Employees',
              // badge: 'Age 18 - 85 Years',
              desc: 'Employees aged 18-85 years working in an organisation that has NPS can join the Corporate NPS scheme. It is available to Indian citizens, NRIs and OCIs, subject to KYC.'
            },
            employer: {
              title: 'For Employers',
              // badge: 'Companies & Corporates',
              desc: 'Companies can offer Corporate NPS to their employees as a retirement savings benefit.'
            }
          }
        },
        eligibility: {
          title: 'Eligibility Criteria',
          corporateEligibility: {
            employee: {
              title: 'For Employees',
              // badge: 'Individual Conditions',
              intro: 'A person can join the NPS Corporate Sector Model if they meet all of these conditions:',
              criteria: [
                { label: 'Age', value: '18 to 85 years' },
                { label: 'Citizenship', value: 'Indian citizens, NRIs and OCIs (Overseas Citizens of India)' },
                { label: 'Employment', value: 'Must be working with an organisation that has adopted NPS' },
                { label: 'KYC', value: 'KYC (Know Your Customer) must be completed' },
                { label: 'Registration', value: 'Registration must be done through the employer' }
              ]
            },
            company: {
              title: 'For Companies',
              // badge: 'Eligible Entities',
              intro: 'An organisation can adopt NPS Corporate Sector Model if it falls under any of these categories:',
              entities: [
                'Trusts and Societies',
                'Co-operative societies',
                'Partnership firms',
                'Proprietorships',
                'Government bodies or entities',
                'Limited Liability Partnerships',
                'International organisations operating in India',
                'Foreign diplomatic missions in India',
                'Companies registered under the Companies Act, 2013',
                'Eligible foreign companies with employees in India',
                'Public Sector Enterprises (PSEs) or Government companies'

              ]
            }
          }
        },
        benefits: {
          title: 'Benefits of Corporate NPS',
          corporateBenefits: {
            companies: {
              title: 'Benefits for Companies',
              // badge: 'Employer Advantage',
              items: [
                { title: 'Flexible contributions', desc: 'Employers can decide how much to contribute towards NPS.' },
                { title: 'Lower administrative work', desc: 'No need to manage a separate pension trust or record-keeping.' },
                { title: 'Tax benefits', desc: 'Eligible employer contributions can be claimed as a business expense.' },
                { title: 'Flexible investment management', desc: 'Employers can choose the investment option or let employees choose.' },
                { title: 'Works with existing benefits', desc: 'NPS can be offered along with PF and other retirement benefits.' },
                { title: 'Employee retirement benefit', desc: 'Provides an additional structured retirement benefit to employees.' }
              ]
            },
            employees: {
              title: 'Benefits for Employees',
              // badge: 'Employee Advantage',
              items: [
                { title: 'Low-cost retirement savings', desc: 'Build retirement savings at low fund management costs.' },
                { title: 'Investment choices', desc: 'Choose from different Pension Fund Managers and investment options.' },
                { title: 'Tax benefits', desc: 'Get eligible tax deductions on employee and employer contributions.' },
                { title: 'Easy online access', desc: 'Track NPS account, investments and fund performance online.' },
                { title: 'Flexible retirement options', desc: 'Continue investing and choose withdrawal or annuity options as per NPS rules.' },
                { title: 'Tier II option', desc: 'Invest additional money through an optional Tier II account with flexible withdrawals.' }
              ]
            }
          }
        },
        tax: {
          title: 'Tax Benefits',
          corporateTax: {
            employers: {
              title: 'For Employers',
              // badge: 'Section 36(1)(iv)(a)',
              description: 'Employer contributions to NPS (up to 14% of salary, i.e., Basic + DA) are treated as a business expense and can be claimed as a deduction under Section 36(1)(iv)(a) of the Income Tax Act, 1961.'
            },
            employees: {
              title: 'For Employees',
              // badge: 'Income Tax Act, 1961',
              subtitle: 'Attractive Tax Benefits under Income Tax Act, 1961:',
              sections: [
                {
                  section: 'Section 80CCD(1)',
                  title: 'Employee Contributions Deduction',
                  points: [
                    '10% of salary (Basic + DA) for salaried employees',
                    '20% of Gross Income for self-employed',
                    '(Subject to ₹1.5 lakh limit under Section 80CCE)'
                  ]
                },
                {
                  section: 'Section 80CCD(1B)',
                  title: 'Additional Tax Deduction',
                  points: [
                    'Additional tax deduction of ₹50,000 (over and above Section 80C)'
                  ]
                },
                {
                  section: 'Section 80CCD(2)',
                  title: 'Employer Contributions Deductible',
                  points: [
                    '10% of salary for employees under Old Tax Regime',
                    '14% of salary for employees under New Tax Regime'
                  ]
                }
              ]
            }
          }
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
          {/* <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-4"
          >
            <span className="text-[#032e92] text-xs font-bold tracking-widest uppercase">
              Compare NPS Schemes &amp; Frameworks
            </span>
          </motion.div> */}

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
            Explore NPS solutions designed for every stage of life - from your child’s future to your retirement, and after retirement.
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
            <div className="flex-1 flex flex-col justify-start gap-3 sm:gap-3.5">
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
              {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
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
              </div> */}

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
                    <div className="mb-5 p-1 text-gray-700 text-xs sm:text-sm md:text-[15px] leading-relaxed">
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

                  {/* Mode: Dual Audience Display (Corporate NPS Who is it for?) */}
                  {currentSection.dualAudience && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* For Employees Card */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:border-blue-200 hover:shadow-sm transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base">
                                <FontAwesomeIcon icon={faUserTie} />
                              </div>
                              <h4 className="font-bold text-base sm:text-lg text-gray-900">
                                {currentSection.dualAudience.employee.title}
                              </h4>
                            </div>
                            {/* <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-100 uppercase tracking-wider">
                              {currentSection.dualAudience.employee.badge}
                            </span> */}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-4">
                            {currentSection.dualAudience.employee.desc}
                          </p>
                        </div>

                        {/* <div className="pt-3.5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 font-medium">
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-50/80">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs shrink-0" />
                            <span>Age 18 to 85 Years</span>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-50/80">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs shrink-0" />
                            <span>Indian Citizens, NRIs & OCIs</span>
                          </div>
                        </div> */}
                      </div>

                      {/* For Employers Card */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:border-emerald-200 hover:shadow-sm transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                                <FontAwesomeIcon icon={faBuilding} />
                              </div>
                              <h4 className="font-bold text-base sm:text-lg text-gray-900">
                                {currentSection.dualAudience.employer.title}
                              </h4>
                            </div>
                            {/* <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                              {currentSection.dualAudience.employer.badge}
                            </span> */}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-4">
                            {currentSection.dualAudience.employer.desc}
                          </p>
                        </div>

                        {/* <div className="pt-3.5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 font-medium">
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-50/80">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs shrink-0" />
                            <span>Structured Retirement Benefit</span>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-50/80">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs shrink-0" />
                            <span>Business Expense Deduction</span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  )}

                  {/* Mode: Corporate NPS Eligibility Display */}
                  {currentSection.corporateEligibility && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      {/* For Employees (5 cols) */}
                      <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#032e92] flex items-center justify-center text-sm">
                                <FontAwesomeIcon icon={faUserTie} />
                              </div>
                              <h4 className="font-bold text-base sm:text-lg text-gray-900">
                                {currentSection.corporateEligibility.employee.title}
                              </h4>
                            </div>
                            {/* <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-100 uppercase tracking-wider">
                              {currentSection.corporateEligibility.employee.badge}
                            </span> */}
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed font-medium">
                            {currentSection.corporateEligibility.employee.intro}
                          </p>

                          <div className="space-y-2.5">
                            {currentSection.corporateEligibility.employee.criteria.map((crit, cIdx) => (
                              <div
                                key={cIdx}
                                className="p-1"
                              >
                                {/* <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs mt-1 shrink-0" /> */}
                                <div>
                                  <span className="font-bold text-xs sm:text-[13px] text-gray-900 mr-1.5">
                                    {crit.label}:
                                  </span>
                                  <span className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                                    {crit.value}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* For Companies (7 cols) */}
                      <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                                <FontAwesomeIcon icon={faBuilding} />
                              </div>
                              <h4 className="font-bold text-base sm:text-lg text-gray-900">
                                {currentSection.corporateEligibility.company.title}
                              </h4>
                            </div>
                            {/* <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                              {currentSection.corporateEligibility.company.badge}
                            </span> */}
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed font-medium">
                            {currentSection.corporateEligibility.company.intro}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentSection.corporateEligibility.company.entities.map((ent, eIdx) => (
                              <div
                                key={eIdx}
                                className="p-1"
                              >
                                {/* <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs mt-0.5 shrink-0" /> */}
                                <span className="text-xs text-gray-700 font-medium leading-snug">
                                  {ent}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Corporate NPS Benefits Display */}
                  {currentSection.corporateBenefits && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Benefits for Companies */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                                <FontAwesomeIcon icon={faBuilding} />
                              </div>
                              <h4 className="font-bold text-base sm:text-lg text-gray-900">
                                {currentSection.corporateBenefits.companies.title}
                              </h4>
                            </div>
                            {/* <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                              {currentSection.corporateBenefits.companies.badge}
                            </span> */}
                          </div>

                          <div className="space-y-3">
                            {currentSection.corporateBenefits.companies.items.map((b, bIdx) => (
                              <div
                                key={bIdx}
                                className="p-1"
                              >
                                {/* <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs mt-1 shrink-0" /> */}
                                <div>
                                  <span className="font-bold text-xs sm:text-sm text-gray-900 block mb-0.5">
                                    {b.title}
                                  </span>
                                  <span className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                                    {b.desc}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Benefits for Employees */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-sm">
                                <FontAwesomeIcon icon={faUserTie} />
                              </div>
                              <h4 className="font-bold text-base sm:text-lg text-gray-900">
                                {currentSection.corporateBenefits.employees.title}
                              </h4>
                            </div>
                            {/* <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-100 uppercase tracking-wider">
                              {currentSection.corporateBenefits.employees.badge}
                            </span> */}
                          </div>

                          <div className="space-y-3">
                            {currentSection.corporateBenefits.employees.items.map((b, bIdx) => (
                              <div
                                key={bIdx}
                                className="p-1"
                              >
                                {/* <FontAwesomeIcon icon={faCircleCheck} className="text-blue-500 text-xs mt-1 shrink-0" /> */}
                                <div>
                                  <span className="font-bold text-xs sm:text-sm text-gray-900 block mb-0.5">
                                    {b.title}
                                  </span>
                                  <span className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                                    {b.desc}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Corporate NPS Tax Benefits Display */}
                  {currentSection.corporateTax && (
                    <div className="space-y-5">
                      {/* For Employers Callout Card */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-blue-50/40 border border-emerald-200/90 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-emerald-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">
                              <FontAwesomeIcon icon={faBuilding} />
                            </div>
                            <h4 className="font-bold text-base sm:text-lg text-gray-900">
                              {currentSection.corporateTax.employers.title}
                            </h4>
                          </div>
                          {/* <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-2xs w-fit">
                            {currentSection.corporateTax.employers.badge}
                          </span> */}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                          {currentSection.corporateTax.employers.description}
                        </p>
                      </div>

                      {/* For Employees Section */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#032e92] flex items-center justify-center text-sm">
                              <FontAwesomeIcon icon={faUserTie} />
                            </div>
                            <h4 className="font-bold text-base sm:text-lg text-gray-900">
                              {currentSection.corporateTax.employees.title}
                            </h4>
                          </div>
                          {/* <span className="text-xs font-semibold text-[#032e92] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 w-fit">
                            {currentSection.corporateTax.employees.badge}
                          </span> */}
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-3.5 bg-[#032e92] rounded-full inline-block"></span>
                          <span>{currentSection.corporateTax.employees.subtitle}</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {currentSection.corporateTax.employees.sections.map((sec, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-4 sm:p-5 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-blue-200 transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="mb-2.5">
                                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#032e92] text-white">
                                    {sec.section}
                                  </span>
                                </div>
                                <h5 className="font-bold text-xs sm:text-sm text-gray-900 mb-2.5">
                                  {sec.title}
                                </h5>
                                <ul className="space-y-2 text-xs sm:text-[13px] text-gray-600">
                                  {sec.points.map((pt, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-2">
                                      {/* <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="text-emerald-500 text-xs mt-0.5 shrink-0"
                                      /> */}
                                      <span className="leading-relaxed">{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
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
                        {/* <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 w-fit">
                          {currentSection.eeeBenefit.subtitle}
                        </span> */}
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
                                {/* <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                  Exempt
                                </span> */}
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
                      {/* {currentSection.specifiedPurposes && (
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
                      )} */}
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

                          {/* 3 Step Options in Single Row with 'or' */}
                          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-1.5 mb-5">
                            {currentSection.vatsalyaWithdrawals.whenTurns18.steps.map((st, sIdx) => (
                              <React.Fragment key={st.id}>
                                <div className="p-3 sm:p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-blue-200 transition-colors flex flex-col justify-between flex-1 min-w-0 w-full sm:w-auto h-auto">
                                  <div className="mb-2">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border ${st.badgeStyle}`}
                                    >
                                      <span>{st.id}</span>
                                      <span>{st.name}</span>
                                    </span>
                                  </div>
                                  <p className="text-[11px] sm:text-xs text-gray-700 leading-snug font-medium">
                                    {st.desc}
                                  </p>
                                </div>
                                {sIdx < currentSection.vatsalyaWithdrawals.whenTurns18.steps.length - 1 && (
                                  <div className="flex items-center justify-center shrink-0 self-center -my-1 sm:my-0 -mx-0 sm:-mx-2 z-10">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-600 bg-white p-1 m-2 rounded-full border border-gray-200 shadow-2xs select-none">
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

                  {/* Mode: Scheme Type Framework (Multiple Scheme Framework MSF & Common Schemes CS) */}
                  {(currentSection.msf || currentSection.commonSchemes) && (
                    <div className="space-y-5">
                      {/* 1. Multiple Scheme Framework (MSF) */}
                      {currentSection.msf && (
                        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:border-blue-200 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <h4 className="font-bold text-base sm:text-lg text-gray-900">
                                {currentSection.msf.title}
                              </h4>
                              {/* <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                                {currentSection.msf.badge || 'Multi Choice'}
                              </span> */}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setModalActiveStrategy('all');
                                setModalDisplayMode('table');
                                setShowAutoChoiceModal(true);
                              }}
                              className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#032e92] text-white hover:bg-[#022169] shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
                            >
                              <FontAwesomeIcon icon={faTable} className="text-xs" />
                              <span>{currentSection.msf.actionText || 'View Asset Allocation Table'}</span>
                              <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-0.5" />
                            </button>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
                            {currentSection.msf.summary}
                          </p>
                        </div>
                      )}

                      {/* 2. Common Schemes (CS) */}
                      {currentSection.commonSchemes && (
                        <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-200/90 shadow-sm">
                          <div className="mb-4">
                            <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                              {currentSection.commonSchemes.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">
                              {currentSection.commonSchemes.summary}
                            </p>
                          </div>

                          {/* Active Choice & Auto Choice Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Active Choice Card */}
                            <div className="p-5 rounded-xl bg-white border border-gray-200/90 shadow-2xs hover:border-blue-200 transition-all flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-sm sm:text-base text-gray-900">
                                    {currentSection.commonSchemes.activeChoice.name}
                                  </span>
                                  {/* <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                                    {currentSection.commonSchemes.activeChoice.badge}
                                  </span> */}
                                </div>
                                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                                  {currentSection.commonSchemes.activeChoice.summary}
                                </p>
                              </div>
                            </div>

                            {/* Auto Choice Card */}
                            <div className="p-5 rounded-xl bg-white border border-gray-200/90 shadow-2xs hover:border-blue-200 transition-all flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-sm sm:text-base text-gray-900">
                                    {currentSection.commonSchemes.autoChoice.name}
                                  </span>
                                  {/* <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                                    {currentSection.commonSchemes.autoChoice.badge}
                                  </span> */}
                                </div>
                                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal mb-3.5">
                                  {currentSection.commonSchemes.autoChoice.summary}
                                </p>

                                {/* Auto Choice Life Cycle Options */}
                                <div className="pt-3 border-t border-gray-100">
                                  <div className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#032e92]"></span>
                                    <span>{currentSection.commonSchemes.autoChoice.lifecycleTitle}</span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                    {currentSection.commonSchemes.autoChoice.options.map((opt, oIdx) => (
                                      <button
                                        key={oIdx}
                                        type="button"
                                        onClick={() => {
                                          setModalActiveStrategy(opt.id);
                                          setModalDisplayMode('chart');
                                          setShowAutoChoiceModal(true);
                                        }}
                                        className="p-2.5 rounded-lg bg-gray-50 hover:bg-blue-50/60 border border-gray-200 hover:border-[#032e92] text-left transition-all cursor-pointer group/opt shadow-2xs flex items-center"
                                      >
                                        <div>
                                          <span className="text-xs font-bold text-gray-900 group-hover/opt:text-[#032e92] transition-colors block">
                                            {opt.name}
                                          </span>
                                          {/* <span className="text-[11px] text-gray-500 font-medium block">
                                            {opt.desc}
                                          </span> */}
                                        </div>
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px] text-gray-400 group-hover/opt:text-[#032e92] transition-colors shrink-0 ml-1.5" />
                                      </button>
                                    ))}
                                  </div>

                                  {/* Footer Note */}
                                  {/* <button
                                    type="button"
                                    onClick={() => {
                                      setModalActiveStrategy('all');
                                      setModalDisplayMode('chart');
                                      setShowAutoChoiceModal(true);
                                    }}
                                    className="w-full text-left inline-flex items-center gap-1.5 text-xs font-semibold text-[#032e92] hover:text-[#021d63] hover:underline cursor-pointer pt-1"
                                  >
                                    <span>{currentSection.commonSchemes.autoChoice.footerNote}</span>
                                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                            {/* <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-emerald-500 text-xs mt-1 shrink-0"
                            /> */}
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

      {/* Auto Choice Asset Allocation Modal */}
      <AnimatePresence>
        {showAutoChoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAutoChoiceModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#0a192f] via-[#032e92] to-[#0a192f] text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                      PFRDA Glide Path
                    </span>
                    <span className="text-xs text-blue-200 font-medium hidden sm:inline">• NPS Auto Choice</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                    Asset Allocation in Auto Choice
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAutoChoiceModal(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-lg" />
                </button>
              </div>

              {/* Filter Tabs & View Mode Switcher */}
              <div className="bg-[#f8fafc] px-4 sm:px-6 py-2.5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                {/* Strategy Filters */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-gray-500 font-semibold mr-1 hidden sm:inline">Strategy:</span>
                  {STRATEGY_TABS.map((tab) => {
                    const isActive = modalActiveStrategy === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setModalActiveStrategy(tab.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${isActive
                          ? 'bg-[#032e92] text-white shadow-2xs'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* View Mode Toggle (Table / Charts) */}
                <div className="flex items-center gap-1 bg-gray-200/80 p-1 rounded-xl self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setModalDisplayMode('table')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${modalDisplayMode === 'table'
                      ? 'bg-white text-[#032e92] shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <FontAwesomeIcon icon={faTable} className="text-[11px]" />
                    <span>Table View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalDisplayMode('chart')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${modalDisplayMode === 'chart'
                      ? 'bg-white text-[#032e92] shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <FontAwesomeIcon icon={faChartLine} className="text-[11px]" />
                    <span>Charts View</span>
                  </button>
                </div>
              </div>

              {/* Asset Classes Legend Bar */}
              <div className="bg-[#f0f5ff] px-5 py-2.5 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-semibold text-gray-700">
                  <span className="text-gray-500 font-medium">Asset Classes:</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span><strong className="text-blue-900">E:</strong> Equity</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span><strong className="text-amber-900">C:</strong> Corporate Debt</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span><strong className="text-emerald-900">G:</strong> Government Securities</span>
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium italic">
                  *Age-based automatic asset rebalancing (Glide Path)
                </span>
              </div>

              {/* Scrollable Content Area */}
              <div className="overflow-y-auto flex-1 p-3 sm:p-5">
                {modalDisplayMode === 'table' ? (
                  /* --- TABLE VIEW --- */
                  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[680px]">
                      <thead className="sticky top-0 bg-gray-100/95 backdrop-blur-xs text-gray-800 z-10 border-b border-gray-200">
                        <tr>
                          <th className="py-3 px-3 sm:px-4 font-bold text-gray-900 w-[16%]">Age</th>
                          <th
                            className={`py-3 px-3 sm:px-4 font-bold w-[21%] border-l border-gray-200 transition-colors ${modalActiveStrategy === 'aggressive'
                              ? 'bg-blue-100/80 text-[#032e92]'
                              : 'text-[#032e92]'
                              }`}
                          >
                            <div>Life Cycle – Aggressive</div>
                            <div className="text-[11px] font-normal text-gray-500">(35E/55Y)</div>
                          </th>
                          <th
                            className={`py-3 px-3 sm:px-4 font-bold w-[21%] border-l border-gray-200 transition-colors ${modalActiveStrategy === 'high'
                              ? 'bg-blue-100/80 text-[#032e92]'
                              : 'text-[#032e92]'
                              }`}
                          >
                            <div>Life Cycle 75 – High</div>
                            <div className="text-[11px] font-normal text-gray-500">(15E/55Y)</div>
                          </th>
                          <th
                            className={`py-3 px-3 sm:px-4 font-bold w-[21%] border-l border-gray-200 transition-colors ${modalActiveStrategy === 'moderate'
                              ? 'bg-blue-100/80 text-[#032e92]'
                              : 'text-[#032e92]'
                              }`}
                          >
                            <div>Life Cycle 50 – Moderate</div>
                            <div className="text-[11px] font-normal text-gray-500">(10E/55Y)</div>
                          </th>
                          <th
                            className={`py-3 px-3 sm:px-4 font-bold w-[21%] border-l border-gray-200 transition-colors ${modalActiveStrategy === 'low'
                              ? 'bg-blue-100/80 text-[#032e92]'
                              : 'text-[#032e92]'
                              }`}
                          >
                            <div>Life Cycle 25 – Low</div>
                            <div className="text-[11px] font-normal text-gray-500">(5E/55Y)</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {AUTO_CHOICE_ALLOCATION_DATA.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className={`hover:bg-blue-50/40 transition-colors ${rIdx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                              }`}
                          >
                            <td className="py-2.5 px-3 sm:px-4 font-bold text-gray-900 whitespace-nowrap">
                              {row.age}
                            </td>
                            <td
                              className={`py-2.5 px-3 sm:px-4 border-l border-gray-100 font-medium transition-colors ${modalActiveStrategy === 'aggressive'
                                ? 'bg-blue-50/80 font-bold text-[#032e92]'
                                : 'text-gray-700'
                                }`}
                            >
                              {row.aggressive}
                            </td>
                            <td
                              className={`py-2.5 px-3 sm:px-4 border-l border-gray-100 font-medium transition-colors ${modalActiveStrategy === 'high'
                                ? 'bg-blue-50/80 font-bold text-[#032e92]'
                                : 'text-gray-700'
                                }`}
                            >
                              {row.lc75}
                            </td>
                            <td
                              className={`py-2.5 px-3 sm:px-4 border-l border-gray-100 font-medium transition-colors ${modalActiveStrategy === 'moderate'
                                ? 'bg-blue-50/80 font-bold text-[#032e92]'
                                : 'text-gray-700'
                                }`}
                            >
                              {row.lc50}
                            </td>
                            <td
                              className={`py-2.5 px-3 sm:px-4 border-l border-gray-100 font-medium transition-colors ${modalActiveStrategy === 'low'
                                ? 'bg-blue-50/80 font-bold text-[#032e92]'
                                : 'text-gray-700'
                                }`}
                            >
                              {row.lc25}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* --- CHARTS VIEW --- */
                  <div className="space-y-6">
                    {/* Strategy Description Banner */}
                    {(() => {
                      const curTab = STRATEGY_TABS.find((t) => t.id === modalActiveStrategy) || STRATEGY_TABS[0];
                      return (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-sm sm:text-base text-[#032e92]">
                              {curTab.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {curTab.desc}
                            </p>
                          </div>
                          {curTab.startEq && (
                            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-xs">
                              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold">
                                Initial Equity: {curTab.startEq}
                              </span>
                              <span className="text-gray-400">➔</span>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                                At Age 55: {curTab.endEq}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Chart Glide Path Bars */}
                    {(() => {
                      const targetKey = modalActiveStrategy === 'all' ? 'lc75' : STRATEGY_TABS.find((t) => t.id === modalActiveStrategy)?.key || 'lc75';
                      const strategyLabel = STRATEGY_TABS.find((t) => t.key === targetKey)?.label || 'High (LC 75)';

                      return (
                        <div className="space-y-3">
                          {modalActiveStrategy === 'all' && (
                            <div className="text-xs text-gray-500 font-medium italic mb-2">
                              Displaying representative chart for <strong>{strategyLabel}</strong> (Use top filter buttons to view Low*, Moderate, or Aggressive charts).
                            </div>
                          )}

                          <div className="space-y-2">
                            {AUTO_CHOICE_ALLOCATION_DATA.map((row, rIdx) => {
                              const alloc = parseAllocation(row[targetKey]);
                              return (
                                <div
                                  key={rIdx}
                                  className="p-2 sm:p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/80 hover:border-blue-200 transition-colors flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                                >
                                  <div className="w-28 sm:w-32 shrink-0 font-bold text-xs text-gray-900">
                                    {row.age}
                                  </div>

                                  {/* Stacked Percentage Bar */}
                                  <div className="flex-1 flex h-6 rounded-lg overflow-hidden bg-gray-200 text-white text-[11px] font-bold shadow-2xs">
                                    {alloc.e > 0 && (
                                      <div
                                        style={{ width: `${alloc.e}%` }}
                                        className="bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center relative group/bar"
                                        title={`Equity: ${alloc.e}%`}
                                      >
                                        <span className="truncate px-1">E: {alloc.e}%</span>
                                      </div>
                                    )}
                                    {alloc.c > 0 && (
                                      <div
                                        style={{ width: `${alloc.c}%` }}
                                        className="bg-amber-500 hover:bg-amber-600 transition-all flex items-center justify-center relative group/bar"
                                        title={`Corporate Debt: ${alloc.c}%`}
                                      >
                                        <span className="truncate px-1">C: {alloc.c}%</span>
                                      </div>
                                    )}
                                    {alloc.g > 0 && (
                                      <div
                                        style={{ width: `${alloc.g}%` }}
                                        className="bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center relative group/bar"
                                        title={`Govt Securities: ${alloc.g}%`}
                                      >
                                        <span className="truncate px-1">G: {alloc.g}%</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Footnote Bar */}
              <div className="p-3.5 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] shrink-0"></span>
                  <span className="font-semibold text-gray-700">
                    The total allocation across all asset classes (E, C, G, and A) cannot exceed 100%.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAutoChoiceModal(false)}
                  className="self-end sm:self-auto px-4 py-1.5 bg-[#032e92] text-white rounded-lg text-xs font-semibold hover:bg-[#021d63] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
