"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    TrendingUp,
    CheckCircle2,
    DollarSign,
    Building2,
    Sparkles,
    Briefcase,
    FileText,
    PlusCircle,
    Phone,
    MapPin,
    Clock,
    LogOut,
    Check,
    X,
    Search,
    AlertCircle,
    Loader2,
    CreditCard,
    Shield,
    PieChart,
    Banknote,
    Edit3,
    Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PartnerProfile {
    id: string;
    name: string;
    email: string;
    mobile: string;
    city: string;
    profession?: string;
    companyName?: string;
    location?: string;
    referenceNo: string;
    status: string;
    isActive: boolean;
}

interface PartnerFileItem {
    _id: string;
    referenceNo: string;
    category: "loans" | "cards" | "insurance" | "investments";
    subProduct: string;
    customerName: string;
    customerMobile: string;
    customerEmail?: string;
    customerCity: string;
    bankName: string;
    rmName?: string;
    applicationAmount: number;
    disbursedAmount?: number;
    bankReferenceNo?: string;
    commissionRate: number;
    commissionAmount: number;
    leadStatus: "IN_PROCESS" | "DOCS_SUBMITTED" | "BANK_LOGIN" | "SANCTIONED" | "DISBURSED" | "REJECTED";
    payoutStatus: "PENDING" | "PROCESSED" | "PAID";
    leadNotes?: string;
    disbursedAt?: string;
    createdAt: string;
}

interface CommissionRates {
    loans: number;
    cards: number;
    insurance: number;
    investments: number;
    productRates?: Record<string, number>;
}

const CATEGORY_CONFIG = {
    loans: {
        title: "Loans",
        icon: Banknote,
        color: "text-[#0284c7]",
        bgColor: "bg-sky-50",
        borderColor: "border-sky-200",
        products: [
            "Home Loan",
            "Personal Loan",
            "Business Loan",
            "Loan Against Property (LAP)",
            "Car Loan",
            "Education Loan",
            "Mudra Loan",
            "Balance Transfer"
        ],
        banks: [
            "HDFC Bank",
            "State Bank of India (SBI)",
            "ICICI Bank",
            "Axis Bank",
            "Kotak Mahindra Bank",
            "Bank of Baroda",
            "Punjab National Bank (PNB)",
            "Bajaj Finserv",
            "Tata Capital",
            "Multi-Bank Priority Desk"
        ]
    },
    cards: {
        title: "Credit & Business Cards",
        icon: CreditCard,
        color: "text-[#0284c7]",
        bgColor: "bg-sky-50",
        borderColor: "border-sky-200",
        products: [
            "HDFC Regalia / Millennia",
            "SBI SimplyCLICK / Prime",
            "ICICI Coral / Sapphiro",
            "Axis Bank Magnus / Flipkart",
            "Kotak League Platinum",
            "American Express Platinum",
            "Corporate / Business Card"
        ],
        banks: [
            "HDFC Bank Cards",
            "SBI Card & Payment Services",
            "ICICI Bank Cards",
            "Axis Bank Cards",
            "Kotak Mahindra Cards",
            "IndusInd Bank Cards",
            "Standard Chartered"
        ]
    },
    insurance: {
        title: "Insurance",
        icon: Shield,
        color: "text-purple-400",
        bgColor: "bg-purple-500/15",
        borderColor: "border-purple-500/30",
        products: [
            "Health Insurance (1 Cr Cover)",
            "Term Life Insurance (Zero Cost)",
            "Family Floater Health Plan",
            "Motor / Car Insurance",
            "Commercial Property Insurance",
            "Keyman Insurance"
        ],
        banks: [
            "Star Health & Allied Insurance",
            "HDFC ERGO General Insurance",
            "ICICI Lombard",
            "Care Health Insurance",
            "Niva Bupa Health",
            "Tata AIG General Insurance",
            "Max Life Insurance"
        ]
    },
    investments: {
        title: "Investments & Wealth",
        icon: PieChart,
        color: "text-amber-400",
        bgColor: "bg-amber-500/15",
        borderColor: "border-amber-500/30",
        products: [
            "Mutual Funds SIP / Lumpsum",
            "Corporate Fixed Deposits (8.5%+)",
            "Pre-IPO / Unlisted Shares",
            "Portfolio Management Services (PMS)",
            "Sovereign Gold Bonds (SGB)",
            "Alternative Investment Funds (AIF)"
        ],
        banks: [
            "Nippon India Mutual Fund",
            "HDFC Mutual Fund",
            "SBI Mutual Fund",
            "Bajaj Finance Corporate FD",
            "Mahindra Finance FD",
            "Shriram Finance FD",
            "Direct Wealth Desk"
        ]
    }
};

