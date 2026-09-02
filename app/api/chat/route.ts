import { NextResponse } from "next/server";

// Comprehensive Shree Finance Knowledge Base & Intelligent Processing Engine
interface KnowledgeTopic {
    category: string;
    keywords: string[];
    reply: string;
    quickReplies?: string[];
    triggerLeadModal?: boolean;
}

const PHONE_NUMBER = "+91 88304 34945";
const PHONE_RAW = "8830434945";
const EMAIL = "shreefinancec@gmail.com";
const OFFICE_ADDRESS = "Office No. D/201, Siddhivinayak Angan Society, Behind Shree Ji Pure Veg, Near Navale Bridge, Narhe, Pune, Maharashtra - 411041";
const MAPS_LINK = "https://maps.google.com/?q=Office+No.+D/201,+Siddhivinayak+Angan+Society,+Behind+Shree+Ji+Pure+Veg,+Near+Navale+Bridge,+Narhe,+Pune+-+411041";

const KNOWLEDGE_BASE: KnowledgeTopic[] = [
    // 1. Office Location / Address / Branch / Where are you located
    {
        category: "address_location",
        keywords: [
            "address", "location", "office", "branch", "where are you", "where is office",
            "where located", "city", "pune", "narhe", "navale bridge", "visit", "head office",
            "office address", "google map", "map", "directions", "locate", "place"
        ],
        reply: `📍 **Shree Finance Official Office & Location**:\n\n🏢 **Head Office Address:**\n**Office No. D/201, Siddhivinayak Angan Society,**\nBehind Shree Ji Pure Veg, Near Navale Bridge,\nNarhe, Pune, Maharashtra – 411041\n\n🗺️ **Google Maps Link:** [Click to open Google Maps Directions](${MAPS_LINK})\n\n📞 **Phone:** [**+91 88304 34945**](tel:+918830434945)\n✉️ **Email:** [${EMAIL}](mailto:${EMAIL})\n🕒 **Office Timings:** Monday – Saturday: 9:30 AM – 7:30 PM\n\n*We also provide 100% paperless digital loan sanctions and doorstep document assistance across India!*`,
        quickReplies: ["Get Directions", "Call 88304 34945", "Apply for Loan", "Home Loan Rates"],
        triggerLeadModal: false
    },

    // 2. Direct Contact / Phone Number / Speak to person / Agent / Advisor
    {
        category: "contact_person",
        keywords: [
            "phone", "number", "contact", "mobile", "call", "talk to person", "speak to person",
            "talk to advisor", "speak to advisor", "agent number", "officer", "manager", "human",
            "executive", "customer care", "helpline", "support number", "whatsapp", "call me",
            "give me number", "their number", "his number", "her number", "direct call", "talk"
        ],
        reply: `📞 **Direct Contact Information - Shree Finance**\n\n• **Direct Phone / WhatsApp:** [**+91 88304 34945**](tel:+918830434945)\n• **Official Email:** [${EMAIL}](mailto:${EMAIL})\n• **Office Address:** ${OFFICE_ADDRESS}\n• **Consultation Hours:** Mon – Sat, 9:00 AM – 8:00 PM\n\nYou can call our Senior Loan Officer directly at **88304 34945** or click below to request an instant callback with 100% free consultation!`,
        quickReplies: ["Call 88304 34945", "Office Address", "Request Free Callback", "Home Loan Rates"],
        triggerLeadModal: false
    },

    // 3. Greetings
    {
        category: "greetings",
        keywords: ["hi", "hello", "hey", "namaste", "good morning", "good evening", "good afternoon", "start", "halo", "hii"],
        reply: `Hello! 👋 Welcome to **Shree Finance AI Financial Advisor**.\n\nI can help you with:\n• **Home Loans** (from 8.35%)\n• **Personal Loans** (from 10.49%)\n• **Business & MSME Loans** (from 11.25%)\n• **Car & Vehicle Loans** (from 8.75%)\n• **Office Location / Address** in Narhe, Pune\n• Multi-bank comparison, EMI calculations, and direct contact (**88304 34945**).\n\nWhat loan or financial service are you looking for today?`,
        quickReplies: ["Home Loan (8.35%)", "Personal Loan (10.49%)", "Office Address", "Car Loan (8.75%)", "Call Advisor"]
    },

    // 4. Home Loans (Interest, Amount, Banks, Tenure)
    {
        category: "home_loan",
        keywords: [
            "home loan", "housing loan", "buy flat", "buy house", "property loan", "plot loan",
            "flat purchase", "home construction", "villa loan", "home renovation", "home loan rate",
            "home loan amount", "home loan bank"
        ],
        reply: `🏡 **Shree Finance Home Loans (2026 Overview)**:\n\n• **Interest Rates:** **8.35% – 9.15% p.a.** (special repo-linked concessions available)\n• **Loan Amount:** Up to **₹10 Crores** (Up to 90% of property valuation)\n• **Tenure:** Flexible repayment from **1 to 30 Years**\n• **Partner Banks:** SBI, HDFC Bank, ICICI Bank, YES Bank, Axis Bank, Bank of Baroda, PNB, Kotak Mahindra\n• **Key Benefits:** PMAY interest subsidy support, zero prepayment penalty for floating rates, doorstep assistance.\n\n📞 Need instant loan sanction? Call our specialist at **88304 34945** or visit our office at Narhe, Pune.`,
        quickReplies: ["Home Loan Eligibility", "Documents for Home Loan", "Apply for Home Loan", "Call Advisor (88304 34945)"]
    },

    // 5. Car Loans / Auto Loans (Rates, Amount, Tenure, Banks)
    {
        category: "car_loan",
        keywords: [
            "car loan", "auto loan", "vehicle loan", "bike loan", "four wheeler", "two wheeler",
            "buy car", "used car loan", "new car loan", "ev loan", "electric vehicle"
        ],
        reply: `🚗 **Car & Vehicle Loans (New & Pre-Owned)**:\n\n• **Interest Rates:** Starting from **8.75% – 10.50% p.a.**\n• **Loan Amount:** ₹1 Lakh up to **₹1.5 Crores** (Up to **100% on-road funding** on select models)\n• **Tenure:** Flexible 1 to 7 Years (up to 84 months)\n• **Partner Banks:** HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak Prime, YES Bank\n• **Features:** Minimal documentation, instant digital sanctions, pre-approved top-up offers.\n\n📞 Call our auto finance desk at **88304 34945** for instant on-road quotes!`,
        quickReplies: ["Car Loan Eligibility", "Apply for Car Loan", "Compare Bank Rates", "Call 88304 34945"]
    },

    // 6. Personal Loans (Interest, Instant Cash, Tenure)
    {
        category: "personal_loan",
        keywords: [
            "personal loan", "instant loan", "cash loan", "emergency loan", "medical loan",
            "wedding loan", "travel loan", "urgent money", "quick loan", "fast cash"
        ],
        reply: `💳 **Instant Personal Loans (Collateral-Free)**:\n\n• **Interest Rates:** Starting from **10.49% – 14.50% p.a.**\n• **Loan Amount:** ₹50,000 up to **₹40 Lakhs**\n• **Disbursal Time:** Within **24 to 48 Hours**\n• **Tenure:** 12 to 60 Months (1 – 5 Years)\n• **Security:** 100% collateral-free, zero guarantor needed\n• **Partner Banks & NBFCs:** HDFC, ICICI, Axis, Bajaj Finserv, Tata Capital, IDFC First Bank.\n\n📞 Call our personal loan desk at **88304 34945** for fast disbursement!`,
        quickReplies: ["Personal Loan Eligibility", "Required Documents", "Apply for Personal Loan", "Call Advisor"]
    },

    // 7. Business Loans / MSME / Working Capital
    {
        category: "business_loan",
        keywords: [
            "business loan", "msme", "working capital", "company loan", "startup", "machinery loan",
            "overdraft", "od limit", "cc limit", "gst loan", "trader loan", "commercial loan"
        ],
        reply: `💼 **Business & MSME Loans**:\n\n• **Interest Rates:** Starting from **11.25% – 16.00% p.a.**\n• **Loan Amount:** Up to **₹5 Crores** (Collateral-free options up to ₹50 Lakhs for eligible GST businesses)\n• **Products Available:** Unsecured Business Loans, Machinery / Equipment Finance, Working Capital (OD / CC Limit), Invoice Discounting\n• **Partner Banks:** SBI, HDFC Bank, ICICI Bank, YES Bank, Axis Bank, SIDBI, IndusInd Bank.\n\n📞 Speak directly with our MSME Head at **88304 34945**.`,
        quickReplies: ["Business Loan Docs", "Mudra Scheme", "Apply for Business Loan", "Call Advisor"]
    },

    // 8. Loan Against Property (LAP) / Mortgage Loan
    {
        category: "lap",
        keywords: [
            "loan against property", "lap", "mortgage", "property mortgage", "commercial property loan",
            "residential property mortgage", "industrial plot loan"
        ],
        reply: `🏢 **Loan Against Property (LAP) / Mortgage Loan**:\n\n• **Interest Rates:** Starting from **9.00% – 10.75% p.a.**\n• **Loan Amount:** ₹10 Lakhs up to **₹15 Crores** (Up to **70% of market value**)\n• **Tenure:** Up to **15 – 20 Years**\n• **Eligible Properties:** Self-occupied residential house/flat, commercial shops, office spaces, and industrial plots\n• **Benefits:** Much lower interest rate and EMI compared to personal/business loans.\n\n📞 Get free property valuation advice by calling **88304 34945**.`,
        quickReplies: ["LAP Eligibility", "Apply for LAP", "Documents for LAP", "Call 88304 34945"]
    },

    // 9. Education Loans
    {
        category: "education_loan",
        keywords: [
            "education loan", "study loan", "student loan", "abroad study", "college fee",
            "university loan", "higher studies", "usa study", "uk study", "canada study"
        ],
        reply: `🎓 **Education Loans (India & Abroad Studies)**:\n\n• **Interest Rates:** Starting from **8.50% – 11.25% p.a.**\n• **Loan Amount:** Up to **₹1.5 Crores** for top overseas universities; up to ₹50 Lakhs for India\n• **Moratorium Period:** Course duration + 6 to 12 months grace period before EMI starts\n• **Expenses Covered:** 100% Tuition fees, hostel/living expenses, exam fees, travel, books and laptop.\n\n📞 Reach our education finance team at **88304 34945**.`,
        quickReplies: ["Education Loan Docs", "Apply for Study Loan", "Call 88304 34945"]
    },

    // 10. Government Schemes & Subsidies (PMAY, Mudra, PMEGP)
    {
        category: "govt_schemes",
        keywords: [
            "mudra", "pmay", "pradhan mantri", "government scheme", "subsidy", "govt loan",
            "pmegp", "shishu", "kishore", "tarun", "awas yojana"
        ],
        reply: `🏛️ **Government Loan Schemes & Subsidies Supported**:\n\n1. **PMAY (Pradhan Mantri Awas Yojana):** Up to ₹2.67 Lakhs interest subsidy on home loans for EWS, LIG, and MIG categories.\n2. **PMMY Mudra Loans:**\n   • **Shishu:** Loans up to ₹50,000\n   • **Kishore:** Loans from ₹50,000 to ₹5 Lakhs\n   • **Tarun:** Loans from ₹5 Lakhs to ₹10 Lakhs\n3. **PMEGP / Stand-Up India:** Subsidized project funding for new business ventures.\n\n📞 Let our team help you file subsidy paperwork: **88304 34945**.`,
        quickReplies: ["Apply for PMAY", "Apply for Mudra", "Talk to Advisor (88304 34945)"]
    },

    // 11. Balance Transfer & Top-Up
    {
        category: "balance_transfer",
        keywords: [
            "balance transfer", "transfer loan", "lower interest", "reduce emi", "switch loan",
            "top up", "top-up loan", "takeover"
        ],
        reply: `🔄 **Loan Balance Transfer & Top-Up Facility**:\n\n• Transfer your existing Home / LAP / Business loan from other banks with high rates (e.g. 9.75%+) to **8.35% p.a.**\n• **Reduce monthly EMI** or shorten your loan tenure\n• **Additional Top-Up Loan:** Get up to ₹50 Lakhs instant cash at home loan interest rates\n• **Zero processing fees** offers from select partner banks!\n\n📞 Calculate your exact savings with our advisor: **88304 34945**.`,
        quickReplies: ["Calculate BT Savings", "Apply Balance Transfer", "Call 88304 34945"]
    },

    // 12. Partner Program / DSA Channel Partner (Commission, Earnings)
    {
        category: "partner_program",
        keywords: [
            "partner", "dsa", "channel partner", "commission", "payout", "earn", "become partner",
            "dsa registration", "agent signup", "partner program", "commission rate", "partner login"
        ],
        reply: `🤝 **Join Shree Finance Partner (DSA) Network**:\n\n• **Industry-Leading Commission:** Earn **up to 1.50% – 2.50%** on disbursed loan files!\n• **Dedicated Partner CRM Dashboard:** Submit client leads, track live bank file status, and monitor payout statements.\n• **Digital Onboarding:** Instant registration with zero membership fees.\n• **Multi-Bank File Processing:** One dashboard for 30+ leading partner banks.\n\n📞 Contact our Channel Partner Desk: **88304 34945**.`,
        quickReplies: ["Register as Partner", "Partner Login", "Commission Slabs", "Call 88304 34945"]
    },

    // 13. Documents Required Checklist
    {
        category: "documents",
        keywords: [
            "document", "documents", "docs", "kyc", "pan", "aadhaar", "paperwork", "checklist",
            "proof", "salary slip", "bank statement", "itr"
        ],
        reply: `📁 **Standard Document Checklist for Loan Approval**:\n\n1. **KYC Documents (All Applicants):**\n   • PAN Card, Aadhaar Card, Passport / Voter ID, 2 Passport Photos\n2. **For Salaried Employees:**\n   • Last 3 months Salary Slips\n   • Last 6 months Bank Statement (Salary Account)\n   • Latest Form 16 / 2 Years ITR\n3. **For Self-Employed / Business:**\n   • Last 2-3 Years ITR with Computation of Income & Balance Sheet\n   • Last 12 months Current & Savings Bank Statements\n   • Business Registration Proof (GST Certificate / Shop Act / MSME Udyam)\n4. **For Property Loans:**\n   • Title Deeds, Chain of agreements, Approved sanction plan, NOC.\n\n📞 Have document questions? Call **88304 34945** for doorstep document pickup!`,
        quickReplies: ["Check Eligibility", "Apply for Loan", "Call Advisor (88304 34945)"]
    },

    // 14. Eligibility & CIBIL / Credit Score
    {
        category: "eligibility",
        keywords: [
            "eligibility", "how much can i get", "salary", "income", "eligible", "cibil", "credit score",
            "cibil score", "minimum salary", "low cibil", "bad credit"
        ],
        reply: `📊 **Loan Eligibility & CIBIL Criteria**:\n\n• **Ideal CIBIL Score:** 700 – 850 (Qualifies for lowest interest rates). We also have special programs for scores between 650 – 700.\n• **Salary / FOIR Benchmark:** Fixed Obligation to Income Ratio (FOIR) is kept around 50%-60% of net monthly earnings.\n• **Quick Formula:** If monthly salary is ₹60,000 with no existing loans, you can qualify for approximately **₹35 – ₹42 Lakhs** Home Loan.\n• **Age Range:** 21 years up to 65 years at loan maturity.\n\n📞 Get an accurate multi-bank eligibility calculation today: **88304 34945**.`,
        quickReplies: ["Calculate EMI", "Home Loan Rates", "Personal Loan Rates", "Call 88304 34945"]
    },

    // 15. Partner Banks & Institutions
    {
        category: "banks",
        keywords: [
            "bank", "banks", "sbi", "hdfc", "icici", "axis", "kotak", "yes bank", "bank of baroda",
            "bob", "pnb", "bajaj", "tata capital", "lending partners", "which bank"
        ],
        reply: `🏦 **Shree Finance Official Lending Network (30+ Banks & NBFCs)**:\n\n• **Public Sector Banks:** State Bank of India (SBI), Bank of Baroda (BOB), Punjab National Bank (PNB), Union Bank\n• **Private Sector Banks:** HDFC Bank, ICICI Bank, Axis Bank, YES Bank, Kotak Mahindra Bank, IDFC First Bank, Federal Bank\n• **Premier NBFCs & Housing Finance:** Bajaj Finserv, Tata Capital, Aditya Birla Capital, L&T Finance, Godrej Housing Finance, Piramal Capital.\n\nWe negotiate across all these institutions to secure you the lowest ROI and zero processing fee discounts! 📞 Call **88304 34945**.`,
        quickReplies: ["Compare Bank Rates", "Apply Online", "Call 88304 34945"]
    },

    // 16. All Loan Interest Rates Comparison
    {
        category: "rates_general",
        keywords: [
            "interest rate", "rate", "roi", "charges", "fees", "processing fee", "cost", "rates",
            "compare rate", "all rates", "rate list"
        ],
        reply: `💰 **Live Indicative Interest Rates (Shree Finance 2026)**:\n\n• 🏡 **Home Loan:** **8.35% – 9.15% p.a.**\n• 🚗 **Car / Auto Loan:** **8.75% – 10.50% p.a.**\n• 🏢 **Loan Against Property:** **9.00% – 10.75% p.a.**\n• 💳 **Personal Loan:** **10.49% – 14.50% p.a.**\n• 💼 **Business / MSME Loan:** **11.25% – 16.00% p.a.**\n• 🎓 **Education Loan:** **8.50% – 11.25% p.a.**\n\n*Special festive and CIBIL-linked rate concessions available. Call **88304 34945** for today's best locked-in rate!`,
        quickReplies: ["Home Loan (8.35%)", "Personal Loan (10.49%)", "Car Loan (8.75%)", "Call Advisor"]
    },

    // 17. Track Loan Status
    {
        category: "track_status",
        keywords: ["track", "status", "application status", "my loan status", "reference id", "where is my loan", "check status"],
        reply: `🔍 **Live Application Tracking**:\n\nYou can track your real-time application processing using your **Registered Mobile Number** or **Reference Application ID** directly on our **Track Status** page.\n\n📞 If you need an immediate verbal update on your active file, call our processing team at **88304 34945**.`,
        quickReplies: ["Go to Track Status", "Apply New Loan", "Call Support (88304 34945)"]
    },

    // 18. Appreciation / Gratitude
    {
        category: "thanks",
        keywords: ["thank", "thanks", "thank you", "great", "awesome", "good", "nice", "ok", "okay", "understood", "clear"],
        reply: `You are most welcome! 😊 It is our pleasure to guide you. If you ever have more questions or are ready to apply, feel free to ask here or call our advisor directly at **88304 34945**.\n\nHave a great financial journey with Shree Finance! 🌟`,
        quickReplies: ["Apply for Loan", "Home Loan Rates", "Call 88304 34945"]
    }
];

