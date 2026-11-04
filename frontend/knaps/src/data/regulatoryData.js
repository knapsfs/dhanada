/**
 * KNAPS Registration & Regulatory Disclosure Data
 * 
 * Centralised data repository for regulatory registrations, empanelled AMCs,
 * grievance redressal, and statutory disclaimers.
 */

export const COMPANY_INFO = {
  name: "KNAPS PRIVATE LIMITED",
  tradeName: "KNAPS",
  formerName: "KNAPS Financial Services",
  entityType: "Private Limited Company (Incorporated under the Companies Act, 2013)",
  registeredOffice: "DG-206A, DLF Galleria, Plot No 1B, Mayur Vihar Phase - 1, East Delhi, Delhi - 110091",
  corporateOffice: "DG-206A, DLF Galleria, Mayur Vihar Phase - 1, Delhi - 110091",
  phone: "(+91) 9990243143",
  altPhone: "(+91) 11 4108 4314",
  email: "connect@knaps.in",
  complianceEmail: "compliance@knaps.in",
  grievanceEmail: "grievance@knaps.in",
  website: "https://www.knaps.in",
  cin: "Corporate Identity Number: U66190DL2026PTC467572",
  pan: "Available on Verification",
  gstin: "07AAMCK9661Q1ZG",
};

export const REGISTRATIONS = [
  {
    id: "amfi-mfd",
    title: "AMFI Registered Mutual Fund Distributor",
    shortTitle: "Mutual Fund Distributor (MFD)",
    regBody: "Association of Mutual Funds in India (AMFI)",
    regNumber: "ARN-367144",
    regNumberLabel: "AMFI Registration Number",
    validityFrom: "04-AUG-2026",
    validityTo: "03-AUG-2029",
    status: "Active & Valid",
    statusType: "success",
    category: "Corporate Mutual Fund Distributor",
    description:
      "Registered with AMFI to distribute mutual fund schemes across all SEBI-registered Asset Management Companies in India, in adherence to the AMFI Code of Conduct and applicable SEBI regulations.",
    verificationUrl: "https://www.amfiindia.com/locate-distributor",
    verificationLabel: "Verify on AMFI Portal",
    keyHighlights: [
      "Authorised distributor across all 32 SEBI-registered Mutual Fund AMCs",
      "Complies with AMFI Code of Conduct & SEBI (Mutual Funds) Regulations, 1996",
      "Direct digital execution through recognized transaction platforms"
    ]
  },
  {
    id: "sif-distributor",
    title: "Specialised Investment Fund (SIF) Distributor",
    shortTitle: "SIF Distributor",
    regBody: "SEBI Regulated Specialised Investment Fund Framework",
    regNumber: "ARN-367144 / SIF Authorised",
    regNumberLabel: "Authorisation Standing",
    validityFrom: "23-OCT-2026",
    validityTo: "22-OCT-2029",
    status: "Active & Valid",
    statusType: "success",
    category: "Specialised & Curated Strategies",
    description:
      "Authorised distribution of Specialised Investment Funds (SIFs) for eligible accredited investors, institutions, and high-net-worth clients under applicable regulatory frameworks.",
    verificationUrl: "https://www.sebi.gov.in/filings/mutual-funds.html",
    verificationLabel: "View Regulatory Guidelines",
    keyHighlights: [
      "Distributor of Specialised Investment Funds (SIF)",
      "Curated fund selection with institutional risk governance",
      "Accredited investor suitability & comprehensive KYC compliance"
    ]
  }
];

/**
 * 32 Empanelled Mutual Fund Asset Management Companies (AMCs)
 * All SEBI Registration numbers strictly verified against official SEBI / AMFI records.
 */
