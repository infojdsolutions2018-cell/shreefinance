"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Upload,
    Trash2,
    ImagePlus,
    LogOut,
    Loader2,
    CheckCircle2,
    AlertCircle,
    X,
    LayoutDashboard,
    Users,
    Check,
    XCircle,
    Building2,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Briefcase,
    FileText,
    Search,
    Clock,
    RefreshCw,
    Percent,
    DollarSign,
    TrendingUp,
    Shield,
    CreditCard,
    PieChart,
    Banknote,
    Edit3,
    Sparkles,
    Save,
    BookOpen,
    Newspaper,
    Plus,
    Eye
} from "lucide-react";

interface AdminBlog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    coverImage?: string;
    author: string;
    authorRole?: string;
    readTime?: string;
    tags: string[];
    published: boolean;
    views: number;
    createdAt: string;
}

interface Banner {
    id: string;
    imageUrl: string;
    publicId: string;
    title: string;
    link?: string;
    page: string;
    createdAt: string;
}

interface PartnerApplication {
    id: string;
    name: string;
    email: string;
    mobile: string;
    city: string;
    profession?: string;
    companyName?: string;
    location?: string;
    addressProofType?: string;
    fullAddress?: string;
    experienceYears?: string;
    bankAccountType?: string;
    uploadedDocuments?: Record<string, unknown> | string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    isActive: boolean;
    referenceNo: string;
    rejectionReason?: string;
    reviewedAt?: string;
    reviewedBy?: string;
    createdAt: string;
}

