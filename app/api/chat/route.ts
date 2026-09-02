import { NextResponse } from "next/server";

// Comprehensive Shree Finance Knowledge Base & Intelligent Engine
interface ResponsePattern {
    keywords: string[];
    reply: string;
    quickReplies?: string[];
    triggerLeadModal?: boolean;
}

const KNOWLEDGE_BASE: ResponsePattern[] = [
    // Greetings
    {
        keywords: ["hi", "hello", "hey", "namaste", "good morning", "good evening", "start"],
        reply: "Hello! 👋 Welcome to **Shree Finance**. I am your AI Financial Assistant. How can I help you today? You can ask about our loans, interest rates, eligibility, documents, or partner programs!",
        quickReplies: ["Home Loan", "Personal Loan", "Business Loan", "Check Eligibility"]
    },
    // Home Loan
    {
        keywords: ["home loan", "housing loan", "buy flat", "buy house", "property loan", "plot loan", "home"],
        reply: "🏡 **Shree Finance Home Loans**:\n• **Interest Rates:** Starting from **8.35% p.a.**\n• **Tenure:** Up to 30 years\n• **Financing:** Up to 90% of property cost\n• **Partner Banks:** SBI, HDFC, ICICI, YES Bank, Axis Bank, Bank of Baroda\n• **Benefits:** Minimal documentation, quick pre-approval, PMAY subsidy benefits available.",
        quickReplies: ["Home Loan Eligibility", "Documents for Home Loan", "Apply for Home Loan"]
    },
    // Personal Loan
    {
        keywords: ["personal loan", "instant loan", "cash loan", "emergency loan", "medical loan", "wedding loan", "travel loan"],
        reply: "💳 **Instant Personal Loans**:\n• **Interest Rates:** Starting from **10.49% p.a.**\n• **Loan Amount:** ₹50,000 up to ₹40 Lakhs\n• **Disbursal:** Within 24 - 48 hours\n• **Collateral:** Zero collateral or guarantor needed\n• **Tenure:** Flexible 1 to 5 years.",
        quickReplies: ["Personal Loan Eligibility", "Documents Required", "Apply for Personal Loan"]
    },
    // Business Loan / MSME
    {
        keywords: ["business loan", "msme", "working capital", "business", "company loan", "startup", "machinery loan"],
        reply: "💼 **Business & MSME Loans**:\n• **Interest Rates:** Starting from **11.25% p.a.**\n• **Loan Amount:** Up to ₹5 Crores\n• **Collateral-Free:** Options available for qualified businesses & Mudra schemes\n• **Fast Sanctions:** Working capital loans, machinery finance, and term loans.",
        quickReplies: ["Business Loan Docs", "Mudra Scheme Details", "Apply for Business Loan"]
    },
    // Car Loan / Auto Loan
    {
        keywords: ["car loan", "vehicle loan", "auto loan", "bike loan", "four wheeler", "two wheeler"],
        reply: "🚗 **Car & Vehicle Loans**:\n• **Interest Rates:** Starting from **8.75% p.a.**\n• **On-road Funding:** Up to 90% - 100% on select models\n• **Tenure:** Up to 7 years\n• Available for new and certified pre-owned cars.",
        quickReplies: ["Car Loan Eligibility", "Apply for Car Loan", "Compare Rates"]
    },
    // Loan Against Property (LAP)
    {
        keywords: ["loan against property", "lap", "mortgage", "property mortgage"],
        reply: "🏢 **Loan Against Property (LAP)**:\n• **Interest Rates:** Starting from **9.00% p.a.**\n• **Funding:** Up to 70% of market value of residential or commercial property\n• **Tenure:** Up to 15-20 years\n• Great for debt consolidation or large business expansions.",
        quickReplies: ["Calculate LAP EMI", "Apply for LAP", "Required Documents"]
    },
    // Education Loan
    {
        keywords: ["education loan", "study loan", "student loan", "abroad study", "college fee"],
        reply: "🎓 **Education Loans**:\n• **Interest Rates:** Starting from **8.50% p.a.**\n• **Coverage:** Tuition fees, accommodation, living expenses, travel & books\n• **Studies in India & Abroad:** Up to ₹1.5 Crores with moratorium period during course tenure.",
        quickReplies: ["Education Loan Docs", "Apply for Education Loan"]
    },
    // Government Schemes & Mudra / PMAY
    {
        keywords: ["mudra", "pmay", "pradhan mantri", "government scheme", "subsidy", "govt loan"],
        reply: "🏛️ **Government Loan Schemes & Subsidies**:\n• **PMAY (Pradhan Mantri Awas Yojana):** Interest subsidy on home loans for eligible income groups.\n• **PMMY Mudra Loans:** Shishu (up to ₹50k), Kishore (₹50k to ₹5L), and Tarun (₹5L to ₹10L) for micro/small enterprises.\n• Contact our advisor to help you claim subsidies!",
        quickReplies: ["Apply for PMAY", "Apply for Mudra", "Talk to Advisor"]
    },
    // Balance Transfer
    {
        keywords: ["balance transfer", "transfer loan", "lower interest", "reduce emi", "switch loan"],
        reply: "🔄 **Loan Balance Transfer Benefits**:\n• Lower your current interest rate (e.g. from 9.75% to 8.35%)\n• Reduce monthly EMI or tenure\n• Get Top-Up loan up to ₹50 Lakhs at home loan interest rates\n• Potential savings of ₹3 - ₹8 Lakhs over total tenure!",
        quickReplies: ["Calculate Savings", "Apply for Balance Transfer", "Talk to Advisor"]
    },
    // Eligibility & Salary
    {
        keywords: ["eligibility", "how much can i get", "salary", "income", "eligible", "cibil", "credit score"],
        reply: "📊 **Loan Eligibility Quick Rule**:\n• **Credit/CIBIL Score:** 700+ gives best rates (650+ also accepted)\n• **Salary to Loan Ratio:** Typically your total EMIs shouldn't exceed 50% of your net monthly salary (e.g. ₹50k salary qualifies for ₹25k monthly EMI capability ~ approx ₹25-30 Lakhs Home Loan)\n• **Age Criteria:** 21 to 65 years.",
        quickReplies: ["Calculate My EMI", "Check Credit Score", "Apply for Loan"]
    },
    // Documents Required
    {
        keywords: ["document", "documents", "docs", "kyc", "pan", "aadhaar", "paperwork"],
        reply: "📁 **Key Documents Checklist**:\n1. **KYC:** PAN Card, Aadhaar Card, Passport / Driving License\n2. **Salaried:** Last 3-6 months Bank Statements, Last 3 months Salary Slips, Form 16\n3. **Self-Employed:** Last 2-3 years ITR with computation, Balance Sheet, 6-12 months Bank Statements, Business Proof (GST/Shop Act).",
        quickReplies: ["Salaried Checklist", "Self-Employed Checklist", "Apply Online"]
    },
    // Apply / Callback / Contact
    {
        keywords: ["apply", "call", "callback", "contact", "agent", "advisor", "phone", "number", "email", "office", "speak", "talk", "customer care"],
        reply: "📞 **Connect with Shree Finance**:\n• **Email:** shreefinancec@gmail.com\n• **Location:** Direct doorstep assistance & pan-India digital processing.\n• You can click the button below to submit a quick paperless request and our loan manager will call you within 15 minutes!",
        quickReplies: ["Request Callback Now", "Track Loan Status", "Partner With Us"],
        triggerLeadModal: true
    },
    // Partner Program / DSA
    {
        keywords: ["partner", "dsa", "channel partner", "commission", "payout", "earn", "become partner"],
        reply: "🤝 **Become a Shree Finance Partner / DSA**:\n• Earn industry-leading commission payouts (up to 1.5% - 2.5% on disbursed loan amounts)\n• Dedicated CRM dashboard to track your leads & payouts in real-time\n• Instant registration with digital approval.",
        quickReplies: ["Register as Partner", "Partner Login", "Commission Rates"]
    },
    // Track Application Status
    {
        keywords: ["track", "status", "application status", "my loan status", "reference id"],
        reply: "🔍 **Track Your Application**:\nYou can track your live application status anytime using your Registered Mobile Number or Application Reference ID on our **Track Status** page.",
        quickReplies: ["Go to Track Status", "Apply New Loan", "Talk to Support"]
    },
    // Interest Rate General
    {
        keywords: ["interest rate", "rate", "roi", "charges", "fees", "processing fee"],
        reply: "💰 **Current Indicative Interest Rates (2026)**:\n• **Home Loan:** 8.35% – 9.15% p.a.\n• **Loan Against Property:** 9.00% – 10.50% p.a.\n• **Personal Loan:** 10.49% – 14.50% p.a.\n• **Business Loan:** 11.25% – 16.00% p.a.\n• **Car Loan:** 8.75% – 10.00% p.a.\n*Rates vary based on CIBIL score and bank criteria.",
        quickReplies: ["Compare All Loans", "Apply Now", "Eligibility Check"]
    },
    // Thanks / Goodbye
    {
        keywords: ["thank", "thanks", "ok", "okay", "bye", "good", "great", "nice", "helpful"],
        reply: "You're most welcome! 😊 We are always here to help you get the best loan offer with minimal interest. Feel free to ask anytime!",
        quickReplies: ["Apply for Loan", "Home Loan Rates", "Partner With Us"]
    }
];

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const userMessage = (body.message || "").trim();

        if (!userMessage) {
            return NextResponse.json({
                reply: "Please type a question about loans, interest rates, or services!",
                quickReplies: ["Home Loan", "Personal Loan", "Business Loan"]
            });
        }

        const lowerMsg = userMessage.toLowerCase();

        // 1. Direct and multi-word matching
        let bestMatch: ResponsePattern | null = null;
        let maxMatchScore = 0;

        for (const item of KNOWLEDGE_BASE) {
            let score = 0;
            for (const kw of item.keywords) {
                if (lowerMsg.includes(kw)) {
                    // Give extra weight to longer, more specific keywords
                    score += kw.length;
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
                quickReplies: bestMatch.quickReplies || ["Check Eligibility", "Apply Now", "Speak to Advisor"],
                triggerLeadModal: bestMatch.triggerLeadModal || false
            });
        }

        // 2. Intelligent dynamic fallback
        const fallbackReply = `I understand you are asking about "${userMessage}".\n\nAt **Shree Finance**, we offer **Home Loans (from 8.35%)**, **Personal Loans (from 10.49%)**, **Business & MSME Loans (from 11.25%)**, and **Car Loans** with fast digital approvals across top Indian banks.\n\nWould you like to check your eligibility or connect directly with our loan specialist?`;

        return NextResponse.json({
            reply: fallbackReply,
            quickReplies: [
                "Home Loan Details",
                "Personal Loan Details",
                "Business Loan Details",
                "Speak to Loan Advisor"
            ]
        });

    } catch (error) {
        console.error("AI Chat API Error:", error);
        return NextResponse.json(
            {
                reply: "Sorry, I am having trouble processing that right now. Please feel free to apply online or connect with our support team!",
                quickReplies: ["Home Loan", "Personal Loan", "Apply Now"]
            },
            { status: 500 }
        );
    }
}