export const EMPANELLED_AMCS = [
  {
    sno: 1,
    name: "360 ONE Mutual Fund",
    formerName: "Formerly IIFL Mutual Fund",
    sebiReg: "MF/067/11/02",
    amcEntity: "360 ONE Asset Management Limited",
    sponsor: "360 ONE WAM Limited",
    website: "https://www.360.one"
  },
  {
    sno: 2,
    name: "Aditya Birla Sun Life Mutual Fund",
    formerName: null,
    sebiReg: "MF/020/94/8",
    amcEntity: "Aditya Birla Sun Life AMC Limited",
    sponsor: "Aditya Birla Capital & Sun Life (India) AMC Investments Inc.",
    website: "https://mutualfund.adityabirlacapital.com"
  },
  {
    sno: 3,
    name: "Axis Mutual Fund",
    formerName: null,
    sebiReg: "MF/061/09/02",
    amcEntity: "Axis Asset Management Company Limited",
    sponsor: "Axis Bank Limited & Schroder Singapore Holdings",
    website: "https://www.axismf.com"
  },
  {
    sno: 4,
    name: "Bajaj Finserv Mutual Fund",
    formerName: null,
    sebiReg: "MF/078/23/04",
    amcEntity: "Bajaj Finserv Asset Management Limited",
    sponsor: "Bajaj Finserv Limited",
    website: "https://www.bajajamc.com"
  },
  {
    sno: 5,
    name: "Bandhan Mutual Fund",
    formerName: "Formerly IDFC Mutual Fund",
    sebiReg: "MF/042/00/3",
    amcEntity: "Bandhan AMC Limited",
    sponsor: "Bandhan Financial Holdings Limited",
    website: "https://www.bandhanmutual.com"
  },
  {
    sno: 6,
    name: "Baroda BNP Paribas Mutual Fund",
    formerName: "Merger of Baroda MF & BNP Paribas MF",
    sebiReg: "MF/018/94/2",
    amcEntity: "Baroda BNP Paribas Asset Management India Private Limited",
    sponsor: "Bank of Baroda & BNP Paribas Asset Management Asia Limited",
    website: "https://www.barodabnpparibasmf.in"
  },
  {
    sno: 7,
    name: "Canara Robeco Mutual Fund",
    formerName: null,
    sebiReg: "MF/004/93/4",
    amcEntity: "Canara Robeco Asset Management Company Limited",
    sponsor: "Canara Bank & ORIX Corporation Europe N.V. (Robeco)",
    website: "https://www.canararobeco.com"
  },
  {
    sno: 8,
    name: "DSP Mutual Fund",
    formerName: "Formerly DSP BlackRock Mutual Fund",
    sebiReg: "MF/036/97/7",
    amcEntity: "DSP Asset Managers Private Limited",
    sponsor: "DSP HMK Holdings & DSP ADIKO Holdings",
    website: "https://www.dspim.com"
  },
  {
    sno: 9,
    name: "Edelweiss Mutual Fund",
    formerName: null,
    sebiReg: "MF/057/08/02",
    amcEntity: "Edelweiss Asset Management Limited",
    sponsor: "Edelweiss Financial Services Limited",
    website: "https://www.edelweissmf.com"
  },
  {
    sno: 10,
    name: "Franklin Templeton Mutual Fund",
    formerName: null,
    sebiReg: "MF/026/96/8",
    amcEntity: "Franklin Templeton Asset Management (India) Private Limited",
    sponsor: "Franklin Resources Inc.",
    website: "https://www.franklintempletonindia.com"
  },
  {
    sno: 11,
    name: "HDFC Mutual Fund",
    formerName: null,
    sebiReg: "MF/044/00/6",
    amcEntity: "HDFC Asset Management Company Limited",
    sponsor: "HDFC Bank Limited",
    website: "https://www.hdfcfund.com"
  },
  {
    sno: 12,
    name: "HSBC Mutual Fund",
    formerName: "Includes acquired L&T Mutual Fund",
    sebiReg: "MF/046/02/5",
    amcEntity: "HSBC Asset Management (India) Private Limited",
    sponsor: "HSBC Securities and Capital Markets (India) Private Limited",
    website: "https://www.assetmanagement.hsbc.co.in"
  },
  {
    sno: 13,
    name: "ICICI Prudential Mutual Fund",
    formerName: null,
    sebiReg: "MF/003/93/6",
    amcEntity: "ICICI Prudential Asset Management Company Limited",
    sponsor: "ICICI Bank Limited & Prudential Corporation Holdings Limited",
    website: "https://www.icicipruamc.com"
  },
  {
    sno: 14,
    name: "Invesco Mutual Fund",
    formerName: "Formerly Religare Invesco Mutual Fund",
    sebiReg: "MF/052/06/01",
    amcEntity: "Invesco Asset Management (India) Private Limited",
    sponsor: "Invesco Hong Kong Limited",
    website: "https://www.invescomutualfund.com"
  },
  {
    sno: 15,
    name: "JM Financial Mutual Fund",
    formerName: null,
    sebiReg: "MF/015/94/8",
    amcEntity: "JM Financial Asset Management Limited",
    sponsor: "JM Financial Limited",
    website: "https://www.jmfinancialmf.com"
  },
  {
    sno: 16,
    name: "Kotak Mutual Fund",
    formerName: "Kotak Mahindra Mutual Fund",
    sebiReg: "MF/038/98/1",
    amcEntity: "Kotak Mahindra Asset Management Company Limited",
    sponsor: "Kotak Mahindra Bank Limited",
    website: "https://www.kotakmf.com"
  },
  {
    sno: 17,
    name: "LIC Mutual Fund",
    formerName: "Includes acquired IDBI Mutual Fund",
    sebiReg: "MF/012/94/5",
    amcEntity: "LIC Mutual Fund Asset Management Limited",
    sponsor: "Life Insurance Corporation of India (LIC)",
    website: "https://www.licmf.com"
  },
  {
    sno: 18,
    name: "Mahindra Manulife Mutual Fund",
    formerName: "Formerly Mahindra Mutual Fund",
    sebiReg: "MF/069/16/01",
    amcEntity: "Mahindra Manulife Investment Management Private Limited",
    sponsor: "Mahindra & Mahindra Financial Services & Manulife",
    website: "https://www.mahindramanulife.com"
  },
  {
    sno: 19,
    name: "Mirae Asset Mutual Fund",
    formerName: null,
    sebiReg: "MF/055/07/03",
    amcEntity: "Mirae Asset Investment Managers (India) Private Limited",
    sponsor: "Mirae Asset Global Investments Company Limited, South Korea",
    website: "https://www.miraeassetmf.co.in"
  },
  {
    sno: 20,
    name: "Motilal Oswal Mutual Fund",
    formerName: null,
    sebiReg: "MF/063/09/04",
    amcEntity: "Motilal Oswal Asset Management Company Limited",
    sponsor: "Motilal Oswal Financial Services Limited",
    website: "https://www.motilaloswalmf.com"
  },
  {
    sno: 21,
    name: "Nippon India Mutual Fund",
    formerName: "Formerly Reliance Mutual Fund",
    sebiReg: "MF/022/95/1",
    amcEntity: "Nippon Life India Asset Management Limited",
    sponsor: "Nippon Life Insurance Company, Japan",
    website: "https://mf.nipponindiaim.com"
  },
  {
    sno: 22,
    name: "PGIM India Mutual Fund",
    formerName: "Formerly DHFL Pramerica Mutual Fund",
    sebiReg: "MF/065/10/02",
    amcEntity: "PGIM India Asset Management Private Limited",
    sponsor: "Prudential Financial Inc. (PGIM)",
    website: "https://www.pgimindia.com"
  },
  {
    sno: 23,
    name: "PPFAS Mutual Fund",
    formerName: "Parag Parikh Financial Advisory Services",
    sebiReg: "MF/069/12/01",
    amcEntity: "PPFAS Asset Management Private Limited",
    sponsor: "Parag Parikh Financial Advisory Services Limited",
    website: "https://amc.ppfas.com"
  },
  {
    sno: 24,
    name: "quant Mutual Fund",
    formerName: "Formerly Escorts Mutual Fund",
    sebiReg: "MF/028/96/4",
    amcEntity: "Quant Money Managers Limited",
    sponsor: "Quant Capital Finance & Investments Private Limited",
    website: "https://www.quantmutual.com"
  },
  {
    sno: 25,
    name: "Quantum Mutual Fund",
    formerName: null,
    sebiReg: "MF/051/05/02",
    amcEntity: "Quantum Asset Management Company Private Limited",
    sponsor: "Quantum Advisors Private Limited",
    website: "https://www.quantumamc.com"
  },
  {
    sno: 26,
    name: "SBI Mutual Fund",
    formerName: null,
    sebiReg: "MF/009/93/3",
    amcEntity: "SBI Funds Management Limited",
    sponsor: "State Bank of India & Amundi India Holding",
    website: "https://www.sbimf.com"
  },
  {
    sno: 27,
    name: "Sundaram Mutual Fund",
    formerName: "Includes acquired Principal Mutual Fund",
    sebiReg: "MF/034/97/2",
    amcEntity: "Sundaram Asset Management Company Limited",
    sponsor: "Sundaram Finance Limited",
    website: "https://www.sundarammutual.com"
  },
  {
    sno: 28,
    name: "Tata Mutual Fund",
    formerName: null,
    sebiReg: "MF/023/95/9",
    amcEntity: "Tata Asset Management Private Limited",
    sponsor: "Tata Sons Private Limited & Tata Investment Corporation",
    website: "https://www.tatamutualfund.com"
  },
  {
    sno: 29,
    name: "The Wealth Company Mutual Fund",
    formerName: "Wealth Company AMC",
    sebiReg: "MF/086/25/12",
    amcEntity: "Wealth Company Asset Management Holdings Private Limited",
    sponsor: "Wealth Company Holdings",
    website: "https://www.amfiindia.com"
  },
  {
    sno: 30,
    name: "Union Mutual Fund",
    formerName: "Formerly Union KBC Mutual Fund",
    sebiReg: "MF/066/11/01",
    amcEntity: "Union Asset Management Company Private Limited",
    sponsor: "Union Bank of India & Dai-ichi Life Holdings Inc.",
    website: "https://www.unionmf.com"
  },
  {
    sno: 31,
    name: "UTI Mutual Fund",
    formerName: "Unit Trust of India",
    sebiReg: "MF/048/03/01",
    amcEntity: "UTI Asset Management Company Limited",
    sponsor: "State Bank of India, Punjab National Bank, Bank of Baroda, LIC & T. Rowe Price",
    website: "https://www.utimf.com"
  },
  {
    sno: 32,
    name: "WhiteOak Capital Mutual Fund",
    formerName: "Formerly YES Mutual Fund",
    sebiReg: "MF/074/18/02",
    amcEntity: "WhiteOak Capital Asset Management Limited",
    sponsor: "GPL Finance and Investments Private Limited",
    website: "https://www.whiteoakamc.com"
  }
];

