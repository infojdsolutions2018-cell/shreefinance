export interface LoanStatCounter {
  label: string;
  value: string;
  color?: string;
}

export interface HeroVisualCard {
  title: string;
  subtitle: string;
  tag: string;
  bullets: { label: string; value: string }[];
}

export interface WhyChooseSection {
  title: string;
  desc: string;
  bullets: string[];
}

export interface FeaturedGovtScheme {
  title: string;
  badge: string;
  desc: string;
  minAmount: string;
  subsidy: string;
  icon: string;
  actionSlug?: string;
}

export interface SpecialCalculatorsConfig {
  hasBalanceTransfer?: boolean;
  hasTaxBenefit?: boolean;
}

export interface LoanDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  badge: string;
  tagline: string;
  subtitle: string;
  startingRate: string;
  rateValue: number;
  maxAmount: string;
  maxAmountValue: number;
  maxTenure: string;
  maxTenureYears: number;
  processingFee: string;
  approvalTime: string;
  disbursalTime: string;
  icon: string;
  color: string;
  bgLight: string;
  borderColor: string;
  keyHighlights: string[];
  statCounters?: LoanStatCounter[];
  heroVisualCard?: HeroVisualCard;
  whyChoose?: WhyChooseSection;
  featuredSchemes?: FeaturedGovtScheme[];
  specialCalculators?: SpecialCalculatorsConfig;
  eligibility: {
    age: string;
    minIncome: string;
    cibilScore: string;
    employmentType: string;
    experience: string;
  };
  documents: {
    identityProof: string[];
    incomeProof: string[];
    addressProof: string[];
    otherDocs: string[];
  };
  bankOffers: {
    bank: string;
    code: string;
    color: string;
    rate: string;
    fee: string;
    tenure: string;
    specialPerk: string;
  }[];
  processSteps: {
    step: string;
    title: string;
    desc: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const ALL_LOANS_DATA: Record<string, LoanDetail> = {
  // ─── 1. PERSONAL LOAN ───
  'personal-loan': {
    id: 'personal-loan',
    slug: 'personal-loan',
    title: 'Personal Loan',
    category: 'Unsecured Credit',
    badge: 'Approvals in 5 Minutes',
    tagline: 'Need Instant Funds? Consider It Done.',
    subtitle: 'Experience 100% paperless digital lending. No collateral required, just instant cash directly into your bank account across 40+ partner banks.',
    startingRate: '10.25% p.a.*',
    rateValue: 10.25,
    maxAmount: 'Up to ₹50 Lakhs',
    maxAmountValue: 5000000,
    maxTenure: 'Up to 5 Years',
    maxTenureYears: 5,
    processingFee: '0.50% - 1.50% Flat',
    approvalTime: '5 Minutes Online',
    disbursalTime: 'Same-Day (Within 24 Hours)',
    icon: 'cash',
    color: '#10b981',
    bgLight: '#ecfdf5',
    borderColor: '#a7f3d0',
    statCounters: [
      { label: 'Starting APR', value: '10.25%', color: '#10b981' },
      { label: 'Max Tenure', value: '5 Years' },
      { label: 'Max Sanction', value: '₹50 Lakhs' },
    ],
    heroVisualCard: {
      title: 'Instant Digital Cash Sanction',
      subtitle: '100% Paperless & Collateral-Free',
      tag: '5-Min Approval',
      bullets: [
        { label: 'Processing', value: '100% Digital KYC' },
        { label: 'Collateral', value: 'Zero Assets Needed' },
        { label: 'Disbursal', value: 'Direct Account Credit' },
      ],
    },
    whyChoose: {
      title: 'Why Choose a Personal Loan from Shree Finance?',
      desc: 'Life is unpredictable, and so are financial needs. Whether it is a medical emergency, dream wedding, vacation, or home renovation, our Personal Loan is designed to be your reliable financial partner. With rates starting at 10.25% p.a., borrow up to ₹50 Lakhs with multi-bank approval.',
      bullets: [
        'Instant in-principle sanction within 5 minutes online',
        'No collateral, security deposit, or third-party guarantor required',
        'Zero end-use restrictions — utilize capital as per your requirement',
        'Direct credit into your savings bank account within 24 hours',
      ],
    },
    keyHighlights: [
      '100% paperless digital KYC verification',
      'No collateral or security deposit required',
      'Nil prepayment charges on select banking partners',
      'Zero end-use restrictions (Medical, Wedding, Vacation, Renovation)',
    ],
    eligibility: {
      age: '21 to 60 Years',
      minIncome: '₹25,000 / month (Salaried) or ₹4 Lakhs ITR (Self-Employed)',
      cibilScore: '680+ for fast-track sanctions (750+ for lowest rate)',
      employmentType: 'Salaried in MNC/Pvt/Govt or Self-Employed Professional',
      experience: 'Min 1 Year total (at least 6 months with current company)',
    },
    documents: {
      identityProof: ['PAN Card (Mandatory)', 'Aadhaar Card / Passport / Voter ID'],
      incomeProof: ['Latest 3 Months Salary Slips', 'Last 6 Months Bank Statement (Salary credited account)', 'Form 16 or 2 Years ITR with Computation'],
      addressProof: ['Utility Bill (Electricity/Gas)', 'Aadhaar Card with current address', 'Registered Rent Agreement'],
      otherDocs: ['Current Company ID Card', 'Passport-size Photographs (Digital upload)'],
    },
    bankOffers: [
      { bank: 'HDFC Bank', code: 'HDFC', color: '#004c8f', rate: '10.25% - 14.50%', fee: 'Up to 1.50%', tenure: '5 Yrs', specialPerk: 'Pre-Approved 10-sec Disbursal for account holders' },
      { bank: 'ICICI Bank', code: 'ICICI', color: '#b91c1c', rate: '10.50% - 15.00%', fee: '1.25% + GST', tenure: '5 Yrs', specialPerk: 'Minimal documentation with paperless e-sign' },
      { bank: 'State Bank of India', code: 'SBI', color: '#1e3a8a', rate: '10.30% - 13.90%', fee: 'Nil (Festive Offer)', tenure: '5 Yrs', specialPerk: 'Lowest interest rates for government & defense employees' },
      { bank: 'Axis Bank', code: 'AXIS', color: '#9d174d', rate: '10.75% - 15.50%', fee: 'Up to 2.00%', tenure: '5 Yrs', specialPerk: 'Instant digital approval with flexible tenure' },
      { bank: 'Tata Capital', code: 'TATA', color: '#0284c7', rate: '10.99% - 16.00%', fee: '1.00% Flat', tenure: '5 Yrs', specialPerk: 'Multi-purpose loan with part-prepayment facility' },
      { bank: 'Bajaj Finserv', code: 'BAJAJ', color: '#0369a1', rate: '11.00% - 16.50%', fee: 'Up to 2.50%', tenure: '5 Yrs', specialPerk: 'Flexi Hybrid Term Loan - Pay interest only on withdrawn amount' },
    ],
    processSteps: [
      { step: '01', title: 'Submit 2-Min Application', desc: 'Fill your basic personal and employment details digitally.' },
      { step: '02', title: 'Instant Algorithmic Verification', desc: 'Our multi-bank engine matches your profile with 40+ lenders.' },
      { step: '03', title: 'Digital Sanction Letter', desc: 'Select your preferred bank offer and sign agreement via Aadhaar OTP.' },
      { step: '04', title: '24-Hour Bank Credit', desc: 'Loan capital is transferred directly into your savings account.' },
    ],
    faqs: [
      { q: 'How fast can I get a personal loan disbursed?', a: 'Pre-approval takes only 5 minutes. Once your e-KYC and digital bank statements are uploaded, funds are transferred within 24 hours.' },
      { q: 'Can I apply if my CIBIL score is around 650?', a: 'Yes! While 750+ offers the lowest interest rates, Shree Finance partners with multiple private banks and NBFCs that consider applicants with credit scores between 650 and 700.' },
      { q: 'Are there any restrictions on how I use the money?', a: 'None at all. You can use your personal loan for weddings, home improvement, medical emergencies, travel, or debt consolidation.' },
    ],
  },

  // ─── 2. HOME LOAN ───
  'home-loan': {
    id: 'home-loan',
    slug: 'home-loan',
    title: 'Home Loan',
    category: 'Secured Housing Finance',
    badge: 'Multi-Bank Portal 2026',
    tagline: 'Low Interest Home Loans Starting 8.35% p.a.',
    subtitle: 'Compare Home Loans across State Bank of India, HDFC Bank, ICICI Bank, YES Bank & Shree Finance Direct. Get 100% paperless digital sanction in 24 hours.',
    startingRate: '8.35% p.a.*',
    rateValue: 8.35,
    maxAmount: 'Up to ₹10 Crore',
    maxAmountValue: 100000000,
    maxTenure: 'Up to 30 Years',
    maxTenureYears: 30,
    processingFee: 'Nil (Festive Offer) or 0.25%',
    approvalTime: '24 Hours In-Principle',
    disbursalTime: '3 - 5 Working Days',
    icon: 'home',
    color: '#0284c7',
    bgLight: '#e0f2fe',
    borderColor: '#bae6fd',
    statCounters: [
      { label: 'Starting APR', value: '8.35%', color: '#0284c7' },
      { label: 'Max Tenure', value: '30 Years' },
      { label: 'Max Limit', value: '₹10 Crore' },
    ],
    heroVisualCard: {
      title: 'Multi-Bank Housing Portal',
      subtitle: 'YES Bank, SBI, HDFC & ICICI',
      tag: 'PMAY 2.0 Supported',
      bullets: [
        { label: 'Annual Tax Save', value: 'Up to ₹3.5 Lakhs' },
        { label: 'HLBT Rate Cut', value: 'Up to 1.75% Off' },
        { label: 'Processing', value: 'Nil to 0.25%' },
      ],
    },
    whyChoose: {
      title: 'Why Choose a Home Loan with Shree Finance?',
      desc: 'Buying or constructing a home is a lifetime aspiration. Shree Finance helps you compare 40+ leading housing finance companies, locking in the lowest market rates starting at 8.35% p.a. with flexible balance transfer, top-up options, and tax savings.',
      bullets: [
        'Lowest floating rates starting from 8.35% p.a.',
        'Annual tax deductions up to ₹3.5 Lakhs under Sec 24(b) and 80C',
        'Home Loan Balance Transfer with up to 1.75% rate cut + Instant Top-Up',
        'PMAY 2.0 central government housing subsidy assistance',
      ],
    },
    specialCalculators: {
      hasBalanceTransfer: true,
      hasTaxBenefit: true,
    },
    keyHighlights: [
      'Lowest floating rates starting from 8.35% p.a.',
      'Save up to ₹3.5 Lakhs annually on income tax under Sec 24(b) & 80C',
      'Home Loan Balance Transfer with up to 1.75% rate cut + Instant Top-Up',
      'Pradhan Mantri Awas Yojana (PMAY) interest subsidy support',
    ],
    eligibility: {
      age: '21 to 65 Years at maturity',
      minIncome: '₹30,000 / month (Salaried) or ₹5 Lakhs Net Profit (Self-Employed)',
      cibilScore: '750+ recommended for premier 8.35% interest slabs',
      employmentType: 'Salaried, Self-Employed Business, Professionals & NRIs',
      experience: '2 Years employment or 3 Years business vintage',
    },
    documents: {
      identityProof: ['PAN Card', 'Aadhaar Card / Valid Indian Passport'],
      incomeProof: ['Last 3 Months Salary Slips', '2 Years Form 16 / ITR with Computation', '6 Months Salary Account Statements'],
      addressProof: ['Electricity Bill / Passport / Registered Leave & License'],
      otherDocs: ['Allotment Letter / Agreement to Sale', 'Property Title Deeds & Chain of Documents', 'Approved Building Plan Blueprint'],
    },
    bankOffers: [
      { bank: 'State Bank of India', code: 'SBI', color: '#1e3a8a', rate: '8.40% - 9.05%', fee: 'Nil (Festive Offer)', tenure: '30 Yrs', specialPerk: 'Concessional rates for women borrowers & green housing' },
      { bank: 'HDFC Bank', code: 'HDFC', color: '#004c8f', rate: '8.45% - 9.15%', fee: '0.25% (Min ₹3,000)', tenure: '30 Yrs', specialPerk: 'Digital property legal check & door-step service' },
      { bank: 'ICICI Bank', code: 'ICICI', color: '#b91c1c', rate: '8.50% - 9.20%', fee: '0.25% + GST', tenure: '30 Yrs', specialPerk: 'Instant digital in-principle sanction via NetBanking' },
      { bank: 'Bank of Baroda', code: 'BOB', color: '#c2410c', rate: '8.40% - 9.00%', fee: 'Nil Processing', tenure: '30 Yrs', specialPerk: 'BRLLR linked low EMI rates with nil prepayment penalty' },
      { bank: 'Kotak Mahindra Bank', code: 'KOTAK', color: '#dc2626', rate: '8.55% - 9.10%', fee: 'Flat ₹5,000', tenure: '25 Yrs', specialPerk: 'Fast-track approval with transparent appraisal' },
      { bank: 'Axis Bank', code: 'AXIS', color: '#9d174d', rate: '8.60% - 9.35%', fee: 'Up to 0.30%', tenure: '30 Yrs', specialPerk: 'Shubh Aarambh 12 EMI waiver feature for timely payers' },
    ],
    processSteps: [
      { step: '01', title: 'Check Multi-Bank Eligibility', desc: 'Enter loan amount and city to view live quotes from 40+ banks.' },
      { step: '02', title: 'Digital e-KYC & Document Pickup', desc: 'Upload income documents online or request doorstep executive pickup.' },
      { step: '03', title: 'Property Legal & Technical Valuation', desc: 'Certified bank lawyers verify property title and valuation.' },
      { step: '04', title: 'Sanction & Seller Disbursal', desc: 'Cheque or RTGS disbursed to builder/seller within 3-5 days.' },
    ],
    faqs: [
      { q: 'Can I transfer my existing home loan to a lower interest rate?', a: 'Yes! Shree Finance specializes in Home Loan Balance Transfers (HLBT). You can reduce your ROI by 1.0% to 1.75% and access a top-up loan simultaneously.' },
      { q: 'What is the maximum loan-to-value (LTV) ratio?', a: 'As per RBI guidelines: Up to 90% for loans up to ₹30 Lakhs, up to 80% for loans between ₹30L and ₹75L, and up to 75% for loans above ₹75 Lakhs.' },
      { q: 'Are there any tax benefits on home loans?', a: 'Yes. You can claim deductions up to ₹2 Lakhs on interest paid under Section 24(b) and up to ₹1.5 Lakhs on principal repayment under Section 80C.' },
    ],
  },

  // ─── 3. LOAN AGAINST PROPERTY (LAP) ───
  'loan-against-property': {
    id: 'loan-against-property',
    slug: 'loan-against-property',
    title: 'Loan Against Property (LAP)',
    category: 'Mortgage Loan',
    badge: 'High-Value Mortgage 9.25%',
    tagline: 'High-Ticket Capital Against Your Property.',
    subtitle: 'Unlock substantial liquidity against residential, commercial, or industrial properties with low monthly EMIs and extended tenures up to 20 years.',
    startingRate: '9.25% p.a.*',
    rateValue: 9.25,
    maxAmount: 'Up to ₹25 Crore',
    maxAmountValue: 250000000,
    maxTenure: 'Up to 20 Years',
    maxTenureYears: 20,
    processingFee: '0.50% - 1.00%',
    approvalTime: '48 Hours In-Principle',
    disbursalTime: '5 - 7 Working Days',
    icon: 'business',
    color: '#8b5cf6',
    bgLight: '#f5f3ff',
    borderColor: '#ddd6fe',
    statCounters: [
      { label: 'Starting APR', value: '9.25%', color: '#8b5cf6' },
      { label: 'Max Tenure', value: '20 Years' },
      { label: 'Max Limit', value: '₹25 Crore' },
    ],
    heroVisualCard: {
      title: 'Residential & Commercial LAP',
      subtitle: 'Up to 75% Fair Market Valuation',
      tag: 'High-Ticket Capital',
      bullets: [
        { label: 'Interest Rate', value: 'Starting 9.25% p.a.' },
        { label: 'Property Types', value: 'Flat, Shop, Plot, Office' },
        { label: 'Repayment Type', value: 'EMI or Dropline OD' },
      ],
    },
    whyChoose: {
      title: 'Why Choose Loan Against Property (LAP)?',
      desc: 'Unlock the financial power of your self-occupied or rented residential or commercial real estate. Benefit from much lower monthly EMIs and extended tenures compared to unsecured loans, with flexible overdraft and term loan facilities.',
      bullets: [
        'High Loan-to-Value (LTV) up to 75% of fair market property valuation',
        'Residential flats, bungalows, commercial shops & industrial plots accepted',
        'Substantially lower monthly EMI compared to unsecured business loans',
        'Overdraft (OD / Dropline OD) limits available for businesses',
      ],
    },
    keyHighlights: [
      'High Loan-to-Value (LTV) up to 75% of fair market property valuation',
      'Accepted for residential flats, bungalows, commercial shops & industrial plots',
      'Substantially lower monthly EMI compared to unsecured business loans',
      'Overdraft (OD / Dropline OD) limits available for businesses',
    ],
    eligibility: {
      age: '25 to 68 Years',
      minIncome: '₹50,000 / month (Salaried) or ₹6 Lakhs Annual ITR (Self-Employed)',
      cibilScore: '700+ required',
      employmentType: 'Traders, Manufacturers, Business Owners & Salaried Individuals',
      experience: 'Min 3 Years in business or 3 Years steady employment',
    },
    documents: {
      identityProof: ['PAN Card of all property co-owners', 'Aadhaar / Passport'],
      incomeProof: ['3 Years Audited Balance Sheet & P&L', '3 Years ITR with Computation', '12 Months Bank Statements'],
      addressProof: ['Utility Bill / Business Incorporation Certificate'],
      otherDocs: ['Registered Title Deed (Sale Deed / Conveyance Deed)', 'Property Tax Receipts', 'Approved Sanctioned Building Plan'],
    },
    bankOffers: [
      { bank: 'State Bank of India', code: 'SBI', color: '#1e3a8a', rate: '9.15% - 9.85%', fee: '0.50% Flat', tenure: '15 Yrs', specialPerk: 'Lowest interest rates for commercial property mortgages' },
      { bank: 'HDFC Bank', code: 'HDFC', color: '#004c8f', rate: '9.25% - 10.25%', fee: '0.50% + GST', tenure: '15 Yrs', specialPerk: 'Overdraft facility available with interest on utilized amount' },
      { bank: 'ICICI Bank', code: 'ICICI', color: '#b91c1c', rate: '9.30% - 10.50%', fee: '0.75%', tenure: '15 Yrs', specialPerk: 'High LTV up to 75% on prime residential properties' },
      { bank: 'Bajaj Finserv', code: 'BAJAJ', color: '#0369a1', rate: '9.50% - 11.00%', fee: '1.00%', tenure: '18 Yrs', specialPerk: 'Flexi Dropline OD facility with minimal balance sheet friction' },
    ],
    processSteps: [
      { step: '01', title: 'Consult Senior Mortgage Advisor', desc: 'Assess your property value and optimum borrowing potential.' },
      { step: '02', title: 'Technical Legal Evaluation', desc: 'Bank architects and legal advocates verify property clear title.' },
      { step: '03', title: 'Credit Sanction', desc: 'Loan sanctioned based on income debt-service coverage ratio.' },
      { step: '04', title: 'Mortgage Registration & Disbursal', desc: 'Execution of simple mortgage deed and disbursement of funds.' },
    ],
    faqs: [
      { q: 'Can I take a loan against a rented or commercial property?', a: 'Yes! Both self-occupied and rented residential or commercial properties are accepted as collateral.' },
      { q: 'Can I continue using or renting the property during the loan tenure?', a: 'Yes. You retain 100% possession and usage of the property while repaying the loan.' },
    ],
  },

  // ─── 4. CAR LOAN ───
  'car-loan': {
    id: 'car-loan',
    slug: 'car-loan',
    title: 'Car Loan',
    category: 'Auto Financing',
    badge: '100% On-Road Funding',
    tagline: 'Drive Away Your Dream Vehicle Today.',
    subtitle: 'Finance new cars, pre-owned certified vehicles, or electric vehicles with 100% on-road funding, zero down-payment options, and swift 30-minute sanctions.',
    startingRate: '8.75% p.a.*',
    rateValue: 8.75,
    maxAmount: '100% On-Road Price',
    maxAmountValue: 10000000,
    maxTenure: 'Up to 8 Years',
    maxTenureYears: 8,
    processingFee: 'Nil to ₹2,500 Flat',
    approvalTime: '30 Minutes Instant',
    disbursalTime: '24 Hours to Dealership',
    icon: 'car-sport',
    color: '#f59e0b',
    bgLight: '#fef3c7',
    borderColor: '#fde68a',
    statCounters: [
      { label: 'Starting APR', value: '8.75%', color: '#f59e0b' },
      { label: 'Max Tenure', value: '8 Years' },
      { label: 'On-Road Cover', value: '100% Funding' },
    ],
    heroVisualCard: {
      title: '100% On-Road Auto Funding',
      subtitle: 'Instant Showroom Delivery Orders',
      tag: 'New & Pre-Owned',
      bullets: [
        { label: 'Rate Discount', value: '0.25% Off on Electric Vehicles' },
        { label: 'Cover Includes', value: 'Car + RTO + 3-Yr Insurance' },
        { label: 'Pre-Approval', value: '30-Minute Fast Track' },
      ],
    },
    whyChoose: {
      title: 'Why Choose Shree Finance Car Loan?',
      desc: 'Hit the road with total confidence. We finance up to 100% of the on-road vehicle price, meaning zero out-of-pocket down payment for eligible borrowers across top automotive dealerships.',
      bullets: [
        '100% on-road funding covering registration and insurance',
        'Pre-approved digital car loans for fast delivery',
        'Special discounted rates for Electric Vehicles (EVs)',
        'Funding available for luxury cars and certified used cars',
      ],
    },
    keyHighlights: [
      'Up to 100% on-road funding including insurance and registration',
      'Special 0.25% interest rate discount on Electric Vehicles (EVs)',
      'Pre-approved digital car loans for existing bank account holders',
      'Finance available for luxury cars, SUVs, sedans & commercial vehicles',
    ],
    eligibility: {
      age: '21 to 65 Years',
      minIncome: '₹20,000 / month (Salaried) or ₹3 Lakhs ITR (Self-Employed)',
      cibilScore: '675+',
      employmentType: 'Salaried, Self-Employed & Agricultural Landholders',
      experience: 'Min 1 Year continuous employment or business',
    },
    documents: {
      identityProof: ['PAN Card', 'Aadhaar Card / Driving License'],
      incomeProof: ['Last 3 Months Salary Slips or 2 Years ITR', 'Last 6 Months Bank Statement'],
      addressProof: ['Electricity Bill / Rent Agreement'],
      otherDocs: ['Car Proforma Invoice from authorized dealership', 'Quotation with RTO & Insurance breakdown'],
    },
    bankOffers: [
      { bank: 'State Bank of India', code: 'SBI', color: '#1e3a8a', rate: '8.65% - 9.25%', fee: 'Nil (Festive Offer)', tenure: '7 Yrs', specialPerk: 'Finances up to 90% on-road price with nil foreclosure penalty' },
      { bank: 'HDFC Bank', code: 'HDFC', color: '#004c8f', rate: '8.75% - 9.50%', fee: '₹1,500 Flat', tenure: '8 Yrs', specialPerk: '30-minute express approval directly at dealership' },
      { bank: 'ICICI Bank', code: 'ICICI', color: '#b91c1c', rate: '8.80% - 9.60%', fee: '₹2,000', tenure: '7 Yrs', specialPerk: '100% on-road funding for selected top car models' },
      { bank: 'Axis Bank', code: 'AXIS', color: '#9d174d', rate: '8.90% - 9.75%', fee: '₹2,500', tenure: '7 Yrs', specialPerk: 'Competitive pre-owned used car financing options' },
    ],
    processSteps: [
      { step: '01', title: 'Choose Your Dream Car', desc: 'Get proforma quotation from your local authorized automobile dealer.' },
      { step: '02', title: 'Instant Online Eligibility', desc: 'Upload PAN and salary statement for immediate bank rate comparison.' },
      { step: '03', title: 'Delivery Order (DO) Issued', desc: 'Bank issues Delivery Order directly to your car showroom.' },
      { step: '04', title: 'Drive Home with Pride', desc: 'Showroom delivers vehicle on the same day.' },
    ],
    faqs: [
      { q: 'Can I get a loan for pre-owned (used) cars?', a: 'Yes! We finance certified pre-owned cars up to 10 years old with attractive interest rates and tenures up to 5 years.' },
      { q: 'What is the difference between ex-showroom and on-road funding?', a: 'Ex-showroom covers only the car price. On-road funding covers the car price + road tax (RTO) + 3-year insurance + registration charges.' },
    ],
  },

  // ─── 5. BUSINESS LOAN ───
  'business-loan': {
    id: 'business-loan',
    slug: 'business-loan',
    title: 'Business Loan',
    category: 'MSME & Commercial Funding',
    badge: '100% Collateral-Free',
    tagline: 'Scale Your Business Growth in 24 Hours.',
    subtitle: 'Unsecured working capital, machinery term loans, and credit lines up to ₹75 Lakhs for MSMEs, manufacturers, traders, and service providers with minimal documentation.',
    startingRate: '13.99% p.a.*',
    rateValue: 13.99,
    maxAmount: 'Up to ₹75 Lakhs',
    maxAmountValue: 7500000,
    maxTenure: 'Up to 5 Years',
    maxTenureYears: 5,
    processingFee: '1.00% - 2.00%',
    approvalTime: '4 Hours Digital',
    disbursalTime: '24 to 48 Hours',
    icon: 'briefcase',
    color: '#06b6d4',
    bgLight: '#ecfeff',
    borderColor: '#a5f3fc',
    statCounters: [
      { label: 'Starting APR', value: '13.99%', color: '#06b6d4' },
      { label: 'Max Tenure', value: '5 Years' },
      { label: 'Max Sanction', value: '₹75 Lakhs' },
    ],
    heroVisualCard: {
      title: 'Unsecured MSME Commercial Capital',
      subtitle: 'GST & Banking Based Approval',
      tag: 'No Collateral',
      bullets: [
        { label: 'Tax Deductible', value: 'Section 37(1) Tax Save' },
        { label: 'Facility', value: 'Term Loan / Dropline OD' },
        { label: 'Disbursal', value: '24-48 Hrs to Current A/c' },
      ],
    },
    whyChoose: {
      title: 'Why Choose a Business Loan with Shree Finance?',
      desc: 'Fuel your business expansion, buy inventory, purchase high-speed machinery, or manage working capital cycles with collateral-free loans up to ₹75 Lakhs evaluated on your cash flows.',
      bullets: [
        'Zero collateral or hypothecation of business assets',
        'Sanctions based on monthly GST returns and bank credits',
        'Tax-deductible interest payments reduce annual business tax',
        'Working capital overdraft lines to manage operational surges',
      ],
    },
    keyHighlights: [
      'No collateral or hypothecation of business assets required',
      'Quick business loan approval based on GST & banking transactions',
      'Overdraft and drop-line credit facility available',
      'Tax deductible business interest payments under Section 37(1)',
    ],
    eligibility: {
      age: '24 to 65 Years',
      minIncome: 'Minimum ₹25 Lakhs Annual Gross Turnover',
      cibilScore: '680+ (Commercial Bureau CMR rank 1-5 preferred)',
      employmentType: 'Sole Proprietorship, Partnership, LLP, Pvt Ltd Companies',
      experience: 'Minimum 2 Years business continuity with active GST filings',
    },
    documents: {
      identityProof: ['PAN Card of Business entity & All Directors/Partners', 'Aadhaar Cards'],
      incomeProof: ['Last 12 Months Current Bank Statements', 'Latest 2 Years ITR with Computation, Balance Sheet & Audit Report', 'Latest 12 Months GST Returns (GSTR-3B)'],
      addressProof: ['GST Certificate, Shop Act License, Udyam Registration (MSME)'],
      otherDocs: ['Partnership Deed / Memorandum & Articles of Association (MOA/AOA)'],
    },
    bankOffers: [
      { bank: 'HDFC Bank MSME', code: 'HDFC', color: '#004c8f', rate: '13.50% - 17.00%', fee: '1.00% + GST', tenure: '5 Yrs', specialPerk: 'Direct working capital line with fast turnaround' },
      { bank: 'ICICI Business Banking', code: 'ICICI', color: '#b91c1c', rate: '13.75% - 17.50%', fee: '1.25%', tenure: '5 Yrs', specialPerk: 'Express digital sanction up to ₹50L without balance sheet' },
      { bank: 'Tata Capital MSME', code: 'TATA', color: '#0284c7', rate: '13.99% - 17.50%', fee: '0.75%', tenure: '5 Yrs', specialPerk: 'Flexible repayment structures for seasonal businesses' },
      { bank: 'Axis Commercial', code: 'AXIS', color: '#9d174d', rate: '14.00% - 18.00%', fee: '1.50%', tenure: '5 Yrs', specialPerk: 'Dedicated Relationship Manager for MSME accounts' },
    ],
    processSteps: [
      { step: '01', title: 'Submit GST & Banking Data', desc: 'Securely upload your GSTIN and 12-month current account statement.' },
      { step: '02', title: 'Automated Cash-Flow Underwriting', desc: 'Bank algorithms assess your monthly turnover and debt capacity.' },
      { step: '03', title: 'Sanction Term Sheet', desc: 'Review approved limits, interest rates, and loan tenure options.' },
      { step: '04', title: 'Capital Credited to Current Account', desc: 'Funds disbursed directly to your corporate account within 24-48 hrs.' },
    ],
    faqs: [
      { q: 'Is collateral or property required for a business loan?', a: 'No! Our business loans up to ₹75 Lakhs are completely unsecured with zero collateral or security requirements.' },
      { q: 'How does GST turnover help in getting higher loans?', a: 'Lenders evaluate your monthly GST filings (GSTR-3B) and bank deposits to determine your monthly surplus cash flow for sanctions.' },
    ],
  },

  // ─── 6. EDUCATION LOAN ───
  'education-loan': {
    id: 'education-loan',
    slug: 'education-loan',
    title: 'Education Loan',
    category: 'Student & Career Finance',
    badge: 'Study in India & Abroad',
    tagline: 'Invest in Higher Education with Nil Margin.',
    subtitle: 'Fund 100% of overseas and premier Indian university education costs including tuition, living expenses, books, travel, and student insurance with long moratorium periods.',
    startingRate: '9.50% p.a.*',
    rateValue: 9.50,
    maxAmount: 'Up to ₹1.5 Crore',
    maxAmountValue: 15000000,
    maxTenure: 'Up to 15 Years',
    maxTenureYears: 15,
    processingFee: 'Nil (India) or 0.50% (Abroad)',
    approvalTime: '48 Hours In-Principle',
    disbursalTime: 'Directly to University',
    icon: 'school',
    color: '#6366f1',
    bgLight: '#eef2ff',
    borderColor: '#c7d2fe',
    statCounters: [
      { label: 'Starting APR', value: '9.50%', color: '#6366f1' },
      { label: 'Max Tenure', value: '15 Years' },
      { label: 'Tuition Cover', value: '100% Cover' },
    ],
    heroVisualCard: {
      title: 'Premier India & Global Studies',
      subtitle: 'US, UK, Canada, Australia & India',
      tag: 'Course + 1 Yr Moratorium',
      bullets: [
        { label: 'Tax Deduction', value: 'Sec 80E 100% (No Cap)' },
        { label: 'Unsecured Limit', value: 'Up to ₹40L for Top Unis' },
        { label: 'Wire Disbursal', value: 'Direct to Foreign University' },
      ],
    },
    whyChoose: {
      title: 'Why Choose Shree Finance for Higher Education?',
      desc: 'Invest in your future and secure admissions in world-class institutions. We cover 100% of educational expenses including university tuition, hostel, flights, laptop, living expenses, and visa deposits.',
      bullets: [
        'Moratorium period: No EMI during study duration + 1 year',
        '100% tax deduction on interest under Section 80E with no upper limit',
        'Pre-visa sanction letters for smooth embassy visa stamping',
        '0.50% special interest concession for female students',
      ],
    },
    keyHighlights: [
      'Unsecured education loans up to ₹40 Lakhs for top 100 global universities',
      'Course period + 1-Year moratorium before EMI repayment begins',
      '100% income tax deduction on interest paid under Section 80E with no cap',
      'Covers tuition fees, hostel, laptop, overseas travel & visa deposit funds',
    ],
    eligibility: {
      age: '18 to 35 Years',
      minIncome: 'Parent/Co-applicant min income ₹30,000 / month',
      cibilScore: 'Co-applicant CIBIL 680+',
      employmentType: 'Confirmed admission in recognized college/university',
      experience: 'Merit-based admission via entrance exam or direct selection',
    },
    documents: {
      identityProof: ['Student & Co-applicant PAN & Aadhaar', 'Valid Indian Passport for abroad studies'],
      incomeProof: ['Co-applicant 3 Months Salary Slips', '2 Years ITR / Form 16', '6 Months Bank Statements'],
      addressProof: ['Utility Bill / Passport'],
      otherDocs: ['University Admission Offer Letter with I-20 / CAS', 'Complete Course Fee Breakdown Schedule', 'Academic Marksheets (10th, 12th, Degree) & GRE/GMAT/IELTS scorecards'],
    },
    bankOffers: [
      { bank: 'State Bank of India', code: 'SBI', color: '#1e3a8a', rate: '8.85% - 9.65%', fee: 'Nil (India) / ₹10,000 (Abroad)', tenure: '15 Yrs', specialPerk: 'SBI Global Ed-Vantage Scheme up to ₹1.5 Cr with 0.50% concession for girls' },
      { bank: 'HDFC Credila', code: 'HDFC', color: '#004c8f', rate: '9.50% - 11.50%', fee: 'Up to 1.00%', tenure: '15 Yrs', specialPerk: 'Customized overseas student education loan specialist' },
      { bank: 'ICICI Bank', code: 'ICICI', color: '#b91c1c', rate: '9.75% - 11.75%', fee: '0.75%', tenure: '12 Yrs', specialPerk: 'Sanction letter issued prior to Visa processing' },
    ],
    processSteps: [
      { step: '01', title: 'Submit Admission & University Details', desc: 'Enter target country, course, and estimated total financial requirement.' },
      { step: '02', title: 'Co-Applicant Document Verification', desc: 'Co-borrower income documents verified digitally.' },
      { step: '03', title: 'Pre-Visa Sanction Letter Issued', desc: 'Receive official sanction letter required for student visa approval.' },
      { step: '04', title: 'Direct University Wire Transfer', desc: 'Tuition fees wired directly to international university account.' },
    ],
    faqs: [
      { q: 'When do I have to start paying EMIs for an education loan?', a: 'Repayment typically starts 6 to 12 months after course completion, or 6 months after securing employment, whichever is earlier.' },
      { q: 'Is collateral mandatory for overseas studies?', a: 'No! Many lenders offer unsecured loans up to ₹40-50 Lakhs for top-ranked STEM, MBA, and premier university programs worldwide.' },
    ],
  },

  // ─── 7. GOVERNMENT SCHEMES ───
  'government-schemes': {
    id: 'government-schemes',
    slug: 'government-schemes',
    title: 'Government Loan Schemes',
    category: 'Subsidized National Schemes',
    badge: 'Central Government Grants',
    tagline: 'PMAY, Mudra, PMEGP & Stand-Up India.',
    subtitle: 'Access government sponsored loan schemes with subsidized interest rates, capital subsidies up to 35%, and credit guarantees supported by SIDBI and CGTMSE.',
    startingRate: 'Starting 7.50% p.a.*',
    rateValue: 7.50,
    maxAmount: 'Up to ₹5 Crore',
    maxAmountValue: 50000000,
    maxTenure: 'Up to 10 Years',
    maxTenureYears: 10,
    processingFee: 'Nil as per RBI & Government Guidelines',
    approvalTime: '7 - 10 Working Days',
    disbursalTime: 'Bank Linked Subsidies',
    icon: 'ribbon',
    color: '#ea580c',
    bgLight: '#fff7ed',
    borderColor: '#fed7aa',
    statCounters: [
      { label: 'Starting APR', value: '7.50%', color: '#ea580c' },
      { label: 'Max Tenure', value: '10 Years' },
      { label: 'Max Limit', value: '₹5 Crore' },
    ],
    heroVisualCard: {
      title: 'National Subsidized Credit Schemes',
      subtitle: 'PMAY, Mudra, PMEGP & Stand-Up India',
      tag: 'SIDBI & CGTMSE Backed',
      bullets: [
        { label: 'Subsidy Support', value: 'Up to 35% Capital Grant' },
        { label: 'Mudra Limit', value: 'Up to ₹20L Collateral Free' },
        { label: 'Processing Fee', value: 'Nil as per RBI Mandates' },
      ],
    },
    whyChoose: {
      title: 'Why Apply for Government Schemes with Shree Finance?',
      desc: 'Unlock the full power of Government of India financial initiatives. We assist you with scheme eligibility matching, Detailed Project Report (DPR) preparation, and nationalized bank file sponsorship.',
      bullets: [
        'PMAY 2.0 interest subsidy up to ₹2.67 Lakhs on housing',
        'PMMY Mudra loans up to ₹20 Lakhs with zero collateral',
        'PMEGP capital subsidies from 15% to 35% on project cost',
        'Assisted documentation and bank nodal agency liaison',
      ],
    },
    featuredSchemes: [
      {
        title: 'PMAY 2.0 (Housing)',
        badge: 'Subsidies & Grants',
        desc: 'Pradhan Mantri Awas Yojana. Upfront interest subsidy up to ₹2.67 Lakhs on home loans for first-time buyers.',
        minAmount: 'Up to ₹50L',
        subsidy: '₹2.67 Lakhs',
        icon: 'home',
        actionSlug: 'pmay',
      },
      {
        title: 'Pradhan Mantri Mudra Loan',
        badge: 'Micro Enterprise',
        desc: 'Micro Units Development & Refinance Agency. Collateral-free loans up to ₹20 Lakhs in Shishu, Kishore & Tarun tiers.',
        minAmount: 'Up to ₹20L',
        subsidy: 'Zero Collateral',
        icon: 'cash',
        actionSlug: 'mudra-loan',
      },
      {
        title: 'Stand-Up India Scheme',
        badge: 'Women & SC/ST',
        desc: 'Bank loans from ₹10 Lakhs to ₹1 Crore for setting up greenfield manufacturing, service, or trading enterprises.',
        minAmount: '₹10L - ₹1Cr',
        subsidy: 'CGTMSE Cover',
        icon: 'people',
      },
      {
        title: 'PMEGP Subsidy Scheme',
        badge: 'Up to 35% Grant',
        desc: "Prime Minister's Employment Generation Programme. Capital subsidy of 15% to 35% on project costs up to ₹50 Lakhs.",
        minAmount: 'Up to ₹50L',
        subsidy: '15% - 35% Grant',
        icon: 'ribbon',
      },
      {
        title: 'Sukanya Samriddhi Scheme',
        badge: 'Girl Child Welfare',
        desc: 'Government backed small savings deposit scheme for girl children with sovereign guarantee and 80C tax deduction.',
        minAmount: 'From ₹250',
        subsidy: 'Highest Return',
        icon: 'shield-checkmark',
      },
    ],
    keyHighlights: [
      'PMAY 2.0 Interest Subsidy for affordable urban & rural housing',
      'Pradhan Mantri Mudra Yojana (PMMY) loans up to ₹20 Lakhs collateral-free',
      'PMEGP Subsidy of 15% to 35% on project cost for new manufacturing & service units',
      'Stand-Up India loans up to ₹1 Crore for women, SC, and ST entrepreneurs',
    ],
    eligibility: {
      age: '18 to 65 Years',
      minIncome: 'Subject to specific scheme criteria',
      cibilScore: '650+',
      employmentType: 'New business setups, micro-enterprises, rural borrowers, first-time home buyers',
      experience: 'Scheme specific business project report required',
    },
    documents: {
      identityProof: ['Aadhaar Card', 'PAN Card', 'Caste Certificate (if applicable for quota)'],
      incomeProof: ['Income Certificate issued by Tehsildar / Form 16 / ITR', 'Bank Statements'],
      addressProof: ['Ration Card / Voter ID / Electricity Bill'],
      otherDocs: ['Detailed Project Report (DPR) for manufacturing/service units', 'Udyam MSME Registration Certificate', 'Educational qualifications marksheets'],
    },
    bankOffers: [
      { bank: 'State Bank of India', code: 'SBI', color: '#1e3a8a', rate: '7.50% - 9.50%', fee: 'Nil', tenure: '10 Yrs', specialPerk: 'Largest disbursing bank for PMMY Mudra & Stand-Up India' },
      { bank: 'Bank of Baroda', code: 'BOB', color: '#c2410c', rate: '7.85% - 9.65%', fee: 'Nil', tenure: '10 Yrs', specialPerk: 'Fast processing of PMEGP capital subsidy claims' },
      { bank: 'Punjab National Bank', code: 'PNB', color: '#ca8a04', rate: '8.00% - 9.75%', fee: 'Nil', tenure: '7 Yrs', specialPerk: 'Special assistance for agricultural and rural youth schemes' },
    ],
    processSteps: [
      { step: '01', title: 'Identify Eligible Government Scheme', desc: 'Select between Mudra, PMEGP, Stand-Up India, or PMAY.' },
      { step: '02', title: 'Prepare Project Profile & Financials', desc: 'Our advisory team formats your project report as per bank guidelines.' },
      { step: '03', title: 'Public Sector Bank Sponsoring', desc: 'Application routed to partner nationalized banks with CGTMSE guarantee.' },
      { step: '04', title: 'Sanction & Subsidy Credit', desc: 'Government capital subsidy credited to your subsidy reserve account.' },
    ],
    faqs: [
      { q: 'Do I need to pay any processing fee for Mudra loans?', a: 'No. As per RBI and Government of India mandates, banks cannot charge processing fees for Mudra loans up to ₹5 Lakhs.' },
      { q: 'What is the maximum subsidy under PMEGP?', a: 'You can receive up to 25% subsidy in urban areas and up to 35% subsidy in rural areas on project costs up to ₹50 Lakhs.' },
    ],
  },

  // ─── 8. MUDRA LOAN ───
  'mudra-loan': {
    id: 'mudra-loan',
    slug: 'mudra-loan',
    title: 'Pradhan Mantri Mudra Loan',
    category: 'Government MSME Scheme',
    badge: 'Zero Collateral Scheme',
    tagline: 'Funding the Unfunded Small Business.',
    subtitle: 'Pradhan Mantri Mudra Yojana (PMMY) provides loans up to ₹20 Lakhs to non-corporate, non-farm small and micro enterprises with 100% credit guarantee by NCGTC.',
    startingRate: '8.50% p.a.*',
    rateValue: 8.50,
    maxAmount: 'Up to ₹20 Lakhs',
    maxAmountValue: 2000000,
    maxTenure: 'Up to 5 Years',
    maxTenureYears: 5,
    processingFee: 'Nil for Shishu & Kishore',
    approvalTime: '5 - 7 Working Days',
    disbursalTime: 'Direct Bank Account Credit',
    icon: 'business',
    color: '#0284c7',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
    statCounters: [
      { label: 'Starting Rate', value: '8.50%', color: '#0284c7' },
      { label: 'Max Tenure', value: '5 Years' },
      { label: 'Max Limit', value: '₹20 Lakhs' },
    ],
    keyHighlights: [
      'Shishu: Loans up to ₹50,000 for startup micro-businesses',
      'Kishore: Loans from ₹50,000 up to ₹5 Lakhs for expanding units',
      'Tarun: Loans from ₹5 Lakhs up to ₹20 Lakhs for established enterprises',
      '100% collateral-free credit guarantee under Credit Guarantee Fund for Micro Units',
    ],
    eligibility: {
      age: '18 to 65 Years',
      minIncome: 'Viable business turnover track record',
      cibilScore: '650+',
      employmentType: 'Artisans, Small Retailers, Shopkeepers, Repair Shops, Food Processors',
      experience: 'Existing business or viable new business proposal',
    },
    documents: {
      identityProof: ['Aadhaar Card', 'PAN Card', 'Voter ID'],
      incomeProof: ['Last 6 Months Bank Statement', 'Proof of business sales/orders'],
      addressProof: ['Shop establishment certificate / Udyam MSME number'],
      otherDocs: ['Quotation of machinery, tools, or merchandise to be purchased'],
    },
    bankOffers: [
      { bank: 'State Bank of India', code: 'SBI', color: '#1e3a8a', rate: '8.50% - 10.50%', fee: 'Nil', tenure: '5 Yrs', specialPerk: 'Mudra Card provided for daily working capital withdrawals' },
      { bank: 'Bank of Baroda', code: 'BOB', color: '#c2410c', rate: '8.75% - 10.75%', fee: 'Nil', tenure: '5 Yrs', specialPerk: 'Fast processing of Kishore & Tarun files' },
    ],
    processSteps: [
      { step: '01', title: 'Choose Scheme Tier', desc: 'Select Shishu (up to ₹50K), Kishore (₹50K-₹5L), or Tarun (₹5L-₹20L).' },
      { step: '02', title: 'Submit Business Plan', desc: 'Provide details of stock, machinery, or working capital required.' },
      { step: '03', title: 'Bank Verification', desc: 'Branch verification and sanction under Mudra portal guidelines.' },
      { step: '04', title: 'Mudra Account Activation', desc: 'Credit disbursed to your account along with Mudra RuPay Debit Card.' },
    ],
    faqs: [
      { q: 'Is there a Mudra card available for working capital?', a: 'Yes! A Mudra RuPay debit card is issued to withdraw working capital funds from ATMs as and when needed to minimize interest outgo.' },
    ],
  },

  // ─── 9. PMAY HOUSING SCHEME ───
  'pmay': {
    id: 'pmay',
    slug: 'pmay',
    title: 'PMAY Housing Scheme',
    category: 'Affordable Housing Scheme',
    badge: 'Subsidy up to ₹2.67 Lakhs',
    tagline: 'Pradhan Mantri Awas Yojana 2.0.',
    subtitle: 'Government of India housing scheme providing upfront interest subsidy up to ₹2.67 Lakhs on home loans for first-time home buyers in Economically Weaker & Middle-Income Groups.',
    startingRate: '8.35% p.a. (Post Subsidy)',
    rateValue: 8.35,
    maxAmount: 'Up to ₹50 Lakhs',
    maxAmountValue: 5000000,
    maxTenure: 'Up to 20 Years',
    maxTenureYears: 20,
    processingFee: 'Nil for PMAY beneficiaries',
    approvalTime: 'Bank Linked',
    disbursalTime: 'Direct Principal Deduction',
    icon: 'home',
    color: '#0284c7',
    bgLight: '#e0f2fe',
    borderColor: '#bae6fd',
    statCounters: [
      { label: 'Post Subsidy', value: '8.35%', color: '#0284c7' },
      { label: 'Max Tenure', value: '20 Years' },
      { label: 'Direct Subsidy', value: '₹2.67 Lakhs' },
    ],
    keyHighlights: [
      'Upfront interest subsidy of up to ₹2.67 Lakhs credited directly to loan account',
      'Available for purchasing ready-to-move, under-construction, or self-built houses',
      'Mandatory female co-ownership for EWS and LIG categories',
      'Reduced monthly EMI burden right from the first year of repayment',
    ],
    eligibility: {
      age: '21 to 65 Years',
      minIncome: 'EWS (Up to ₹3 Lakhs/yr), LIG (₹3L to ₹6L/yr), MIG (₹6L to ₹18L/yr)',
      cibilScore: '700+',
      employmentType: 'Salaried, Self-Employed, Daily Wage Workers',
      experience: 'Applicant or family must not own a pucca house anywhere in India',
    },
    documents: {
      identityProof: ['Aadhaar Card of all family members', 'PAN Card'],
      incomeProof: ['Income Certificate / Salary Slips / ITR with computation'],
      addressProof: ['Ration Card / Voter ID'],
      otherDocs: ['PMAY Self-Declaration Affidavit confirming first-time home ownership'],
    },
    bankOffers: [
      { bank: 'State Bank of India', code: 'SBI', color: '#1e3a8a', rate: '8.40% - 8.85%', fee: 'Nil', tenure: '20 Yrs', specialPerk: 'Official primary lending institution with fastest CNA claim credit' },
      { bank: 'HDFC Bank', code: 'HDFC', color: '#004c8f', rate: '8.45% - 8.95%', fee: 'Nil', tenure: '20 Yrs', specialPerk: 'Assisted documentation support for PMAY subsidy verification' },
    ],
    processSteps: [
      { step: '01', title: 'Apply for Home Loan with PMAY Flag', desc: 'Declare first-time homebuyer status during loan application.' },
      { step: '02', title: 'Central Nodal Agency (CNA) Verification', desc: 'Bank uploads application to NHB or HUDCO portal for subsidy approval.' },
      { step: '03', title: 'Lump-Sum Subsidy Credit', desc: 'Government transfers subsidy directly into your loan account.' },
      { step: '04', title: 'Reduced Loan Principal & Lower EMI', desc: 'Loan outstanding decreases immediately, reducing your monthly EMI.' },
    ],
    faqs: [
      { q: 'How does the PMAY subsidy work?', a: 'The central government calculates the net present value of the interest subsidy and credits it as a lump-sum into your loan account, immediately reducing your principal.' },
    ],
  },
};

export const ALL_LOANS_LIST: LoanDetail[] = Object.values(ALL_LOANS_DATA);

export function getLoanBySlug(slug?: string): LoanDetail {
  if (!slug) return ALL_LOANS_DATA['personal-loan'];
  const normalized = slug.toLowerCase().trim();
  if (ALL_LOANS_DATA[normalized]) {
    return ALL_LOANS_DATA[normalized];
  }
  // Try matching by alias or title
  const match = ALL_LOANS_LIST.find(
    (l) =>
      l.slug === normalized ||
      l.id === normalized ||
      l.title.toLowerCase().replace(/\s+/g, '-').includes(normalized) ||
      normalized.includes(l.slug)
  );
  return match || ALL_LOANS_DATA['personal-loan'];
}

export const LOAN_CATEGORIES = [
  'All Loans',
  'Popular',
  'Secured Loans',
  'Unsecured Credit',
  'Government Schemes',
] as const;