// Calculation helper for custom loan amounts asked by user
function parseLoanAmountAndType(message: string): { amountText: string; estimatedEmiText?: string } | null {
    const text = message.toLowerCase();
    
    // Look for numbers like 50000, 5 lakh, 50 lakhs, 1 crore, 25l, 50k, 1cr etc.
    const lakhMatch = text.match(/(\d+(\.\d+)?)\s*(lakh|lakhs|lac|lacs|l)/i);
    const croreMatch = text.match(/(\d+(\.\d+)?)\s*(crore|crores|cr)/i);
    const directNumMatch = text.match(/(?:rs\.?|inr|₹)?\s*(\d{4,8})/i);

    let amount = 0;
    let label = "";

    if (croreMatch) {
        amount = parseFloat(croreMatch[1]) * 10000000;
        label = `₹${croreMatch[1]} Crore(s)`;
    } else if (lakhMatch) {
        amount = parseFloat(lakhMatch[1]) * 100000;
        label = `₹${lakhMatch[1]} Lakh(s)`;
    } else if (directNumMatch) {
        amount = parseInt(directNumMatch[1]);
        label = `₹${amount.toLocaleString("en-IN")}`;
    }

    if (amount >= 50000) {
        // Calculate estimated EMIs for standard types
        // Home Loan @ 8.35% for 20 years (240 months)
        const homeMonthlyR = 8.35 / 12 / 100;
        const homeN = 240;
        const homeEmi = Math.round((amount * homeMonthlyR * Math.pow(1 + homeMonthlyR, homeN)) / (Math.pow(1 + homeMonthlyR, homeN) - 1));

        // Personal Loan @ 10.49% for 5 years (60 months)
        const plMonthlyR = 10.49 / 12 / 100;
        const plN = 60;
        const plEmi = Math.round((amount * plMonthlyR * Math.pow(1 + plMonthlyR, plN)) / (Math.pow(1 + plMonthlyR, plN) - 1));

        // Car Loan @ 8.75% for 7 years (84 months)
        const carMonthlyR = 8.75 / 12 / 100;
        const carN = 84;
        const carEmi = Math.round((amount * carMonthlyR * Math.pow(1 + carMonthlyR, carN)) / (Math.pow(1 + carMonthlyR, carN) - 1));

        const emiText = `💰 **Quick Estimated EMI Breakdown for ${label}**:\n\n• 🏡 **Home Loan (8.35%, 20 Yrs):** Approx **₹${homeEmi.toLocaleString("en-IN")} / month**\n• 🚗 **Car Loan (8.75%, 7 Yrs):** Approx **₹${carEmi.toLocaleString("en-IN")} / month**\n• 💳 **Personal Loan (10.49%, 5 Yrs):** Approx **₹${plEmi.toLocaleString("en-IN")} / month**\n\n*Would you like an exact customized quote or balance transfer analysis? Call our loan desk directly at **88304 34945** or visit our Pune office!*`;
        
        return { amountText: label, estimatedEmiText: emiText };
    }

    return null;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const userMessage = (body.message || "").trim();

        if (!userMessage) {
            return NextResponse.json({
                reply: "Please type your question about any loan, interest rates, eligibility, office location, or partner program!",
                quickReplies: ["Home Loan", "Personal Loan", "Office Location", "Car Loan", "Call Advisor (88304 34945)"]
            });
        }

        const lowerMsg = userMessage.toLowerCase();

        // 1. Direct Location / Address detection (Highest Priority for location queries)
        const addressTriggers = [
            "address", "location", "locate", "where are you", "where is your office", "where is office",
            "office address", "branch", "where located", "visit office", "google map", "directions",
            "pune office", "narhe", "navale", "office place"
        ];
        const isAddressQuery = addressTriggers.some(trigger => lowerMsg.includes(trigger));

        if (isAddressQuery) {
            const addressTopic = KNOWLEDGE_BASE.find(k => k.category === "address_location");
            if (addressTopic) {
                return NextResponse.json({
                    reply: addressTopic.reply,
                    quickReplies: addressTopic.quickReplies,
                    triggerLeadModal: false
                });
            }
        }

        // 2. Direct phone / contact inquiry detection
        const contactTriggers = [
            "phone", "number", "contact", "mobile", "call", "talk", "person", "speak",
            "advisor", "agent", "officer", "manager", "human", "executive", "whatsapp",
            "call me", "reach", "tel", "give number", "who to call"
        ];
        const isContactQuery = contactTriggers.some(trigger => lowerMsg.includes(trigger));

        if (isContactQuery) {
            const contactTopic = KNOWLEDGE_BASE.find(k => k.category === "contact_person");
            if (contactTopic) {
                return NextResponse.json({
                    reply: contactTopic.reply,
                    quickReplies: contactTopic.quickReplies,
                    triggerLeadModal: false
                });
            }
        }

        // 3. Specific Loan Amount / EMI calculation request
        const calculationResult = parseLoanAmountAndType(userMessage);
        if (calculationResult && (lowerMsg.includes("emi") || lowerMsg.includes("calculate") || lowerMsg.includes("amount") || lowerMsg.includes("month") || lowerMsg.includes("lakh") || lowerMsg.includes("crore") || lowerMsg.includes("cr"))) {
            return NextResponse.json({
                reply: calculationResult.estimatedEmiText,
                quickReplies: ["Apply for this Amount", "Speak to Advisor (88304 34945)", "Check Eligibility", "Home Loan Rates"]
            });
        }

        // 4. Score-based matching against comprehensive knowledge base
        let bestMatch: KnowledgeTopic | null = null;
        let maxMatchScore = 0;

        for (const item of KNOWLEDGE_BASE) {
            let score = 0;
            for (const kw of item.keywords) {
                if (lowerMsg.includes(kw)) {
                    score += kw.length * (kw.split(" ").length); // Higher weight for multi-word exact matches
                }
            }
            if (score > maxMatchScore) {
                maxMatchScore = score;
                bestMatch = item;
            }
        }

        if (bestMatch && maxMatchScore > 0) {
            return NextResponse.json({
                reply: bestMatch.reply,
                quickReplies: bestMatch.quickReplies || ["Check Eligibility", "Apply Now", "Call 88304 34945"],
                triggerLeadModal: bestMatch.triggerLeadModal || false
            });
        }

        // 5. Fallback: Intelligent comprehensive response with direct contact & location details
        const fallbackReply = `I understand you have a question regarding "${userMessage}".\n\nAt **Shree Finance**, we provide transparent, multi-bank financing solutions across India:\n• **Home Loans** from **8.35% p.a.** (SBI, HDFC, ICICI, YES Bank)\n• **Car Loans** from **8.75% p.a.** (up to 100% on-road funding)\n• **Personal Loans** from **10.49% p.a.** (instant 24-48h disbursal)\n• **Business / MSME Loans** from **11.25% p.a.** (working capital & machinery finance)\n• **Loan Against Property (LAP)** from **9.00% p.a.**\n\n📍 **Office Location:** ${OFFICE_ADDRESS}\n📞 **Phone / WhatsApp:** [**+91 88304 34945**](tel:+918830434945)\n✉️ **Email:** [${EMAIL}](mailto:${EMAIL})\n\nHow would you like to proceed?`;

        return NextResponse.json({
            reply: fallbackReply,
            quickReplies: [
                "Call Advisor (88304 34945)",
                "Office Location",
                "Home Loan Rates",
                "Personal Loan Details",
                "Apply for Loan"
            ]
        });

    } catch (error) {
        console.error("AI Chat API Error:", error);
        return NextResponse.json(
            {
                reply: `Sorry, I encountered an issue processing your request. Please call our senior advisor directly at **+91 88304 34945** or visit our office at **${OFFICE_ADDRESS}**!`,
                quickReplies: ["Call 88304 34945", "Office Location", "Home Loan", "Apply Now"]
            },
            { status: 500 }
        );
    }
}