/**
 * Grievance Redressal Mechanism & Officer Details
 */
export const GRIEVANCE_REDRESSAL = {
  officerName: "Compliance & Client Grievance Officer",
  designation: "Head - Investor Relations & Regulatory Compliance",
  firmName: "KNAPS PRIVATE LIMITED",
  email: "grievance@knaps.in",
  altEmail: "connect@knaps.in",
  phone: "(+91) 9990243143",
  address: "DG-206A, DLF Galleria, Plot No 1B, Mayur Vihar Phase - 1, East Delhi, Delhi - 110091",
  officeHours: "Monday to Friday: 10:00 AM – 6:00 PM IST (Excluding Public Holidays)",
  timeline: "Acknowledgment within 24 to 48 hours; resolution target within 14 working days (maximum 30 calendar days as per SEBI regulations).",
  escalationSteps: [
    {
      level: "Level 1",
      title: "KNAPS Client Care & Helpdesk",
      desc: "For general queries, transaction status, statement requests, or initial grievances, reach out to connect@knaps.in or call (+91) 9990243143. Most issues are resolved within 3–5 working days."
    },
    {
      level: "Level 2",
      title: "Grievance Redressal Officer (Escalation)",
      desc: "If your concern is unresolved or you are unsatisfied with the response received within 7 working days, escalate directly to grievance@knaps.in with your transaction/ticket reference."
    },
    {
      level: "Level 3",
      title: "SEBI SCORES Portal / SMART ODR (Regulatory Escalation)",
      desc: "If the complaint is not resolved within 30 days or the resolution is unsatisfactory, investors may lodge their grievance on the official SEBI SCORES portal or the SMART ODR platform."
    }
  ],
  externalPortals: [
    {
      name: "SEBI SCORES 2.0 Portal",
      url: "https://scores.sebi.gov.in/",
      desc: "Official SEBI Complaints Redress System for securities market grievances."
    },
    {
      name: "SMART ODR Portal",
      url: "https://smartodr.in/",
      desc: "Securities Market Approach for Resolution Through ODR Portal."
    },
    {
      name: "AMFI Complaints Guidance",
      url: "https://www.amfiindia.com/investor-corner/investor-center/how-to-complain.html",
      desc: "AMFI investor grievance guidelines and AMC escalation contacts."
    }
  ]
};