interface PartnerSubmittedFile {
    id: string;
    referenceNo: string;
    partnerId: string;
    partnerName: string;
    partnerReferenceNo: string;
    partnerEmail?: string;
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

interface SystemCommissionRates {
    loansCommissionRate: number;
    cardsCommissionRate: number;
    insuranceCommissionRate: number;
    investmentsCommissionRate: number;
    productRates?: Record<string, number>;
}

const PAGE_OPTIONS = [
    { value: "home", label: "Home Page" },
    { value: "personal-loan", label: "Personal Loan" },
    { value: "home-loan", label: "Home Loan" },
    { value: "business-loan", label: "Business Loan" },
    { value: "car-loan", label: "Car Loan" },
    { value: "education-loan", label: "Education Loan" },
    { value: "mudra-loan", label: "Mudra Loan" },
    { value: "pmay", label: "PMAY" },
    { value: "government-schemes", label: "Government Schemes" },
    { value: "credit-cards", label: "Credit Cards" },
    { value: "business-cards", label: "Business Cards" },
    { value: "health-insurance", label: "Health Insurance" },
    { value: "life-insurance", label: "Life Insurance" },
    { value: "vehicle-insurance", label: "Vehicle Insurance" },
    { value: "mutual-funds", label: "Mutual Funds" },
    { value: "stocks", label: "Stocks" },
];

export default function AdminDashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<"partners" | "files" | "rates" | "banners" | "blogs">("files");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // =========================================================================
    // 1. PARTNER APPLICATIONS STATE
    // =========================================================================
    const [partners, setPartners] = useState<PartnerApplication[]>([]);
    const [partnerCounts, setPartnerCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [partnerLoading, setPartnerLoading] = useState(true);
    const [partnerFilter, setPartnerFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
    const [partnerSearch, setPartnerSearch] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<PartnerApplication | null>(null);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [rejectingPartnerId, setRejectingPartnerId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    // =========================================================================
    // 2. PARTNER SUBMITTED FILES (LEADS / PIPELINE) STATE
    // =========================================================================
    const [partnerFiles, setPartnerFiles] = useState<PartnerSubmittedFile[]>([]);
    const [filesMetrics, setFilesMetrics] = useState({
        totalCount: 0,
        inProcessCount: 0,
        disbursedCount: 0,
        totalFiledVolume: 0,
        totalDisbursedVolume: 0,
        totalCommissions: 0,
        pendingPayoutCommissions: 0,
        globalTotalCount: 0,
        globalInProcessCount: 0,
        globalDisbursedCount: 0,
        globalTotalFiledVolume: 0,
        globalTotalDisbursedVolume: 0,
        globalTotalCommissions: 0,
        globalPendingPayoutCommissions: 0
    });
    const [filesLoading, setFilesLoading] = useState(false);
    const [selectedPartnerFilterId, setSelectedPartnerFilterId] = useState<string>("ALL");
    const [fileCategoryFilter, setFileCategoryFilter] = useState("ALL");
    const [fileStatusFilter, setFileStatusFilter] = useState("ALL");
    const [fileStateFilter, setFileStateFilter] = useState("ALL");
    const [fileDistrictFilter, setFileDistrictFilter] = useState("ALL");
    const [fileSearch, setFileSearch] = useState("");
    const [selectedFileItem, setSelectedFileItem] = useState<PartnerSubmittedFile | null>(null);
    const [fileUpdateModalOpen, setFileUpdateModalOpen] = useState(false);
    const [updateFileStatus, setUpdateFileStatus] = useState<string>("IN_PROCESS");
    const [updatePayoutStatus, setUpdatePayoutStatus] = useState<string>("PENDING");
    const [updateCommissionRate, setUpdateCommissionRate] = useState<number>(2.0);
    const [updateDisbursedAmount, setUpdateDisbursedAmount] = useState<number>(0);

    // =========================================================================
    // 3. COMMISSION RATES & SETTINGS STATE
    // =========================================================================
    const [commissionRates, setCommissionRates] = useState<SystemCommissionRates>({
        loansCommissionRate: 2.0,
        cardsCommissionRate: 3.0,
        insuranceCommissionRate: 5.0,
        investmentsCommissionRate: 1.5,
        productRates: {}
    });
    const [ratesSaving, setRatesSaving] = useState(false);

    // =========================================================================
    // 4. BANNERS STATE
    // =========================================================================
    const [banners, setBanners] = useState<Banner[]>([]);
    const [bannerLoading, setBannerLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [page, setPage] = useState("home");
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // =========================================================================
    // 5. BLOGS MANAGEMENT STATE
    // =========================================================================
    const [blogsList, setBlogsList] = useState<AdminBlog[]>([]);
    const [blogsLoading, setBlogsLoading] = useState(false);
    const [blogModalOpen, setBlogModalOpen] = useState(false);
    const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
    const [blogTitle, setBlogTitle] = useState("");
    const [blogExcerpt, setBlogExcerpt] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogCategory, setBlogCategory] = useState("Loans");
    const [blogAuthor, setBlogAuthor] = useState("Shree Finance Advisory Desk");
    const [blogAuthorRole, setBlogAuthorRole] = useState("Senior Financial Research Team");
    const [blogReadTime, setBlogReadTime] = useState("4 min read");
    const [blogTags, setBlogTags] = useState("Loans, Finance, Pune");
    const [blogPublished, setBlogPublished] = useState(true);
    const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
    const [blogImagePreview, setBlogImagePreview] = useState<string | null>(null);
    const [blogCoverImageUrl, setBlogCoverImageUrl] = useState("");
    const [blogSaving, setBlogSaving] = useState(false);
    const [blogDeletingId, setBlogDeletingId] = useState<string | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    // Auth check
    useEffect(() => {
        fetch("/api/admin/me")
            .then((res) => {
                if (!res.ok) throw new Error();
            })
            .catch(() => {
                router.push("/admin/login");
            });
    }, [router]);

    // Handle query param tab / ref search
    useEffect(() => {
        const tabParam = searchParams.get("tab");
        const refParam = searchParams.get("ref");
        if (tabParam === "banners") setActiveTab("banners");
        else if (tabParam === "blogs") setActiveTab("blogs");
        else if (tabParam === "partners") setActiveTab("partners");
        else if (tabParam === "files") setActiveTab("files");
        else if (tabParam === "rates") setActiveTab("rates");

        if (refParam) setPartnerSearch(refParam);
    }, [searchParams]);

    // Fetch Blogs for Admin
    const fetchBlogs = useCallback(async () => {
        setBlogsLoading(true);
        try {
            const res = await fetch("/api/blogs?admin=true");
            if (res.ok) {
                const data = await res.json();
                setBlogsList(data.blogs || []);
            }
        } catch {
            showToast("error", "Failed to fetch blogs");
        } finally {
            setBlogsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "blogs") {
            fetchBlogs();
        }
    }, [activeTab, fetchBlogs]);

    // Fetch Partners
    const fetchPartners = useCallback(async () => {
        setPartnerLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (partnerFilter !== "ALL") queryParams.append("status", partnerFilter);
            if (partnerSearch.trim()) queryParams.append("search", partnerSearch.trim());

            const res = await fetch(`/api/admin/partners?${queryParams.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setPartners(data.partners || []);
                if (data.counts) setPartnerCounts(data.counts);
            }
        } catch (err) {
            console.error("Failed to fetch partner applications", err);
        } finally {
            setPartnerLoading(false);
        }
    }, [partnerFilter, partnerSearch]);

    // Fetch Submitted Partner Files
    const fetchPartnerFiles = useCallback(async () => {
        setFilesLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (selectedPartnerFilterId !== "ALL") queryParams.append("partnerId", selectedPartnerFilterId);
            if (fileCategoryFilter !== "ALL") queryParams.append("category", fileCategoryFilter);
            if (fileStatusFilter !== "ALL") queryParams.append("status", fileStatusFilter);
            if (fileDistrictFilter !== "ALL") queryParams.append("district", fileDistrictFilter);
            if (fileSearch.trim()) queryParams.append("search", fileSearch.trim());

            const res = await fetch(`/api/admin/leads?${queryParams.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setPartnerFiles(data.leads || []);
                if (data.metrics) setFilesMetrics(data.metrics);
            }
        } catch (err) {
            console.error("Failed to fetch partner files", err);
        } finally {
            setFilesLoading(false);
        }
    }, [selectedPartnerFilterId, fileCategoryFilter, fileStatusFilter, fileDistrictFilter, fileSearch]);

    // Fetch Commission Rates
    const fetchCommissionRates = async () => {
        try {
            const res = await fetch("/api/admin/commission-rates");
            if (res.ok) {
                const data = await res.json();
                if (data.settings) setCommissionRates(data.settings);
            }
        } catch (err) {
            console.error("Failed to fetch commission rates", err);
        }
    };

    // Fetch Banners
    const fetchBanners = async () => {
        setBannerLoading(true);
        try {
            const res = await fetch("/api/banners");
            const data = await res.json();
            setBanners(data.banners || []);
        } catch (err) {
            console.error("Failed to fetch banners", err);
        } finally {
            setBannerLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    useEffect(() => {
        if (activeTab === "files") fetchPartnerFiles();
        if (activeTab === "rates") fetchCommissionRates();
        if (activeTab === "banners") fetchBanners();
    }, [activeTab, fetchPartnerFiles]);

    // =========================================================================
    // PARTNER APPROVAL & PASSWORD GENERATION HANDLER
    // =========================================================================
    const handleApprovePartner = async (partnerId: string) => {
        setActionLoadingId(partnerId);
        try {
            const res = await fetch(`/api/admin/partners/${partnerId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "APPROVE" })
            });

            const data = await res.json();
            if (res.ok) {
                showToast("success", "Partner approved! Login credentials & temporary password sent via email.");
                fetchPartners();
                if (selectedPartner?.id === partnerId) {
                    setSelectedPartner(data.partner || { ...selectedPartner, status: "APPROVED", isActive: true });
                }
            } else {
                showToast("error", data.error || "Failed to approve partner.");
            }
        } catch {
            showToast("error", "Error approving partner application.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Rejection Handler
    const handleRejectPartner = async () => {
        if (!rejectingPartnerId) return;

        setActionLoadingId(rejectingPartnerId);
        try {
            const res = await fetch(`/api/admin/partners/${rejectingPartnerId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "REJECT", rejectionReason: rejectionReason.trim() })
            });

            const data = await res.json();
            if (res.ok) {
                showToast("success", "Partner application rejected.");
                setRejectionModalOpen(false);
                setRejectingPartnerId(null);
                fetchPartners();
                if (selectedPartner?.id === rejectingPartnerId) {
                    setSelectedPartner(data.partner || { ...selectedPartner, status: "REJECTED", isActive: false, rejectionReason });
                }
            } else {
                showToast("error", data.error || "Failed to reject partner.");
            }
        } catch {
            showToast("error", "Error rejecting partner application.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Delete Partner
    const handleDeletePartner = async (partnerId: string) => {
        if (!confirm("Are you sure you want to permanently delete this application record?")) return;

        setActionLoadingId(partnerId);
        try {
            const res = await fetch(`/api/admin/partners/${partnerId}`, { method: "DELETE" });
            if (res.ok) {
                showToast("success", "Application record deleted.");
                if (selectedPartner?.id === partnerId) setSelectedPartner(null);
                fetchPartners();
            } else {
                showToast("error", "Failed to delete partner record.");
            }
        } catch {
            showToast("error", "Error deleting partner application.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // =========================================================================
    // PARTNER FILE STATUS UPDATE (ADMIN)
    // =========================================================================
    const handleSaveFileUpdate = async () => {
        if (!selectedFileItem) return;
        setActionLoadingId(selectedFileItem.id);

        try {
            const res = await fetch(`/api/admin/leads/${selectedFileItem.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadStatus: updateFileStatus,
                    payoutStatus: updatePayoutStatus,
                    commissionRate: updateCommissionRate,
                    disbursedAmount: updateDisbursedAmount || selectedFileItem.applicationAmount,
                    applicationAmount: updateDisbursedAmount || selectedFileItem.applicationAmount
                })
            });

            const data = await res.json();
            if (res.ok) {
                showToast("success", "Partner file status & calculated commission updated successfully!");
                setFileUpdateModalOpen(false);
                setSelectedFileItem(null);
                fetchPartnerFiles();
            } else {
                showToast("error", data.error || "Failed to update file.");
            }
        } catch {
            showToast("error", "Error updating partner file.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Delete Partner File
    const handleDeleteFile = async (fileId: string) => {
        if (!confirm("Are you sure you want to delete this file record?")) return;
        try {
            const res = await fetch(`/api/admin/leads/${fileId}`, { method: "DELETE" });
            if (res.ok) {
                showToast("success", "File record deleted.");
                fetchPartnerFiles();
            } else {
                showToast("error", "Failed to delete file.");
            }
        } catch {
            showToast("error", "Error deleting file.");
        }
    };

    // =========================================================================
    // COMMISSION RATES SAVE (ADMIN)
    // =========================================================================
    const handleSaveCommissionRates = async (e: React.FormEvent) => {
        e.preventDefault();
        setRatesSaving(true);
        try {
            const res = await fetch("/api/admin/commission-rates", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(commissionRates)
            });

            const data = await res.json();
            if (res.ok) {
                showToast("success", "Commission rates updated across all partner dashboards!");
                if (data.settings) setCommissionRates(data.settings);
            } else {
                showToast("error", data.error || "Failed to update rates.");
            }
        } catch {
            showToast("error", "Error saving commission rates.");
        } finally {
            setRatesSaving(false);
        }
    };

    // Banner File Select
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Upload Banner
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !title.trim()) {
            showToast("error", "Please select an image and enter a title");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("title", title.trim());
            formData.append("link", link.trim());
            formData.append("page", page);

            const res = await fetch("/api/banners", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");

            showToast("success", "Banner uploaded successfully!");
            setTitle("");
            setLink("");
            setPage("home");
            setPreview(null);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchBanners();
        } catch {
            showToast("error", "Failed to upload banner");
        } finally {
            setUploading(false);
        }
    };

    // Delete Banner
    const handleDeleteBanner = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            showToast("success", "Banner deleted");
            fetchBanners();
        } catch {
            showToast("error", "Failed to delete banner");
        } finally {
            setDeleting(null);
        }
    };

    // =========================================================================
    // BLOG CRUD HANDLERS (ADMIN)
    // =========================================================================
    const handleOpenCreateBlog = () => {
        setEditingBlogId(null);
        setBlogTitle("");
        setBlogExcerpt("");
        setBlogContent("");
        setBlogCategory("Loans");
        setBlogAuthor("Shree Finance Advisory Desk");
        setBlogAuthorRole("Senior Financial Research Team");
        setBlogReadTime("4 min read");
        setBlogTags("Loans, Finance, Pune");
        setBlogPublished(true);
        setBlogImageFile(null);
        setBlogImagePreview(null);
        setBlogCoverImageUrl("");
        setBlogModalOpen(true);
    };

    const handleOpenEditBlog = (blog: AdminBlog) => {
        setEditingBlogId(blog.id);
        setBlogTitle(blog.title);
        setBlogExcerpt(blog.excerpt);
        setBlogContent(blog.content);
        setBlogCategory(blog.category || "Loans");
        setBlogAuthor(blog.author || "Shree Finance Advisory Desk");
        setBlogAuthorRole(blog.authorRole || "Senior Financial Research Team");
        setBlogReadTime(blog.readTime || "4 min read");
        setBlogTags(blog.tags ? blog.tags.join(", ") : "");
        setBlogPublished(blog.published);
        setBlogImageFile(null);
        setBlogImagePreview(null);
        setBlogCoverImageUrl(blog.coverImage || "");
        setBlogModalOpen(true);
    };

    const handleSaveBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blogTitle.trim() || !blogExcerpt.trim() || !blogContent.trim()) {
            showToast("error", "Title, Excerpt, and Article Content are required.");
            return;
        }

        setBlogSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", blogTitle.trim());
            formData.append("excerpt", blogExcerpt.trim());
            formData.append("content", blogContent.trim());
            formData.append("category", blogCategory);
            formData.append("author", blogAuthor.trim());
            formData.append("authorRole", blogAuthorRole.trim());
            formData.append("readTime", blogReadTime.trim());
            formData.append("tags", blogTags.trim());
            formData.append("published", String(blogPublished));
            formData.append("coverImageUrl", blogCoverImageUrl);

            if (blogImageFile) {
                formData.append("image", blogImageFile);
            }

            const url = editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs";
            const method = editingBlogId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                showToast("success", editingBlogId ? "Blog article updated!" : "Blog published successfully!");
                setBlogModalOpen(false);
                fetchBlogs();
            } else {
                showToast("error", data.error || "Failed to save blog post.");
            }
        } catch {
            showToast("error", "Error processing blog request.");
        } finally {
            setBlogSaving(false);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this blog article?")) return;

        setBlogDeletingId(id);
        try {
            const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
            if (res.ok) {
                showToast("success", "Blog article deleted successfully.");
                fetchBlogs();
            } else {
                showToast("error", "Failed to delete blog post.");
            }
        } catch {
            showToast("error", "Error deleting blog post.");
        } finally {
            setBlogDeletingId(null);
        }
    };

    const handleToggleBlogPublish = async (blog: AdminBlog) => {
        try {
            const formData = new FormData();
            formData.append("published", String(!blog.published));

            const res = await fetch(`/api/blogs/${blog.id}`, {
                method: "PATCH",
                body: formData
            });

            if (res.ok) {
                showToast("success", blog.published ? "Blog moved to Drafts." : "Blog published live!");
                fetchBlogs();
            } else {
                showToast("error", "Failed to toggle status.");
            }
        } catch {
            showToast("error", "Error updating publish status.");
        }
    };

    // Logout
    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
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

            {/* Header */}
            <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40">
                <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <LayoutDashboard className="h-6 w-6 text-slate-900" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-black text-slate-900">Shree Finance Admin Desk</h1>
                                <span className="bg-sky-100 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-200 uppercase">
                                    Live Master Portal
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">Partner Approvals • Submitted Files • Dynamic Commissions • Banners</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Tab Switchers */}
                        <div className="hidden lg:flex items-center bg-[#f8fafc]/80 p-1 rounded-xl border border-slate-200">
                            <button
                                onClick={() => setActiveTab("files")}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "files"
                                        ? "bg-[#0284c7] text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <Briefcase className="h-3.5 w-3.5" />
                                <span>User Loan Applications ({filesMetrics.totalCount})</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("partners")}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "partners"
                                        ? "bg-[#0284c7] text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <Users className="h-3.5 w-3.5" />
                                <span>Partner Approvals</span>
                                {partnerCounts.pending > 0 && (
                                    <span className="ml-1 bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                                        {partnerCounts.pending}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("rates")}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "rates"
                                        ? "bg-[#0284c7] text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <Percent className="h-3.5 w-3.5" />
                                <span>Commission Rates</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("banners")}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "banners"
                                        ? "bg-[#0284c7] text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <ImagePlus className="h-3.5 w-3.5" />
                                <span>Banners</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("blogs")}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "blogs"
                                        ? "bg-[#0284c7] text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>Blogs & Articles ({blogsList.length})</span>
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-700 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Mobile / Tablet Tab Switcher */}
                <div className="lg:hidden flex overflow-x-auto gap-2 p-2 bg-[#f8fafc]/60 border-t border-slate-200">
                    <button
                        onClick={() => setActiveTab("partners")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                            activeTab === "partners" ? "bg-[#0284c7] text-white" : "text-slate-500"
                        }`}
                    >
                        Partner Approvals ({partnerCounts.pending})
                    </button>
                    <button
                        onClick={() => setActiveTab("files")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                            activeTab === "files" ? "bg-[#0284c7] text-white" : "text-slate-500"
                        }`}
                    >
                        Submitted Files
                    </button>
                    <button
                        onClick={() => setActiveTab("rates")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                            activeTab === "rates" ? "bg-[#0284c7] text-white" : "text-slate-500"
                        }`}
                    >
                        Commission Rates
                    </button>
                    <button
                        onClick={() => setActiveTab("banners")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                            activeTab === "banners" ? "bg-[#0284c7] text-white" : "text-slate-500"
                        }`}
                    >
                        Banners
                    </button>
                    <button
                        onClick={() => setActiveTab("blogs")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                            activeTab === "blogs" ? "bg-[#0284c7] text-white" : "text-slate-500"
                        }`}
                    >
                        Blogs ({blogsList.length})
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 md:px-6 py-8">
                {/* ========================================================================= */}
                {/* TAB 1: PARTNER APPLICATIONS & APPROVALS */}
                {/* ========================================================================= */}
                {activeTab === "partners" && (
                    <div className="space-y-6">
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                <span className="text-xs font-bold text-slate-500 uppercase">Total Applications</span>
                                <p className="text-3xl font-black text-black">{partnerCounts.total}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                <span className="text-xs font-bold text-amber-600 uppercase">Pending Review</span>
                                <p className="text-3xl font-black text-black">{partnerCounts.pending}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                <span className="text-xs font-bold text-[#0284c7] uppercase">Approved Partners</span>
                                <p className="text-3xl font-black text-black">{partnerCounts.approved}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                <span className="text-xs font-bold text-rose-600 uppercase">Declined</span>
                                <p className="text-3xl font-black text-black">{partnerCounts.rejected}</p>
                            </div>
                        </div>

                        {/* Search & Filter Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setPartnerFilter(status)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            partnerFilter === status
                                                ? "bg-[#0284c7] text-white"
                                                : "bg-white border border-slate-200 text-slate-500 hover:text-slate-900"
                                        }`}
                                    >
                                        {status === "ALL" ? "All" : status}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, phone, ref..."
                                        value={partnerSearch}
                                        onChange={e => setPartnerSearch(e.target.value)}
                                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={fetchPartners}
                                    className="h-10 px-3 bg-white border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${partnerLoading ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Partner List Table */}
                        <div className="bg-white/95 border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                            {partnerLoading ? (
                                <div className="py-20 text-center space-y-3">
                                    <Loader2 className="h-8 w-8 text-[#0284c7] animate-spin mx-auto" />
                                    <p className="text-xs text-slate-500">Loading partner applications...</p>
                                </div>
                            ) : partners.length === 0 ? (
                                <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                                    <Users className="h-10 w-10 mx-auto text-slate-600" />
                                    <p>No partner applications found in this view.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-[#f8fafc]/60 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                                                <th className="py-4 px-5">Ref # / Date</th>
                                                <th className="py-4 px-5">Applicant Details</th>
                                                <th className="py-4 px-5">Company / Profession</th>
                                                <th className="py-4 px-5">City & Address</th>
                                                <th className="py-4 px-5">Status</th>
                                                <th className="py-4 px-5 text-right">Approval Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {partners.map(p => {
                                                const isPending = p.status === "PENDING";
                                                const isApproved = p.status === "APPROVED";
                                                const isRejected = p.status === "REJECTED";
                                                const isLoading = actionLoadingId === p.id;

                                                return (
                                                    <tr key={p.id} className="hover:bg-slate-100/30 transition-colors">
                                                        <td className="py-4 px-5 align-top">
                                                            <span className="font-mono text-[#0284c7] font-bold block">
                                                                #{p.referenceNo}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 block mt-0.5">
                                                                {new Date(p.createdAt).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                })}
                                                            </span>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                                            <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                                                <Mail className="h-3 w-3 text-slate-500" />
                                                                {p.email}
                                                            </p>
                                                            <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                                                <Phone className="h-3 w-3 text-[#0284c7]" />
                                                                +91 {p.mobile}
                                                            </p>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <p className="font-bold text-slate-700">{p.companyName || "Individual DSA"}</p>
                                                            <p className="text-slate-500 text-[11px] mt-0.5">{p.profession}</p>
                                                            {p.experienceYears && (
                                                                <span className="text-[10px] text-slate-500">Exp: {p.experienceYears}</span>
                                                            )}
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <p className="font-bold text-slate-600">{p.city}</p>
                                                            <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{p.fullAddress || p.location || "N/A"}</p>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            {isPending && (
                                                                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                                                                    <Clock className="h-3 w-3" /> Pending
                                                                </span>
                                                            )}
                                                            {isApproved && (
                                                                <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                                                                    <Check className="h-3 w-3" /> Approved
                                                                </span>
                                                            )}
                                                            {isRejected && (
                                                                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                                                                    <X className="h-3 w-3" /> Rejected
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="py-4 px-5 align-top text-right space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setSelectedPartner(p)}
                                                                className="h-8 px-2.5 rounded-lg border-slate-300 bg-slate-100 text-slate-600 hover:text-slate-900 text-xs cursor-pointer"
                                                            >
                                                                View KYC
                                                            </Button>

                                                            {isPending ? (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        disabled={isLoading}
                                                                        onClick={() => handleApprovePartner(p.id)}
                                                                        className="h-8 px-3 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-slate-900 font-black text-xs uppercase cursor-pointer"
                                                                    >
                                                                        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "✓ Approve"}
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled={isLoading}
                                                                        onClick={() => {
                                                                            setRejectingPartnerId(p.id);
                                                                            setRejectionModalOpen(true);
                                                                        }}
                                                                        className="h-8 px-2.5 rounded-lg border-rose-500/40 text-rose-300 hover:bg-rose-950 hover:text-slate-900 text-xs cursor-pointer"
                                                                    >
                                                                        Decline
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDeletePartner(p.id)}
                                                                    className="h-8 px-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                                                                    title="Delete record"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 2: PARTNER SUBMITTED FILES & PIPELINE */}
                {/* ========================================================================= */}
                {activeTab === "files" && (() => {
                    // Compute live dynamic totals from loaded files array
                    const activeDisbursedVolume = filesMetrics.totalDisbursedVolume > 0 
                        ? filesMetrics.totalDisbursedVolume 
                        : partnerFiles.reduce((sum, f) => sum + (f.disbursedAmount || f.applicationAmount || 0), 0);

                    const activeCommissions = filesMetrics.totalCommissions > 0 
                        ? filesMetrics.totalCommissions 
                        : Number(partnerFiles.reduce((sum, f) => sum + (f.commissionAmount || ((f.applicationAmount || 0) * ((f.commissionRate || 2.0) / 100))), 0).toFixed(2));

                    const activeTotalCount = filesMetrics.totalCount > 0 ? filesMetrics.totalCount : partnerFiles.length;
                    const activeInProcessCount = filesMetrics.inProcessCount > 0 ? filesMetrics.inProcessCount : partnerFiles.filter(f => f.leadStatus !== "REJECTED").length;

                    // Find active selected partner if any
                    const currentSelectedPartner = partners.find(p => p.id === selectedPartnerFilterId || p.referenceNo === selectedPartnerFilterId);

                    return (
                        <div className="space-y-6">
                            {/* Partner Selection Dropdown Bar */}
                            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-[#0284c7]" />
                                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                                            Partner File Management & Scope
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Select an individual partner to inspect their personal performance, filed cases, and earned payouts.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <label htmlFor="partnerSelectFilter" className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
                                        Filter Partner:
                                    </label>
                                    <select
                                        id="partnerSelectFilter"
                                        value={selectedPartnerFilterId}
                                        onChange={(e) => setSelectedPartnerFilterId(e.target.value)}
                                        className="h-11 px-4 rounded-xl bg-[#f8fafc] border border-sky-300 text-slate-900 font-bold text-xs focus:ring-2 focus:ring-[#0284c7] focus:outline-none w-full md:w-80 cursor-pointer"
                                    >
                                        <option value="ALL">🌐 All Partners ({partners.length} registered partners)</option>
                                        {partners.map(p => (
                                            <option key={p.id} value={p.id}>
                                                👤 {p.name} ({p.referenceNo}) • {p.city || "India"}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedPartnerFilterId !== "ALL" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedPartnerFilterId("ALL")}
                                            className="h-11 px-3 border-slate-300 bg-slate-100 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                                        >
                                            Reset
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Active Selected Partner Header Card (Shown when a partner is selected) */}
                            {currentSelectedPartner && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284c7] font-black text-lg">
                                                {currentSelectedPartner.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-black text-slate-900">{currentSelectedPartner.name}</h3>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-[#0284c7] border border-sky-200">
                                                        #{currentSelectedPartner.referenceNo}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                        currentSelectedPartner.status === "APPROVED"
                                                            ? "bg-sky-50 text-[#0284c7] border border-sky-300"
                                                            : "bg-amber-50 text-amber-800 border border-amber-300"
                                                    }`}>
                                                        {currentSelectedPartner.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-slate-400" /> {currentSelectedPartner.email}</span>
                                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-slate-400" /> +91 {currentSelectedPartner.mobile}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> {currentSelectedPartner.city || "Location N/A"}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Partner Total Payout</span>
                                            <p className="text-2xl font-black text-black">
                                                ₹{activeCommissions.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                        <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-slate-200">
                                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Profession</span>
                                            <span className="text-slate-900 font-bold">{currentSelectedPartner.profession || "DSA / Loan Agent"}</span>
                                        </div>
                                        <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-slate-200">
                                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Company / Agency</span>
                                            <span className="text-slate-900 font-bold">{currentSelectedPartner.companyName || "Independent Partner"}</span>
                                        </div>
                                        <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-slate-200">
                                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Account Type</span>
                                            <span className="text-slate-900 font-bold">{currentSelectedPartner.bankAccountType || "Savings / Current"}</span>
                                        </div>
                                        <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-slate-200">
                                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Registration Date</span>
                                            <span className="text-slate-900 font-bold">
                                                {currentSelectedPartner.createdAt ? new Date(currentSelectedPartner.createdAt).toLocaleDateString("en-IN") : "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Files Overview Metrics (Dynamic according to partner selection) */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase">
                                        {selectedPartnerFilterId === "ALL" ? "Total Files Filed" : "Partner Filed Files"}
                                    </span>
                                    <p className="text-3xl font-black text-black">{activeTotalCount}</p>
                                    <p className="text-[10px] text-slate-500">Volume: ₹{(activeDisbursedVolume / 100000).toFixed(1)}L</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                    <span className="text-xs font-bold text-sky-800 uppercase">In Process Cases</span>
                                    <p className="text-3xl font-black text-black">{activeInProcessCount}</p>
                                    <p className="text-[10px] text-slate-500">Active in bank underwriting</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                    <span className="text-xs font-bold text-[#0284c7] uppercase">Total Disbursed</span>
                                    <p className="text-3xl font-black text-black">
                                        {activeDisbursedVolume >= 100000 
                                            ? `₹${(activeDisbursedVolume / 100000).toFixed(2)} Lakhs` 
                                            : `₹${activeDisbursedVolume.toLocaleString("en-IN")}`
                                        }
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-bold">
                                        Exact: ₹{activeDisbursedVolume.toLocaleString("en-IN")} • {partnerFiles.length} cases
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                    <span className="text-xs font-bold text-[#0284c7] uppercase">Total Commissions</span>
                                    <p className="text-3xl font-black text-black">
                                        ₹{activeCommissions.toLocaleString("en-IN")}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-bold">
                                        Calculated from active cases
                                    </p>
                                </div>
                            </div>

                            {/* Search & Category Filter */}
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    {(["ALL", "loans", "cards", "insurance", "investments"] as const).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFileCategoryFilter(cat)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer uppercase ${
                                                fileCategoryFilter === cat
                                                    ? "bg-[#0284c7] text-white"
                                                    : "bg-white border border-slate-200 text-slate-500 hover:text-slate-900"
                                            }`}
                                        >
                                            {cat === "ALL" ? "All Categories" : cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                    {/* State Filter */}
                                    <select
                                        value={fileStateFilter}
                                        onChange={e => {
                                            const stateVal = e.target.value;
                                            setFileStateFilter(stateVal);
                                            if (stateVal === "ALL") {
                                                setFileDistrictFilter("ALL");
                                            }
                                        }}
                                        className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] cursor-pointer"
                                    >
                                        <option value="ALL">📍 All States</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Delhi">Delhi NCR</option>
                                    </select>

                                    {/* District Filter (e.g. Pune, Mumbai, Thane, etc.) */}
                                    <select
                                        value={fileDistrictFilter}
                                        onChange={e => setFileDistrictFilter(e.target.value)}
                                        className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] cursor-pointer"
                                    >
                                        <option value="ALL">🏛️ All Districts</option>
                                        <option value="Pune">📍 Pune District</option>
                                        <option value="Mumbai">📍 Mumbai City</option>
                                        <option value="Thane">📍 Thane</option>
                                        <option value="Nagpur">📍 Nagpur</option>
                                        <option value="Nashik">📍 Nashik</option>
                                        <option value="Satara">📍 Satara</option>
                                        <option value="Kolhapur">📍 Kolhapur</option>
                                        <option value="Solapur">📍 Solapur</option>
                                        <option value="Ahmednagar">📍 Ahmednagar</option>
                                    </select>

                                    <select
                                        value={fileStatusFilter}
                                        onChange={e => setFileStatusFilter(e.target.value)}
                                        className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] cursor-pointer"
                                    >
                                        <option value="ALL">All File Statuses</option>
                                        <option value="IN_PROCESS">In Process</option>
                                        <option value="DOCS_SUBMITTED">Docs Submitted</option>
                                        <option value="BANK_LOGIN">Bank Login</option>
                                        <option value="SANCTIONED">Sanctioned</option>
                                        <option value="DISBURSED">Disbursed</option>
                                        <option value="REJECTED">Declined</option>
                                    </select>

                                    <div className="relative flex-1 sm:w-56">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Search partner, bank, client..."
                                            value={fileSearch}
                                            onChange={e => setFileSearch(e.target.value)}
                                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                                        />
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={fetchPartnerFiles}
                                        className="h-10 px-3 bg-white border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                                    >
                                        <RefreshCw className={`h-3.5 w-3.5 ${filesLoading ? "animate-spin" : ""}`} />
                                    </Button>
                                </div>
                            </div>

                        {/* Files Table */}
                        <div className="bg-white/95 border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                            {filesLoading ? (
                                <div className="py-20 text-center space-y-3">
                                    <Loader2 className="h-8 w-8 text-[#0284c7] animate-spin mx-auto" />
                                    <p className="text-xs text-slate-500">Loading partner submitted files...</p>
                                </div>
                            ) : partnerFiles.length === 0 ? (
                                <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                                    <Briefcase className="h-10 w-10 mx-auto text-slate-600" />
                                    <p>No submitted files found in this filter.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-[#f8fafc]/60 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                                                <th className="py-4 px-5">File Ref / Partner</th>
                                                <th className="py-4 px-5">Customer</th>
                                                <th className="py-4 px-5">Category / Product</th>
                                                <th className="py-4 px-5">Bank</th>
                                                <th className="py-4 px-5">RM Name</th>
                                                <th className="py-4 px-5">Loan / Disbursed Amount</th>
                                                <th className="py-4 px-5">Commission Amount</th>
                                                <th className="py-4 px-5">Date (Applied / Disbursed)</th>
                                                <th className="py-4 px-5">Status</th>
                                                <th className="py-4 px-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {partnerFiles.map(file => {
                                                const isDisbursed = file.leadStatus === "DISBURSED";

                                                return (
                                                    <tr key={file.id} className="hover:bg-slate-100/30 transition-colors">
                                                        <td className="py-4 px-5 align-top">
                                                            <span className="font-mono text-[#0284c7] font-bold block">
                                                                #{file.referenceNo}
                                                            </span>
                                                            <p className="text-slate-900 font-bold text-xs mt-0.5">{file.partnerName}</p>
                                                            <span className="text-[10px] text-slate-500 font-mono">#{file.partnerReferenceNo}</span>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <p className="font-bold text-slate-900 text-sm">{file.customerName}</p>
                                                            {file.customerEmail && (
                                                                <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                                                    <Mail className="h-3 w-3 text-slate-500" />
                                                                    {file.customerEmail}
                                                                </p>
                                                            )}
                                                            <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                                                <Phone className="h-3 w-3 text-[#0284c7]" />
                                                                +91 {file.customerMobile}
                                                            </p>
                                                            <p className="text-slate-500 text-[11px]">{file.customerCity}</p>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-sky-800 border border-slate-300 inline-block mb-1">
                                                                {file.category}
                                                            </span>
                                                            <p className="font-bold text-slate-700">{file.subProduct}</p>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <span className="text-slate-900 font-bold text-xs flex items-center gap-1">
                                                                🏦 {file.bankName}
                                                            </span>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <span className="text-slate-900 font-bold text-xs flex items-center gap-1">
                                                                👤 {file.rmName || "Sarvesh Bhoite"}
                                                            </span>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <span className="font-black text-sm text-slate-900 block">
                                                                ₹{(file.disbursedAmount || file.applicationAmount || 0).toLocaleString("en-IN")}
                                                            </span>
                                                            {isDisbursed ? (
                                                                <span className="text-[10px] text-emerald-600 font-bold block">
                                                                    Disbursed
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] text-slate-500 font-medium block">
                                                                    Applied Amount
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <span className="font-black text-[#0284c7] text-sm block">
                                                                ₹{Number(file.commissionAmount || (file.applicationAmount * (file.commissionRate / 100))).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 font-medium block">
                                                                Rate: {file.commissionRate || 2.0}%
                                                            </span>
                                                        </td>

                                                        <td className="py-4 px-5 align-top">
                                                            <span className="text-slate-900 font-bold text-xs flex items-center gap-1">
                                                                <Calendar className="h-3.5 w-3.5 text-[#0284c7]" />
                                                                {file.disbursedAt
                                                                    ? new Date(file.disbursedAt).toLocaleDateString("en-IN", {
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        year: "numeric"
                                                                    })
                                                                    : new Date(file.createdAt || Date.now()).toLocaleDateString("en-IN", {
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        year: "numeric"
                                                                    })
                                                                }
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 block">
                                                                {file.disbursedAt ? "Disbursed Date" : "Applied Date"}
                                                            </span>
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
                                                                    Sanction Issued
                                                                </span>
                                                            )}
                                                            {isDisbursed && (
                                                                <span className="px-2.5 py-1 rounded-full bg-[#0284c7] text-white text-[10px] font-black uppercase">
                                                                    ✅ Disbursed
                                                                </span>
                                                            )}
                                                            {file.leadStatus === "REJECTED" && (
                                                                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase">
                                                                    Declined
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="py-4 px-5 align-top text-right space-x-1.5">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedFileItem(file);
                                                                    setUpdateFileStatus(file.leadStatus);
                                                                    setUpdatePayoutStatus(file.payoutStatus || "PENDING");
                                                                    setUpdateCommissionRate(file.commissionRate || 2.0);
                                                                    setUpdateDisbursedAmount(file.disbursedAmount || file.applicationAmount || 0);
                                                                    setFileUpdateModalOpen(true);
                                                                }}
                                                                className="h-8 px-2.5 rounded-lg border-slate-300 bg-slate-100 text-slate-600 hover:text-slate-900 text-xs cursor-pointer"
                                                            >
                                                                <Edit3 className="h-3 w-3 mr-1" /> Edit / Status
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDeleteFile(file.id)}
                                                                className="h-8 px-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        {/* Table Footer with Summary Calculations */}
                                        {partnerFiles.length > 0 && (
                                            <tfoot className="border-t-2 border-slate-300 bg-sky-50/70 font-black text-xs">
                                                <tr>
                                                    <td colSpan={5} className="py-4 px-5 text-slate-900 font-extrabold text-right uppercase tracking-wider text-[11px]">
                                                        TOTAL SUMMARY:
                                                    </td>
                                                    <td className="py-4 px-5 bg-sky-100/90 align-top">
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">TOTAL DISBURSED / APPLIED</span>
                                                        <span className="font-black text-sm text-[#0284c7] block">
                                                            ₹{partnerFiles.reduce((sum, f) => {
                                                                const amt = Number(f.disbursedAmount) || Number(f.applicationAmount) || 0;
                                                                return sum + amt;
                                                            }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5 bg-sky-100/90 align-top">
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">TOTAL COMMISSION</span>
                                                        <span className="font-black text-sm text-[#0284c7] block">
                                                            ₹{partnerFiles.reduce((sum, f) => sum + (Number(f.commissionAmount) || ((Number(f.disbursedAmount || f.applicationAmount || 0)) * ((Number(f.commissionRate) || 2.0) / 100))), 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    );
                })()}

                {/* ========================================================================= */}
                {/* TAB 3: COMMISSION RATES & SETTINGS */}
                {/* ========================================================================= */}
                {activeTab === "rates" && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-xl">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                        <Percent className="h-5 w-5 text-[#0284c7]" /> Master Partner Commission Rates Configuration
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Rates defined here will dynamically update across all partner dashboards, file submission calculations, and disbursal payouts.
                                    </p>
                                </div>
                                <span className="text-xs font-black text-[#0284c7] bg-sky-50 px-3 py-1 rounded-full border border-sky-300">
                                    Instant Sync
                                </span>
                            </div>

                            <form onSubmit={handleSaveCommissionRates} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Loans Rate */}
                                    <div className="p-5 rounded-2xl bg-[#f8fafc]/60 border border-sky-200 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-[#0284c7] uppercase flex items-center gap-1.5">
                                                <Banknote className="h-4 w-4" /> 1. Loans Commission Rate (%)
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">Default: 2.0%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.05"
                                                value={commissionRates.loansCommissionRate}
                                                onChange={e => setCommissionRates({ ...commissionRates, loansCommissionRate: parseFloat(e.target.value) || 0 })}
                                                className="w-full h-12 bg-white border border-slate-300 rounded-xl px-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-[#0284c7]"
                                                required
                                            />
                                            <span className="text-lg font-black text-slate-500">%</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">Applied to Home Loans, Personal Loans, Business Loans & LAP</p>
                                    </div>

                                    {/* Cards Rate */}
                                    <div className="p-5 rounded-2xl bg-[#f8fafc]/60 border border-sky-200 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-[#0284c7] uppercase flex items-center gap-1.5">
                                                <CreditCard className="h-4 w-4" /> 2. Cards Commission Rate (%)
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">Default: 3.0%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.05"
                                                value={commissionRates.cardsCommissionRate}
                                                onChange={e => setCommissionRates({ ...commissionRates, cardsCommissionRate: parseFloat(e.target.value) || 0 })}
                                                className="w-full h-12 bg-white border border-slate-300 rounded-xl px-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-sky-500"
                                                required
                                            />
                                            <span className="text-lg font-black text-slate-500">%</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">Applied to Retail & Corporate Credit Cards</p>
                                    </div>

                                    {/* Insurance Rate */}
                                    <div className="p-5 rounded-2xl bg-[#f8fafc]/60 border border-purple-500/30 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-purple-400 uppercase flex items-center gap-1.5">
                                                <Shield className="h-4 w-4" /> 3. Insurance Commission Rate (%)
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">Default: 5.0%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.05"
                                                value={commissionRates.insuranceCommissionRate}
                                                onChange={e => setCommissionRates({ ...commissionRates, insuranceCommissionRate: parseFloat(e.target.value) || 0 })}
                                                className="w-full h-12 bg-white border border-slate-300 rounded-xl px-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-purple-500"
                                                required
                                            />
                                            <span className="text-lg font-black text-slate-500">%</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">Applied to Health, Life, and Vehicle Insurance policies</p>
                                    </div>

                                    {/* Investments Rate */}
                                    <div className="p-5 rounded-2xl bg-[#f8fafc]/60 border border-amber-500/30 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-amber-400 uppercase flex items-center gap-1.5">
                                                <PieChart className="h-4 w-4" /> 4. Investments Commission Rate (%)
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">Default: 1.5%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.05"
                                                value={commissionRates.investmentsCommissionRate}
                                                onChange={e => setCommissionRates({ ...commissionRates, investmentsCommissionRate: parseFloat(e.target.value) || 0 })}
                                                className="w-full h-12 bg-white border border-slate-300 rounded-xl px-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-amber-500"
                                                required
                                            />
                                            <span className="text-lg font-black text-slate-500">%</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">Applied to Mutual Funds, Corporate Fixed Deposits & Pre-IPO</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                                    <Button
                                        type="submit"
                                        disabled={ratesSaving}
                                        className="h-12 px-8 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-slate-900 font-black text-xs uppercase tracking-wider cursor-pointer shadow-xl shadow-sky-500/20 flex items-center gap-2"
                                    >
                                        {ratesSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Updating Global Rates...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                <span>Save & Push Rates to All Partner Dashboards</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 4: BANNER MANAGEMENT */}
                {/* ========================================================================= */}
                {activeTab === "banners" && (
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Upload Form */}
                        <div className="lg:col-span-1 bg-white/95 border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xl">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <ImagePlus className="h-5 w-5 text-[#0284c7]" /> Upload Dynamic Banner
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Upload high-res promotional banners for any page</p>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Banner Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Lowest Home Loan 8.35%"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        required
                                        className="w-full h-11 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Target Page *</label>
                                    <select
                                        value={page}
                                        onChange={e => setPage(e.target.value)}
                                        className="w-full h-11 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                                    >
                                        {PAGE_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500">CTA Link (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. /home-loan"
                                        value={link}
                                        onChange={e => setLink(e.target.value)}
                                        className="w-full h-11 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500">Banner Image (JPG, PNG, WebP) *</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 hover:border-[#0284c7] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#f8fafc]/60 space-y-2"
                                    >
                                        {preview ? (
                                            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden">
                                                <Image src={preview} alt="Preview" fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="py-4 space-y-2">
                                                <Upload className="h-8 w-8 mx-auto text-slate-500" />
                                                <p className="text-xs text-slate-500">Click to select banner image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={uploading || !selectedFile || !title.trim()}
                                    className="w-full h-12 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-slate-900 font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-sky-500/20"
                                >
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Upload Banner"}
                                </Button>
                            </form>
                        </div>

                        {/* Banner Grid */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-900">Active Banners ({banners.length})</h3>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={fetchBanners}
                                    className="h-8 px-3 bg-white border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                                >
                                    <RefreshCw className={`h-3 w-3 ${bannerLoading ? "animate-spin" : ""}`} />
                                </Button>
                            </div>

                            {banners.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 bg-white/40 rounded-3xl border border-slate-200 text-xs">
                                    No banners uploaded yet.
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {banners.map(banner => (
                                        <div
                                            key={banner.id}
                                            className="bg-white/95 border border-slate-200 rounded-2xl overflow-hidden shadow-lg space-y-3 p-3 group"
                                        >
                                            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#f8fafc]">
                                                <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                                                <button
                                                    onClick={() => handleDeleteBanner(banner.id)}
                                                    disabled={deleting === banner.id}
                                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 cursor-pointer transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs truncate">{banner.title}</p>
                                                <p className="text-[10px] text-[#0284c7] uppercase font-black">Page: {banner.page}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 5: BLOGS & ARTICLES MANAGEMENT */}
                {/* ========================================================================= */}
                {activeTab === "blogs" && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-[#0284c7]" />
                                    Financial Blogs & Guides Desk
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    Publish loan guides, CIBIL insights, banking updates, and financial advice for Shree Finance readers.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={fetchBlogs}
                                    className="h-11 px-3 bg-white border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
                                >
                                    <RefreshCw className={`h-4 w-4 ${blogsLoading ? "animate-spin" : ""}`} />
                                </Button>

                                <Button
                                    onClick={handleOpenCreateBlog}
                                    className="h-11 px-5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create New Article
                                </Button>
                            </div>
                        </div>

                        {blogsLoading ? (
                            <div className="py-20 text-center space-y-3 bg-white border border-slate-200 rounded-3xl p-12">
                                <Loader2 className="h-8 w-8 text-[#0284c7] animate-spin mx-auto" />
                                <p className="text-xs font-bold text-slate-500">Loading blog articles...</p>
                            </div>
                        ) : blogsList.length === 0 ? (
                            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-12 space-y-4">
                                <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
                                <h3 className="text-base font-black text-slate-900">No Articles Created Yet</h3>
                                <p className="text-xs text-slate-500 max-w-md mx-auto">
                                    Start building your brand authority by creating helpful financial guides and tips for loan applicants.
                                </p>
                                <Button
                                    onClick={handleOpenCreateBlog}
                                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl"
                                >
                                    Create First Article
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogsList.map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Blog Thumbnail */}
                                            <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                                                {blog.coverImage ? (
                                                    <Image
                                                        src={blog.coverImage}
                                                        alt={blog.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-900 to-slate-900 text-sky-400">
                                                        <BookOpen className="h-10 w-10 opacity-50" />
                                                    </div>
                                                )}
                                                <span className="absolute top-3 left-3 bg-white/95 text-slate-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                                                    {blog.category}
                                                </span>
                                                <span className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs ${
                                                    blog.published ? "bg-emerald-500 text-white" : "bg-amber-400 text-slate-950"
                                                }`}>
                                                    {blog.published ? "LIVE" : "DRAFT"}
                                                </span>
                                            </div>

                                            <div className="p-6 space-y-3">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                    <Calendar className="h-3 w-3 text-[#0284c7]" />
                                                    <span>{new Date(blog.createdAt).toLocaleDateString("en-IN")}</span>
                                                    <span>•</span>
                                                    <Clock className="h-3 w-3 text-slate-400" />
                                                    <span>{blog.readTime || "4 min read"}</span>
                                                    <span>•</span>
                                                    <span>{blog.views || 0} views</span>
                                                </div>

                                                <h3 className="text-base font-black text-slate-900 line-clamp-2">
                                                    {blog.title}
                                                </h3>

                                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                    {blog.excerpt}
                                                </p>

                                                {blog.tags && blog.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pt-1">
                                                        {blog.tags.slice(0, 3).map((t, idx) => (
                                                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                                                                #{t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="p-4 border-t border-slate-100 bg-[#f8fafc]/50 flex items-center justify-between gap-2">
                                            <a
                                                href={`/blogs/${blog.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0284c7] hover:border-sky-300 transition-colors"
                                                title="Preview Live Page"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </a>

                                            <button
                                                onClick={() => handleToggleBlogPublish(blog)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                                                    blog.published
                                                        ? "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
                                                        : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                                }`}
                                            >
                                                {blog.published ? "Unpublish" : "Publish"}
                                            </button>

                                            <div className="flex items-center gap-1.5 ml-auto">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleOpenEditBlog(blog)}
                                                    className="h-8 px-3 rounded-xl border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5 mr-1 text-[#0284c7]" />
                                                    Edit
                                                </Button>

                                                <button
                                                    onClick={() => handleDeleteBlog(blog.id)}
                                                    disabled={blogDeletingId === blog.id}
                                                    className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                                                    title="Delete Article"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* ========================================================================= */}
            {/* PARTNER KYC & DETAILS MODAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {selectedPartner && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f8fafc]/80 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1f2328] border border-slate-300 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{selectedPartner.name}</h3>
                                    <p className="text-xs text-slate-500 font-mono">Ref: #{selectedPartner.referenceNo}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPartner(null)}
                                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                                    <span className="text-slate-500 font-bold uppercase text-[10px]">Email Address</span>
                                    <p className="font-bold text-slate-900">{selectedPartner.email}</p>
                                </div>
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                                    <span className="text-slate-500 font-bold uppercase text-[10px]">Mobile</span>
                                    <p className="font-bold text-slate-900">+91 {selectedPartner.mobile}</p>
                                </div>
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                                    <span className="text-slate-500 font-bold uppercase text-[10px]">Company / Firm</span>
                                    <p className="font-bold text-slate-900">{selectedPartner.companyName || "Individual DSA"}</p>
                                </div>
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                                    <span className="text-slate-500 font-bold uppercase text-[10px]">Profession & Exp</span>
                                    <p className="font-bold text-slate-900">{selectedPartner.profession} ({selectedPartner.experienceYears || "N/A"})</p>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
                                <p className="font-black text-[#0284c7] uppercase text-[10px]">Operating & Address Details</p>
                                <p className="text-slate-600"><strong>City:</strong> {selectedPartner.city}</p>
                                <p className="text-slate-600"><strong>Full Address:</strong> {selectedPartner.fullAddress || selectedPartner.location || "N/A"}</p>
                                <p className="text-slate-600"><strong>Address Proof Type:</strong> {selectedPartner.addressProofType || "Aadhaar"}</p>
                            </div>

                            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
                                <p className="font-black text-[#0284c7] uppercase text-[10px]">Uploaded Documents Summary</p>
                                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                                    {typeof selectedPartner.uploadedDocuments === "string"
                                        ? selectedPartner.uploadedDocuments
                                        : JSON.stringify(selectedPartner.uploadedDocuments || "Standard KYC documents submitted")}
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedPartner(null)}
                                    className="h-10 px-4 rounded-xl border-slate-300 bg-slate-100 text-slate-900 text-xs cursor-pointer"
                                >
                                    Close
                                </Button>
                                {selectedPartner.status === "PENDING" && (
                                    <Button
                                        onClick={() => handleApprovePartner(selectedPartner.id)}
                                        className="h-10 px-5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-slate-900 font-black text-xs uppercase cursor-pointer"
                                    >
                                        ✓ Approve & Issue Password
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* PARTNER FILE EDIT & STATUS UPDATE MODAL (ADMIN) */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {fileUpdateModalOpen && selectedFileItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Edit File Status & Commission</h3>
                                    <p className="text-xs text-slate-500 font-medium">File Ref: #{selectedFileItem.referenceNo}</p>
                                </div>
                                <button
                                    onClick={() => setFileUpdateModalOpen(false)}
                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Partner:</span>
                                    <span className="text-slate-900 font-black">{selectedFileItem.partnerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Client:</span>
                                    <span className="text-slate-900 font-black">{selectedFileItem.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Bank Submitted To:</span>
                                    <span className="text-[#0284c7] font-bold">{selectedFileItem.bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold">Filed Amount:</span>
                                    <span className="text-slate-900 font-black">₹{selectedFileItem.applicationAmount.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-2">
                                    <span className="text-[#0284c7] font-bold">Calculated Commission:</span>
                                    <span className="text-[#0284c7] font-black">
                                        ₹{Number(((updateDisbursedAmount || selectedFileItem.applicationAmount) * (updateCommissionRate / 100)).toFixed(2)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">File Workflow Status *</label>
                                    <select
                                        value={updateFileStatus}
                                        onChange={e => setUpdateFileStatus(e.target.value)}
                                        className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none cursor-pointer"
                                    >
                                        <option value="IN_PROCESS">In Process (Under Review)</option>
                                        <option value="DOCS_SUBMITTED">Docs Submitted to Bank</option>
                                        <option value="BANK_LOGIN">Bank Login Done</option>
                                        <option value="SANCTIONED">Sanction Letter Issued</option>
                                        <option value="DISBURSED">🎉 DISBURSED (Bank Disbursal Completed)</option>
                                        <option value="REJECTED">Declined / Closed</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                         <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Disbursed Amount (₹)</label>
                                         <input
                                             type="number"
                                             value={updateDisbursedAmount}
                                             onChange={e => setUpdateDisbursedAmount(parseFloat(e.target.value) || 0)}
                                             className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                                             placeholder="e.g. 337240"
                                         />
                                     </div>

                                     <div>
                                         <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Commission Rate (%) *</label>
                                         <input
                                             type="number"
                                             step="0.05"
                                             value={updateCommissionRate}
                                             onChange={e => setUpdateCommissionRate(parseFloat(e.target.value) || 0)}
                                             className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                                         />
                                     </div>
                                 </div>

                                 <div>
                                     <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Partner Payout Status *</label>
                                     <select
                                         value={updatePayoutStatus}
                                         onChange={e => setUpdatePayoutStatus(e.target.value)}
                                         className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none cursor-pointer"
                                     >
                                         <option value="PENDING">Pending Settlement</option>
                                         <option value="PROCESSED">Processed / In Queue</option>
                                         <option value="PAID">✅ Paid to Partner</option>
                                     </select>
                                 </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setFileUpdateModalOpen(false)}
                                    className="h-10 px-4 rounded-xl border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveFileUpdate}
                                    className="h-10 px-5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* REJECTION REASON MODAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {rejectionModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <h3 className="text-lg font-black text-slate-900">Decline Partner Application</h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Provide an optional feedback reason. An email notification will be dispatched to the applicant.
                            </p>
                            <textarea
                                rows={3}
                                placeholder="e.g. Incomplete KYC documentation or unverified contact number..."
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setRejectionModalOpen(false)}
                                    className="h-10 px-4 rounded-xl border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleRejectPartner}
                                    className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                                >
                                    Confirm Decline
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* BLOG ARTICLE CREATE & EDIT MODAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {blogModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">
                                            {editingBlogId ? "Edit Blog Article" : "Create New Financial Article"}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            Fill in article details. Content supports formatted paragraphs and bullet points.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setBlogModalOpen(false)}
                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveBlog} className="space-y-5">
                                {/* Title */}
                                <div>
                                    <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                        Article Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Complete Guide to Securing Lowest Home Loan Rates in Pune 2026"
                                        value={blogTitle}
                                        onChange={(e) => setBlogTitle(e.target.value)}
                                        className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1"
                                    />
                                </div>

                                {/* Category, ReadTime, Published Status */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                            Category *
                                        </label>
                                        <select
                                            value={blogCategory}
                                            onChange={(e) => setBlogCategory(e.target.value)}
                                            className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1 cursor-pointer"
                                        >
                                            <option value="Loans">Loans & Mortgages</option>
                                            <option value="Cards">Credit Cards</option>
                                            <option value="Insurance">Insurance & Safety</option>
                                            <option value="Investments">Investments & Wealth</option>
                                            <option value="Credit Score">CIBIL & Credit Score</option>
                                            <option value="Financial Planning">Financial Planning</option>
                                            <option value="General">General News</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                            Estimated Read Time
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="4 min read"
                                            value={blogReadTime}
                                            onChange={(e) => setBlogReadTime(e.target.value)}
                                            className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                            Publish Status
                                        </label>
                                        <select
                                            value={String(blogPublished)}
                                            onChange={(e) => setBlogPublished(e.target.value === "true")}
                                            className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1 cursor-pointer"
                                        >
                                            <option value="true">✅ Live (Public)</option>
                                            <option value="false">Draft (Hidden)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Author details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                            Author Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Shree Finance Advisory Desk"
                                            value={blogAuthor}
                                            onChange={(e) => setBlogAuthor(e.target.value)}
                                            className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                            Author Role / Designation
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Senior Financial Research Team"
                                            value={blogAuthorRole}
                                            onChange={(e) => setBlogAuthorRole(e.target.value)}
                                            className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                        Short Excerpt / Summary *
                                    </label>
                                    <textarea
                                        rows={2}
                                        required
                                        placeholder="A concise 2-line preview shown on the blog cards and Google search snippet..."
                                        value={blogExcerpt}
                                        onChange={(e) => setBlogExcerpt(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1"
                                    />
                                </div>

                                {/* Full Article Content */}
                                <div>
                                    <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                        Full Article Body Content *
                                    </label>
                                    <textarea
                                        rows={8}
                                        required
                                        placeholder="Write your in-depth financial guide, bank comparisons, eligibility rules, and advice here..."
                                        value={blogContent}
                                        onChange={(e) => setBlogContent(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1 font-sans leading-relaxed"
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Home Loan, Interest Rates, Pune, CIBIL"
                                        value={blogTags}
                                        onChange={(e) => setBlogTags(e.target.value)}
                                        className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0284c7] focus:outline-none mt-1"
                                    />
                                </div>

                                {/* Cover Image Upload or URL */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                        Cover Image (Upload File or Enter Image URL)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setBlogImageFile(file);
                                                        setBlogImagePreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-sky-50 file:text-[#0284c7] hover:file:bg-sky-100 cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Or paste external image URL..."
                                                value={blogCoverImageUrl}
                                                onChange={(e) => {
                                                    setBlogCoverImageUrl(e.target.value);
                                                    if (e.target.value) setBlogImagePreview(e.target.value);
                                                }}
                                                className="w-full h-10 bg-white border border-slate-300 rounded-xl px-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {(blogImagePreview || blogCoverImageUrl) && (
                                        <div className="relative aspect-[16/8] max-h-40 rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-900">
                                            <Image
                                                src={blogImagePreview || blogCoverImageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Submit button */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setBlogModalOpen(false)}
                                        className="h-11 px-5 rounded-xl border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={blogSaving}
                                        className="h-11 px-6 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-2"
                                    >
                                        {blogSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Saving Article...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                {editingBlogId ? "Update Article" : "Publish Article"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