export default function PartnerDashboardPage() {
    const router = useRouter();

    const [partner, setPartner] = useState<PartnerProfile | null>(null);
    const [files, setFiles] = useState<PartnerFileItem[]>([]);
    const [commissionRates, setCommissionRates] = useState<CommissionRates>({
        loans: 2.0,
        cards: 3.0,
        insurance: 5.0,
        investments: 1.5,
        productRates: {}
    });

    const [metrics, setMetrics] = useState({
        totalLeads: 0,
        totalDisbursed: 0,
        totalCommissionsEarned: 0,
        inProcessCount: 0
    });

    const [loading, setLoading] = useState(true);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [submittingFile, setSubmittingFile] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    // Status Update Modal State
    const [statusModalFile, setStatusModalFile] = useState<PartnerFileItem | null>(null);
    const [newStatus, setNewStatus] = useState<string>("DISBURSED");
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

    // Submission Form State
    const [selectedCategory, setSelectedCategory] = useState<"loans" | "cards" | "insurance" | "investments">("loans");
    const [fileForm, setFileForm] = useState({
        subProduct: "Home Loan",
        customerName: "",
        customerMobile: "",
        customerEmail: "",
        customerCity: "",
        bankName: "HDFC Bank",
        applicationAmount: "",
        bankReferenceNo: "",
        leadNotes: ""
    });

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    // Load Partner Profile, Commission Rates & Submitted Files
    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Check Partner Profile
            const meRes = await fetch("/api/partner/me");
            if (!meRes.ok) {
                router.push("/partner?auth=login");
                return;
            }
            const meData = await meRes.json();
            setPartner(meData.partner);

            // Fetch live dynamic commission rates
            try {
                const ratesRes = await fetch("/api/partner/commission-rates");
                if (ratesRes.ok) {
                    const ratesData = await ratesRes.json();
                    if (ratesData.rates) {
                        setCommissionRates(ratesData.rates);
                    }
                }
            } catch (err) {
                console.error("Failed to load live commission rates", err);
            }

            // Fetch Partner Files
            const filesRes = await fetch("/api/partner/leads");
            if (filesRes.ok) {
                const filesData = await filesRes.json();
                setFiles(filesData.leads || []);
                if (filesData.metrics) {
                    setMetrics(filesData.metrics);
                }
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            router.push("/partner?auth=login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Get current rate for selected category in form
    const getCurrentRate = (cat: "loans" | "cards" | "insurance" | "investments", product: string) => {
        if (commissionRates.productRates && commissionRates.productRates[product]) {
            return commissionRates.productRates[product];
        }
        return commissionRates[cat] || 2.0;
    };

    // Update product dropdown when category changes
    const handleCategoryChange = (cat: "loans" | "cards" | "insurance" | "investments") => {
        setSelectedCategory(cat);
        const config = CATEGORY_CONFIG[cat];
        setFileForm(prev => ({
            ...prev,
            subProduct: config.products[0],
            bankName: config.banks[0]
        }));
    };

    // Submit File
    const handleCreateFile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingFile(true);

        try {
            const res = await fetch("/api/partner/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category: selectedCategory,
                    ...fileForm
                })
            });

            const data = await res.json();
            if (res.ok) {
                showToast("success", "File submitted successfully to Bank / Underwriting Desk! Status: In Process");
                setIsFileModalOpen(false);
                setFileForm({
                    subProduct: CATEGORY_CONFIG.loans.products[0],
                    customerName: "",
                    customerMobile: "",
                    customerEmail: "",
                    customerCity: "",
                    bankName: CATEGORY_CONFIG.loans.banks[0],
                    applicationAmount: "",
                    bankReferenceNo: "",
                    leadNotes: ""
                });
                loadDashboardData();
            } else {
                showToast("error", data.error || "Failed to submit file.");
            }
        } catch {
            showToast("error", "Error submitting file.");
        } finally {
            setSubmittingFile(false);
        }
    };

    // Quick Status Update (e.g. Disbursed)
    const handleUpdateStatus = async () => {
        if (!statusModalFile) return;
        setStatusUpdateLoading(true);

        try {
            const res = await fetch(`/api/partner/leads/${statusModalFile._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadStatus: newStatus
                })
            });

            const data = await res.json();
            if (res.ok) {
                showToast(
                    "success",
                    newStatus === "DISBURSED"
                        ? `🎉 File Marked as DISBURSED! Commission of ₹${data.lead.commissionAmount.toLocaleString("en-IN")} credited to your pipeline!`
                        : `Status updated to ${newStatus}`
                );
                setStatusModalFile(null);
                loadDashboardData();
            } else {
                showToast("error", data.error || "Failed to update status");
            }
        } catch {
            showToast("error", "Error updating file status");
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        await fetch("/api/partner/logout", { method: "POST" });
        router.push("/partner");
    };

    const filteredFiles = files.filter(file => {
        const matchesCategory = categoryFilter === "ALL" || file.category === categoryFilter;
        const matchesStatus = statusFilter === "ALL" || file.leadStatus === statusFilter;
        const matchesSearch =
            searchQuery === "" ||
            file.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.customerMobile.includes(searchQuery) ||
            file.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.subProduct.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesStatus && matchesSearch;
    });

    const activeFormRate = getCurrentRate(selectedCategory, fileForm.subProduct);
    const estimatedCommission = fileForm.applicationAmount && !isNaN(Number(fileForm.applicationAmount))
        ? Math.round(Number(fileForm.applicationAmount) * (activeFormRate / 100))
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-[#0284c7] animate-spin" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Accessing Partner Workstation...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border ${
                            toast.type === "success"
                                ? "bg-emerald-950/90 border-emerald-500 text-sky-900"
                                : "bg-rose-950/90 border-rose-500 text-rose-100"
                        } backdrop-blur-xl`}
                    >
                        {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 text-[#0284c7]" /> : <AlertCircle className="h-5 w-5 text-rose-400" />}
                        <span className="text-sm font-bold">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Partner Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-xl">
                <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <Building2 className="h-6 w-6 text-slate-900" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-black text-lg text-slate-900">
                                    {partner?.companyName || partner?.name}
                                </h1>
                                <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    ✓ Verified Partner
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono">
                                Partner ID: #{partner?.referenceNo} • {partner?.city}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsFileModalOpen(true)}
                            className="bg-[#0284c7] hover:bg-[#0369a1] text-slate-900 font-black h-11 px-5 rounded-xl uppercase tracking-wider text-xs shadow-lg shadow-sky-500/20 cursor-pointer flex items-center gap-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span>Submit New File Info</span>
                        </Button>

                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-700 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
                {/* Partner Welcome Banner */}
                <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0284c7] border border-sky-300 text-xs font-black uppercase tracking-wider">
                            <Sparkles className="h-3.5 w-3.5 text-[#0284c7]" /> Shree Finance Direct DSA Partner Desk
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                            Welcome back, {partner?.name}!
                        </h2>
                        <p className="text-slate-600 text-sm max-w-xl">
                            Submit client files for <strong>Loans, Cards, Insurance, and Investments</strong>. Track status from <strong>In Process</strong> to <strong>Disbursed</strong> and view your commission earnings in real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-200 shrink-0 z-10">
                        <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-[#0284c7]">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Admin Synced Payouts</p>
                            <p className="text-sm font-black text-[#0284c7]">Weekly Direct Bank Transfer</p>
                            <p className="text-[10px] text-slate-500">GST / TDS Compliant Settlement</p>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* DYNAMIC COMMISSION RATES FOR THE 4 OPTIONS (UPDATED BY ADMIN) */}
                {/* ========================================================================= */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#0284c7]" />
                            Active Commission Rate Cards (Updated Live by Admin)
                        </h3>
                        <span className="text-[11px] text-[#0284c7] font-bold bg-sky-50 px-3 py-1 rounded-full border border-sky-300">
                            ● Live Rates Active
                        </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Loans Rate */}
                        <div
                            onClick={() => {
                                handleCategoryChange("loans");
                                setIsFileModalOpen(true);
                            }}
                            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0284c7] transition-all cursor-pointer group shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Loans</span>
                                <div className="p-2 rounded-xl bg-sky-50 text-[#0284c7] group-hover:scale-110 transition-transform">
                                    <Banknote className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-3xl font-black text-black">{commissionRates.loans}%</p>
                                <p className="text-[11px] text-slate-500 mt-1">Home, Personal & Business Loans</p>
                            </div>
                            <div className="mt-3 flex items-center text-[10px] font-black text-[#0284c7] group-hover:translate-x-1 transition-transform">
                                <span>Submit Loan File ➔</span>
                            </div>
                        </div>

                        {/* Cards Rate */}
                        <div
                            onClick={() => {
                                handleCategoryChange("cards");
                                setIsFileModalOpen(true);
                            }}
                            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Cards</span>
                                <div className="p-2 rounded-xl bg-sky-50 text-[#0284c7] group-hover:scale-110 transition-transform">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-3xl font-black text-black">{commissionRates.cards}%</p>
                                <p className="text-[11px] text-slate-500 mt-1">Credit Cards & Corporate Cards</p>
                            </div>
                            <div className="mt-3 flex items-center text-[10px] font-black text-[#0284c7] group-hover:translate-x-1 transition-transform">
                                <span>Submit Card File ➔</span>
                            </div>
                        </div>

                        {/* Insurance Rate */}
                        <div
                            onClick={() => {
                                handleCategoryChange("insurance");
                                setIsFileModalOpen(true);
                            }}
                            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0284c7] transition-all cursor-pointer group shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Insurance</span>
                                <div className="p-2 rounded-xl bg-sky-50 text-[#0284c7] group-hover:scale-110 transition-transform">
                                    <Shield className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-3xl font-black text-black">{commissionRates.insurance}%</p>
                                <p className="text-[11px] text-slate-500 mt-1">Health, Life & Motor Policies</p>
                            </div>
                            <div className="mt-3 flex items-center text-[10px] font-black text-[#0284c7] group-hover:translate-x-1 transition-transform">
                                <span>Submit Insurance File ➔</span>
                            </div>
                        </div>

                        {/* Investments Rate */}
                        <div
                            onClick={() => {
                                handleCategoryChange("investments");
                                setIsFileModalOpen(true);
                            }}
                            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0284c7] transition-all cursor-pointer group shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Investments</span>
                                <div className="p-2 rounded-xl bg-sky-50 text-[#0284c7] group-hover:scale-110 transition-transform">
                                    <PieChart className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-3xl font-black text-black">{commissionRates.investments}%</p>
                                <p className="text-[11px] text-slate-500 mt-1">Mutual Funds, Corporate FDs, Pre-IPO</p>
                            </div>
                            <div className="mt-3 flex items-center text-[10px] font-black text-[#0284c7] group-hover:translate-x-1 transition-transform">
                                <span>Submit Investment File ➔</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pipeline Metrics Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                        <span className="text-slate-500 text-xs font-bold uppercase flex items-center justify-between">
                            Total Files Submitted <FileText className="h-4 w-4 text-slate-500" />
                        </span>
                        <p className="text-3xl font-black text-black">{metrics.totalLeads}</p>
                        <p className="text-[11px] text-slate-500 font-medium">All registered submissions</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                        <span className="text-sky-800 text-xs font-bold uppercase flex items-center justify-between">
                            In Process Files <Clock className="h-4 w-4 text-sky-800" />
                        </span>
                        <p className="text-3xl font-black text-black">{metrics.inProcessCount}</p>
                        <p className="text-[11px] text-slate-500 font-medium">Under active bank review</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[#0284c7] text-xs font-bold uppercase flex items-center justify-between">
                            Total Disbursed Volume <TrendingUp className="h-4 w-4 text-[#0284c7]" />
                        </span>
                        <p className="text-3xl font-black text-black">
                            ₹14,999.79
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                            Successfully disbursed cases
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[#0284c7] text-xs font-bold uppercase flex items-center justify-between">
                            Total Commission Earned <DollarSign className="h-4 w-4 text-[#0284c7]" />
                        </span>
                        <p className="text-3xl font-black text-black">
                            ₹{Number(metrics.totalCommissionsEarned || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">Earned on disbursed files</p>
                    </div>
                </div>

                {/* Submitted Files List & Actions */}
                <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-[#0284c7]" />
                                Your Submitted Files Pipeline & Commission Records
                            </h3>
                            <p className="text-xs text-slate-500">
                                View file progress, update status when bank disburses, and track exact calculated commissions.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 sm:w-60">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search client, bank, ref..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}
                                className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                            >
                                <option value="ALL">All Categories</option>
                                <option value="loans">Loans</option>
                                <option value="cards">Cards</option>
                                <option value="insurance">Insurance</option>
                                <option value="investments">Investments</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="IN_PROCESS">In Process</option>
                                <option value="DOCS_SUBMITTED">Docs Submitted</option>
                                <option value="BANK_LOGIN">Bank Login</option>
                                <option value="SANCTIONED">Sanctioned</option>
                                <option value="DISBURSED">Disbursed</option>
                                <option value="REJECTED">Declined</option>
                            </select>
                        </div>
                    </div>

                    {/* Files Table */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                        {filteredFiles.length === 0 ? (
                            <div className="text-center py-16 space-y-4">
                                <FileText className="h-12 w-12 mx-auto text-slate-600" />
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-slate-900">No files submitted in this filter</h4>
                                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                                        Click &quot;Submit New File Info&quot; above to submit cases for Loans, Cards, Insurance, or Investments to your partner banks.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setIsFileModalOpen(true)}
                                    className="bg-[#0284c7] hover:bg-[#0369a1] text-slate-900 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer"
                                >
                                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> Submit First File Info
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-[#f8fafc]/60 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                                            <th className="py-4 px-5">File Ref / Date</th>
                                            <th className="py-4 px-5">Customer</th>
                                            <th className="py-4 px-5">Category / Product</th>
                                            <th className="py-4 px-5">Bank</th>
                                            <th className="py-4 px-5">RM Name</th>
                                            <th className="py-4 px-5">Filed Amount</th>
                                            <th className="py-4 px-5">Disbursed Amount</th>
                                            <th className="py-4 px-5">Commission Amount</th>
                                            <th className="py-4 px-5">Disbursed Date</th>
                                            <th className="py-4 px-5">Status</th>
                                            <th className="py-4 px-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {filteredFiles.map(file => {
                                            const isDisbursed = file.leadStatus === "DISBURSED";
                                            const catConfig = CATEGORY_CONFIG[file.category] || CATEGORY_CONFIG.loans;

                                            return (
                                                <tr key={file._id} className="hover:bg-slate-100/30 transition-colors">
                                                    <td className="py-4 px-5 align-top">
                                                        <span className="font-mono text-[#0284c7] font-bold block">
                                                            #{file.referenceNo}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                                                            {new Date(file.createdAt).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric"
                                                            })}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        <p className="font-bold text-slate-900">{file.customerName}</p>
                                                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                                            <Phone className="h-3 w-3 text-[#0284c7]" />
                                                            +91 {file.customerMobile}
                                                        </p>
                                                        <p className="text-slate-500 text-[11px] flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {file.customerCity}
                                                        </p>
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase inline-block mb-1 ${catConfig.bgColor} ${catConfig.color} border ${catConfig.borderColor}`}>
                                                            {catConfig.title}
                                                        </span>
                                                        <p className="font-bold text-slate-700">{file.subProduct}</p>
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        <p className="text-[#0284c7] text-[11px] font-bold mt-0.5">
                                                            🏦 {file.bankName}
                                                        </p>
                                                        {file.bankReferenceNo && (
                                                            <p className="text-slate-500 text-[10px] font-mono">
                                                                LAN: {file.bankReferenceNo}
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        <span className="text-slate-900 font-bold text-xs flex items-center gap-1">
                                                            👤 {file.rmName || "Sarvesh Bhoite"}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        <span className="font-black text-sm text-slate-900 block">
                                                            ₹{file.applicationAmount.toLocaleString("en-IN")}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500">
                                                            Filed / Applied
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        {isDisbursed || file.disbursedAmount ? (
                                                            <span className="font-black text-sm text-[#0284c7] block">
                                                                ₹{(file.disbursedAmount || file.applicationAmount).toLocaleString("en-IN")}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 text-[11px] font-medium">—</span>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        <span className="font-black text-[#0284c7] text-sm block">
                                                            ₹{Number(file.commissionAmount || (file.applicationAmount * (file.commissionRate / 100))).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        {file.disbursedAt || isDisbursed ? (
                                                            <span className="text-slate-900 font-bold text-xs flex items-center gap-1">
                                                                <Calendar className="h-3.5 w-3.5 text-[#0284c7]" />
                                                                {file.disbursedAt ? new Date(file.disbursedAt).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }) : new Date(file.createdAt).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                })}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 text-[11px] font-medium">—</span>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-5 align-top">
                                                        {file.leadStatus === "IN_PROCESS" && (
                                                            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-black uppercase">
                                                                In Process
                                                            </span>
                                                        )}
                                                        {file.leadStatus === "DOCS_SUBMITTED" && (
                                                            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase">
                                                                Docs Submitted
                                                            </span>
                                                        )}
                                                        {file.leadStatus === "BANK_LOGIN" && (
                                                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                                                                Bank Login Done
                                                            </span>
                                                        )}
                                                        {file.leadStatus === "SANCTIONED" && (
                                                            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-black uppercase">
                                                                🎉 Sanction Issued
                                                            </span>
                                                        )}
                                                        {isDisbursed && (
                                                            <span className="px-2.5 py-1 rounded-full bg-[#0284c7] text-white text-[10px] font-black uppercase font-black">
                                                                ✅ Disbursed
                                                            </span>
                                                        )}
                                                        {file.leadStatus === "REJECTED" && (
                                                            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase">
                                                                Declined
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-5 align-top text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setStatusModalFile(file);
                                                                setNewStatus(file.leadStatus === "DISBURSED" ? "DISBURSED" : "DISBURSED");
                                                            }}
                                                            className="h-8 px-3 rounded-lg border-[#0284c7]/40 text-[#0284c7] hover:bg-[#0284c7] hover:text-slate-900 font-bold text-xs cursor-pointer"
                                                        >
                                                            <Edit3 className="h-3 w-3 mr-1" /> Update Status
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    {/* Table Footer with Summary Calculations */}
                                    {filteredFiles.length > 0 && (
                                        <tfoot className="border-t-2 border-slate-300 bg-sky-50/70 font-black text-xs">
                                            <tr>
                                                <td colSpan={6} className="py-4 px-5 text-slate-900 font-extrabold text-right uppercase tracking-wider text-[11px]">
                                                    TOTAL SUMMARY:
                                                </td>
                                                <td className="py-4 px-5 bg-sky-100/90 align-top">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">TOTAL DISBURSED / APPLIED</span>
                                                    <span className="font-black text-sm text-[#0284c7] block">
                                                        ₹{filteredFiles.reduce((sum, f) => {
                                                            const amt = Number(f.disbursedAmount) || Number(f.applicationAmount) || 0;
                                                            return sum + amt;
                                                        }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 bg-sky-100/90 align-top">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">TOTAL COMMISSION</span>
                                                    <span className="font-black text-sm text-[#0284c7] block">
                                                        ₹{filteredFiles.reduce((sum, f) => sum + (Number(f.commissionAmount) || (Number(f.disbursedAmount || f.applicationAmount) * ((Number(f.commissionRate) || 2.0) / 100))), 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td colSpan={3} className="py-4 px-5"></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* SUBMIT NEW FILE INFO MODAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {isFileModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f8fafc]/80 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1f2328] border border-slate-300 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                        <PlusCircle className="h-5 w-5 text-[#0284c7]" /> Submit File Info to Bank
                                    </h3>
                                    <p className="text-xs text-slate-500">Directly submit details for Loans, Cards, Insurance, or Investments</p>
                                </div>
                                <button
                                    onClick={() => setIsFileModalOpen(false)}
                                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateFile} className="space-y-5">
                                {/* Category Selection Pills */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500">
                                        Select File Category *
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {(["loans", "cards", "insurance", "investments"] as const).map(cat => {
                                            const config = CATEGORY_CONFIG[cat];
                                            const isSelected = selectedCategory === cat;
                                            const rate = commissionRates[cat] || 2.0;

                                            return (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => handleCategoryChange(cat)}
                                                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                                        isSelected
                                                            ? "bg-[#0284c7]/15 border-[#0284c7] text-slate-900 shadow-lg"
                                                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <config.icon className={`h-4 w-4 ${isSelected ? "text-[#0284c7]" : "text-slate-500"}`} />
                                                        <span className="text-[10px] font-black text-[#0284c7]">{rate}% Comm</span>
                                                    </div>
                                                    <p className="font-bold text-xs mt-1 text-slate-900">{config.title}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Product Type & Bank Submitted To */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-500">Specific Product Type *</label>
                                        <select
                                            value={fileForm.subProduct}
                                            onChange={e => setFileForm({ ...fileForm, subProduct: e.target.value })}
                                            required
                                            className="w-full h-11 bg-[#15171a] border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7]"
                                        >
                                            {CATEGORY_CONFIG[selectedCategory].products.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-500">Bank / Entity Submitted To *</label>
                                        <select
                                            value={fileForm.bankName}
                                            onChange={e => setFileForm({ ...fileForm, bankName: e.target.value })}
                                            required
                                            className="w-full h-11 bg-[#15171a] border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7]"
                                        >
                                            {CATEGORY_CONFIG[selectedCategory].banks.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Customer Acquire Details */}
                                <div className="p-4 rounded-2xl bg-white/95 border border-slate-200 space-y-3">
                                    <p className="text-[11px] font-black text-[#0284c7] uppercase tracking-wider">Client / Borrower Acquire Details</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-500">Client Full Name *</label>
                                            <Input
                                                placeholder="e.g. Rahul Patil"
                                                value={fileForm.customerName}
                                                onChange={e => setFileForm({ ...fileForm, customerName: e.target.value })}
                                                required
                                                className="h-11 rounded-xl font-bold bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 text-xs"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-500">Client Mobile Number *</label>
                                            <Input
                                                type="tel"
                                                maxLength={10}
                                                placeholder="10-digit mobile"
                                                value={fileForm.customerMobile}
                                                onChange={e => setFileForm({ ...fileForm, customerMobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                                                required
                                                className="h-11 rounded-xl font-bold bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 text-xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-500">City / Location *</label>
                                            <Input
                                                placeholder="e.g. Pune, Mumbai, PCMC"
                                                value={fileForm.customerCity}
                                                onChange={e => setFileForm({ ...fileForm, customerCity: e.target.value })}
                                                required
                                                className="h-11 rounded-xl font-bold bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 text-xs"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-500">Bank LAN / Ref # (Optional)</label>
                                            <Input
                                                placeholder="e.g. HDFC-APP-998811"
                                                value={fileForm.bankReferenceNo}
                                                onChange={e => setFileForm({ ...fileForm, bankReferenceNo: e.target.value })}
                                                className="h-11 rounded-xl font-bold bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Application Amount & Live Commission Calculation */}
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-500">Filed / Application Amount (₹) *</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 2500000 (25 Lakhs)"
                                        value={fileForm.applicationAmount}
                                        onChange={e => setFileForm({ ...fileForm, applicationAmount: e.target.value })}
                                        required
                                        className="h-12 rounded-xl font-black text-sm bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
                                    />
                                </div>

                                {/* Live Calculated Commission Preview Card */}
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-sky-300 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-[#0284c7] uppercase font-black tracking-wider">Estimated Payout on Disbursal</p>
                                        <p className="text-xl font-black text-[#0284c7]">
                                            ₹{estimatedCommission.toLocaleString("en-IN")}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            Calculated at {activeFormRate}% commission rate on filed amount
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-full text-xs font-black">
                                        Status: In Process
                                    </span>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-500">Remarks / Specific Notes (Optional)</label>
                                    <Input
                                        placeholder="e.g. 80% LTV sanction requested, urgent login required"
                                        value={fileForm.leadNotes}
                                        onChange={e => setFileForm({ ...fileForm, leadNotes: e.target.value })}
                                        className="h-11 rounded-xl font-bold bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 text-xs"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsFileModalOpen(false)}
                                        className="h-11 px-5 rounded-xl border-slate-300 bg-slate-100 text-slate-900 text-xs cursor-pointer font-bold"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={submittingFile}
                                        className="h-11 px-6 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-slate-900 font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 cursor-pointer flex items-center gap-2"
                                    >
                                        {submittingFile ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Submitting File...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Submit File Info 🚀</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* UPDATE FILE STATUS MODAL (e.g. MARK DISBURSED) */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {statusModalFile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                        <Edit3 className="h-5 w-5 text-[#0284c7]" /> Update File Status
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">File Ref: #{statusModalFile.referenceNo}</p>
                                </div>
                                <button
                                    onClick={() => setStatusModalFile(null)}
                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 font-bold">Client:</span>
                                    <span className="text-slate-900 font-black">{statusModalFile.customerName}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 font-bold">Bank:</span>
                                    <span className="text-[#0284c7] font-bold">{statusModalFile.bankName}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 font-bold">Filed Amount:</span>
                                    <span className="text-slate-900 font-black">₹{statusModalFile.applicationAmount.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-xs border-t border-slate-200 pt-2">
                                    <span className="text-[#0284c7] font-bold">Calculated Commission:</span>
                                    <span className="text-[#0284c7] font-black">
                                        {statusModalFile.commissionRate}% (₹{Number(statusModalFile.commissionAmount || (statusModalFile.applicationAmount * (statusModalFile.commissionRate / 100))).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Select New Status *</label>
                                <select
                                    value={newStatus}
                                    onChange={e => setNewStatus(e.target.value)}
                                    className="w-full h-12 bg-white border border-slate-300 rounded-xl px-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none cursor-pointer"
                                >
                                    <option value="IN_PROCESS">In Process (Under Review)</option>
                                    <option value="DOCS_SUBMITTED">Docs Submitted to Bank</option>
                                    <option value="BANK_LOGIN">Bank Login / Application Generated</option>
                                    <option value="SANCTIONED">Sanction Letter Issued</option>
                                    <option value="DISBURSED">🎉 DISBURSED (Loan Amount Credited by Bank)</option>
                                    <option value="REJECTED">Declined / Closed</option>
                                </select>
                            </div>

                            {newStatus === "DISBURSED" && (
                                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-[#0369a1] font-medium leading-relaxed">
                                    ✓ Marking this file as <strong className="text-slate-900">DISBURSED</strong> will credit <strong className="text-[#0284c7]">₹{Number(statusModalFile.commissionAmount || (statusModalFile.applicationAmount * (statusModalFile.commissionRate / 100))).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> to your active commission earnings balance.
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStatusModalFile(null)}
                                    className="h-11 px-5 rounded-xl border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs cursor-pointer font-bold"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    disabled={statusUpdateLoading}
                                    onClick={handleUpdateStatus}
                                    className="h-11 px-6 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                                >
                                    {statusUpdateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Status"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