/**
 * Statutory & Regulatory Disclaimers
 */
export const STATUTORY_DISCLAIMER = {
  mfdDisclaimer:
    "KNAPS PRIVATE LIMITED (formerly KNAPS Financial Services) is an AMFI-Registered Mutual Fund Distributor holding ARN-367144 (valid from 04-AUG-2026 to 03-AUG-2029) and SIF distribution authorisation (valid from 23-OCT-2026 to 22-OCT-2029). In accordance with applicable SEBI and AMFI regulations, KNAPS operates strictly as a distributor of mutual funds and specialised investment funds.",
  noAdvisoryDisclaimer:
    "KNAPS PRIVATE LIMITED is NOT a SEBI-registered Investment Adviser (RIA). The content, calculators, comparisons, curated insights, and tools provided on this website are strictly for informational and educational purposes and must not be construed as investment advisory, legal, financial, or tax advice. Any distribution of mutual fund and SIF schemes is done in an execution-only / distributor capacity under the AMFI Code of Conduct.",
  marketRiskDisclaimer:
    "Mutual Fund investments are subject to market risks. Please read all scheme-related documents (Scheme Information Document - SID, Statement of Additional Information - SAI, and Key Information Memorandum - KIM) carefully before investing.",
  noGuaranteeDisclaimer:
    "Past performance of any mutual fund scheme, SIF strategy, or asset class is neither an indicator nor a guarantee of future returns. Investments are subject to market volatility, interest rate risk, credit risk, liquidity risk, and principal loss risk.",
  commissionDisclosure:
    "As a mutual fund distributor, KNAPS earns commission / brokerage from Asset Management Companies (AMCs) for distributing mutual fund schemes, as per the commission structure permissible under SEBI regulations. A detailed schedule of commissions is made available to investors in accordance with AMFI and SEBI circulars.",
  suitabilityDisclaimer:
    "Investors are advised to assess their own investment objectives, risk tolerance, and investment horizon, or consult an independent SEBI-registered tax or legal adviser before making any investment decisions."
};
