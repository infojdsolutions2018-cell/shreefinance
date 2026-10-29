import { Metadata } from "next";
import Link from "next/link";
import { 
    Briefcase, 
    Home, 
    Building2, 
    Car, 
    Landmark, 
    GraduationCap, 
    ArrowRight, 
    CheckCircle2, 
    Zap, 
    ShieldCheck, 
    Percent, 
    FileText,
    Calculator,
    Phone
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "All Loan Products - Shree Finance | Compare 40+ Top Banks",
    description: "Explore Personal Loans, Home Loans, LAP, Car Loans, Business Loans, Education Loans & Government Schemes. Starting rates from 8.35% p.a. with 100% digital paperless approval.",
};

const ALL_LOANS = [
    {
        title: "Personal Loan",
        slug: "personal-loan",
        rate: "10.25% p.a.",
        category: "Unsecured Instant Credit",
        badge: "Approvals in 5 Mins",
        tagline: "Need Instant Funds? Consider It Done.",
        description: "Zero collateral required. Instant paperless sanction up to ₹50 Lakhs directly into your bank account across 40+ partner banks.",
        maxAmount: "Up to ₹50 Lakhs",
        maxTenure: "Up to 5 Years",
        icon: Briefcase,
        color: "text-[#10b981]",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        borderColor: "border-emerald-200 dark:border-emerald-800",
        highlights: [
            "100% paperless digital KYC verification",
            "Zero end-use restrictions",
            "Nil prepayment charges on select banks",
        ],
    },
    {
        title: "Home Loan",
        slug: "home-loan",
        rate: "8.35% p.a.",
        category: "Secured Housing Finance",
        badge: "Lowest Interest Rates",
        tagline: "Low Interest Home Loans Starting 8.35%",
        description: "Buy, construct or transfer your existing home loan across YES Bank, SBI, HDFC, ICICI & Shree Finance Direct with tenures up to 30 years.",
        maxAmount: "Up to ₹10 Crore",
        maxTenure: "Up to 30 Years",
        icon: Home,
        color: "text-[#0284c7]",
        bgColor: "bg-sky-50 dark:bg-sky-950/30",
        borderColor: "border-sky-200 dark:border-sky-800",
        highlights: [
            "Save up to ₹3.5 Lakhs tax under Sec 24(b) & 80C",
            "Home Loan Balance Transfer with rate cut",
            "PMAY 2.0 interest subsidy support",
        ],
    },
    {
        title: "Loan Against Property (LAP)",
        slug: "loan-against-property",
        rate: "9.25% p.a.",
        category: "Mortgage Finance",
        badge: "High LTV up to 75%",
        tagline: "High-Ticket Capital Against Your Property",
        description: "Unlock high-ticket capital against residential, commercial, or industrial properties with low monthly EMIs and tenures up to 20 years.",
        maxAmount: "Up to ₹25 Crore",
        maxTenure: "Up to 20 Years",
        icon: Building2,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950/30",
        borderColor: "border-purple-200 dark:border-purple-800",
        highlights: [
            "Residential, commercial & industrial property accepted",
            "Dropline Overdraft / Term Loan options",
            "Much lower EMI than unsecured business loans",
        ],
    },
    {
        title: "Car Loan",
        slug: "car-loan",
        rate: "8.75% p.a.",
        category: "Auto Financing",
        badge: "100% On-Road Funding",
        tagline: "Drive Home Your Dream Vehicle Today",
        description: "Finance new cars, pre-owned certified vehicles, or electric vehicles with 100% on-road funding, zero fee schemes, and swift 30-min sanctions.",
        maxAmount: "100% On-Road Price",
        maxTenure: "Up to 8 Years",
        icon: Car,
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        borderColor: "border-amber-200 dark:border-amber-800",
        highlights: [
            "Covers vehicle price, insurance & RTO tax",
            "Special 0.25% interest rate discount on EVs",
            "Pre-approved 30-min dealership approval",
        ],
    },
    {
        title: "Business Loan",
        slug: "business-loan",
        rate: "13.99% p.a.",
        category: "MSME & Commercial Capital",
        badge: "Collateral-Free Credit",
        tagline: "Build Your Empire & Scale Growth",
        description: "Collateral-free working capital, machinery term loans, and business credit lines up to ₹75 Lakhs for MSMEs, traders, and manufacturers.",
        maxAmount: "Up to ₹75 Lakhs",
        maxTenure: "Up to 5 Years",
        icon: Landmark,
        color: "text-cyan-600",
        bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
        borderColor: "border-cyan-200 dark:border-cyan-800",
        highlights: [
            "No collateral or hypothecation of business assets",
            "Fast sanction based on GST & bank statements",
            "Section 37(1) tax deductible interest payments",
        ],
    },
    {
        title: "Education Loan",
        slug: "education-loan",
        rate: "9.50% p.a.",
        category: "Higher Education & Studies",
        badge: "Study in India & Abroad",
        tagline: "Invest in Your Future Success",
        description: "Fund 100% of overseas and premier Indian university education costs including tuition, living expenses, books, travel, and student visa fees.",
        maxAmount: "Up to ₹1.5 Crore",
        maxTenure: "Up to 15 Years",
        icon: GraduationCap,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        borderColor: "border-indigo-200 dark:border-indigo-800",
        highlights: [
            "Unsecured loans up to ₹40L for top global universities",
            "Course period + 1-Year repayment moratorium",
            "Section 80E 100% tax deduction on interest paid",
        ],
    },
    {
        title: "Government Schemes",
        slug: "government-schemes",
        rate: "Subsidies & Grants",
        category: "National Subsidized Initiatives",
        badge: "Central Government Grants",
        tagline: "PMAY, Mudra, PMEGP & Stand-Up India",
        description: "Access central government sponsored loan schemes with subsidized interest rates, capital subsidies up to 35%, and credit guarantees by CGTMSE.",
        maxAmount: "Up to ₹5 Crore",
        maxTenure: "Up to 10 Years",
        icon: Landmark,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/30",
        borderColor: "border-orange-200 dark:border-orange-800",
        highlights: [
            "PMAY 2.0 Interest Subsidy up to ₹2.67 Lakhs",
            "PMMY Mudra collateral-free loans up to ₹20 Lakhs",
            "PMEGP 15% to 35% capital subsidy grants",
        ],
    },
];

export default function LoansHubPage() {
    return (
        <div className="pb-24 bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-sans transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden bg-[#f8fafc] dark:bg-[#0b1329] border-b border-slate-200 dark:border-slate-800">
                <div className="container px-4 md:px-6 lg:px-8 mx-auto text-center max-w-4xl space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-50 dark:bg-sky-500/15 px-4 py-1.5 text-xs font-black text-[#0284c7] uppercase tracking-widest">
                        <Zap className="h-4 w-4" />
                        <span>Multi-Bank Loan Aggregator 2026</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                        All Loan Products <br />
                        <span className="text-[#0284c7]">40+ Partner Banks</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Compare interest rates, calculate EMIs, and apply online for pre-approved sanctions across India&apos;s leading lenders. 100% paperless digital verification.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link href="/calculators">
                            <Button className="h-12 px-6 rounded-full bg-sky-50 dark:bg-sky-900/40 text-[#0284c7] hover:bg-sky-100 font-extrabold text-xs uppercase tracking-wider border border-sky-300">
                                <Calculator className="h-4 w-4 mr-2" /> All Calculators
                            </Button>
                        </Link>
                        <a href="tel:+918830434945">
                            <Button className="h-12 px-6 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
                                <Phone className="h-4 w-4 mr-2" /> Speak with Loan Advisor
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* 7 Loan Cards Grid */}
            <section className="container px-4 md:px-6 lg:px-8 mx-auto py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ALL_LOANS.map((loan) => {
                        const Icon = loan.icon;
                        return (
                            <Card 
                                key={loan.slug}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                            >
                                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className={`h-12 w-12 rounded-2xl ${loan.bgColor} border ${loan.borderColor} flex items-center justify-center ${loan.color} shrink-0 group-hover:scale-110 transition-transform`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300 border border-sky-200 dark:border-sky-700 whitespace-nowrap">
                                                {loan.rate}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">{loan.category}</span>
                                            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{loan.title}</h2>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                                {loan.description}
                                            </p>
                                        </div>

                                        {/* Metrics Row */}
                                        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                                            <div>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Max Amount</span>
                                                <span className="font-extrabold text-slate-900 dark:text-white">{loan.maxAmount}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Max Tenure</span>
                                                <span className="font-extrabold text-slate-900 dark:text-white">{loan.maxTenure}</span>
                                            </div>
                                        </div>

                                        {/* Key Highlights */}
                                        <div className="space-y-2 pt-1">
                                            {loan.highlights.map((h, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                    <span className="line-clamp-1">{h}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Link to Dedicated Page */}
                                    <Link href={`/loans/${loan.slug}`} className="w-full">
                                        <Button className="w-full h-11 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                                            View {loan.title} Details <ArrowRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
