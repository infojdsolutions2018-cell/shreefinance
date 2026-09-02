import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Blog, { IBlog } from "@/models/Blog";
import {
    Calendar,
    Clock,
    User,
    ArrowLeft,
    Share2,
    BookOpen,
    CheckCircle2,
    Sparkles,
    Tag,
    ChevronRight,
    TrendingUp,
    Shield,
    CreditCard,
    Building2,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const DEFAULT_FALLBACKS: Record<string, IBlog> = {
    "how-to-get-lowest-home-loan-interest-rate": {
        _id: "default-1",
        title: "How to Get the Lowest Home Loan Interest Rate in 2026",
        slug: "how-to-get-lowest-home-loan-interest-rate",
        excerpt: "Master the insider tactics used by top financial advisors to negotiate 8.35% p.a. home loan rates and save up to ₹8 Lakhs in interest across 40+ banks.",
        content: `Getting the lowest home loan interest rate is not just about having a decent income — it requires a strategic approach across your credit profile, loan-to-value ratio, and multi-bank comparison.

### 1. Maintain a CIBIL Score of 750+
Banks reserve their benchmark interest rates (starting 8.35% p.a.) strictly for borrowers with a CIBIL score of 750 or above. Even a 0.50% reduction in your interest rate on a ₹50 Lakh loan for 20 years saves you over ₹4.5 Lakhs in interest payments.

### 2. Compare Across Nationalized and Private Banks
Never settle for your primary salary bank without comparing. While PSU banks like SBI and Bank of Baroda offer rock-bottom floating rates, private lenders like HDFC and ICICI often provide faster turnaround and discounted processing fees.

### 3. Opt for Home Loan Balance Transfer
If your existing loan interest rate is above 9.25%, switching to a new lender offering 8.35% with zero processing fees can significantly lower your monthly EMI burden immediately.`,
        category: "Loans",
        coverImage: "/banners/theme-home-loan.jpg",
        author: "Shree Finance Advisory Desk",
        authorRole: "Senior Financial Research Team",
        readTime: "5 min read",
        tags: ["Home Loan", "Interest Rates", "CIBIL", "Savings"],
        published: true,
        views: 342,
        createdAt: new Date("2026-03-01T10:00:00.000Z"),
        updatedAt: new Date("2026-03-01T10:00:00.000Z")
    } as unknown as IBlog,
    "personal-loan-vs-loan-against-property": {
        _id: "default-2",
        title: "Personal Loan vs. Loan Against Property: Which Capital Option is Right for You?",
        slug: "personal-loan-vs-loan-against-property",
        excerpt: "Compare interest rates, tenure flexibility, and disbursal speeds to choose the most cost-effective funding source for your business or personal needs.",
        content: `When you need instant liquidity of ₹10 Lakhs to ₹1 Crore, deciding between an unsecured Personal Loan and a secured Loan Against Property (LAP) is crucial to keeping borrowing costs low.

### Personal Loans (Unsecured)
- **Speed:** Instant approval & disbursal in 24 hours.
- **Collateral:** 100% collateral-free.
- **Rates:** 10.25% to 14.5% p.a.
- **Tenure:** Up to 5 years.
- **Best For:** Medical emergencies, urgent weddings, quick working capital.

### Loan Against Property (Secured)
- **Speed:** 5 to 7 days for legal & technical checks.
- **Collateral:** Residential, commercial, or industrial property.
- **Rates:** 9.25% to 11.5% p.a.
- **Tenure:** Up to 15-20 years.
- **Best For:** Business expansion, machinery purchase, major debt consolidation.`,
        category: "Loans",
        coverImage: "/banners/theme-personal-loan.jpg",
        author: "Shree Finance Advisory Desk",
        authorRole: "Credit Analysis Desk",
        readTime: "4 min read",
        tags: ["Personal Loan", "LAP", "Business Growth"],
        published: true,
        views: 218,
        createdAt: new Date("2026-02-24T08:30:00.000Z"),
        updatedAt: new Date("2026-02-24T08:30:00.000Z")
    } as unknown as IBlog,
    "boost-cibil-score-above-750": {
        _id: "default-3",
        title: "5 Proven Strategies to Boost Your CIBIL Score Above 750 in 60 Days",
        slug: "boost-cibil-score-above-750",
        excerpt: "Simple, actionable credit repair habits that eliminate score drag, fix reporting errors, and open instant pre-approved loans from top NBFCs.",
        content: `Your CIBIL score is the digital passport to securing fast loan sanctions with zero hassle. Here are the 5 proven habits to elevate your score quickly:

1. **Keep Credit Utilization Under 30%:** If your credit limit is ₹2,00,000, never cross ₹60,000 in monthly statement billing.
2. **Never Miss EMI Deadlines:** Set up auto-debit on NACH mandates to avoid late payment penalties and credit score drops.
3. **Avoid Multiple Hard Inquiries:** Apply through an integrated aggregator like Shree Finance rather than submitting applications simultaneously to 10 banks.
4. **Mix Secured and Unsecured Debt:** A healthy mix of auto/home loans alongside a credit card creates a balanced credit profile.
5. **Rectify DPD (Days Past Due) Errors:** Regularly check your free credit report and dispute inaccurate settled/written-off remarks.`,
        category: "Credit Score",
        coverImage: "/banners/theme-business-loan.jpg",
        author: "Shree Finance Advisory Desk",
        authorRole: "Risk & Underwriting Specialist",
        readTime: "6 min read",
        tags: ["CIBIL", "Credit Score", "Financial Health"],
        published: true,
        views: 520,
        createdAt: new Date("2026-02-18T14:15:00.000Z"),
        updatedAt: new Date("2026-02-18T14:15:00.000Z")
    } as unknown as IBlog,
    "sme-business-loan-eligibility-guide": {
        _id: "default-4",
        title: "Unsecured Business Loans for SMEs: Complete Eligibility & Document Checklist",
        slug: "sme-business-loan-eligibility-guide",
        excerpt: "Everything small and medium business owners in Maharashtra need to know to secure up to ₹75 Lakhs collateral-free business loans in 48 hours.",
        content: `Expanding your business operations, purchasing seasonal inventory, or upgrading technology requires quick capital without mortgaging family property.

### Key Eligibility Criteria:
- **Vintage:** Minimum 2 years of active business operations.
- **Annual Turnover:** ₹40 Lakhs or higher with regular GST filings.
- **Banking Conduct:** 12 months primary current account statement with no cheque bounces.
- **Profitability:** Positive Net Profit (PAT) in the latest 2 years ITR.

### Documents Required:
1. PAN & Aadhaar of all Directors/Partners.
2. GST Registration & 12-Month 3B Returns.
3. 2 Years Audited Balance Sheet & P&L.
4. 12 Months Current Account Bank Statements.`,
        category: "Loans",
        coverImage: "/banners/theme-partner-program.jpg",
        author: "Shree Finance Advisory Desk",
        authorRole: "Commercial Banking Specialist",
        readTime: "4 min read",
        tags: ["Business Loan", "SME", "GST", "Working Capital"],
        published: true,
        views: 189,
        createdAt: new Date("2026-02-10T11:00:00.000Z"),
        updatedAt: new Date("2026-02-10T11:00:00.000Z")
    } as unknown as IBlog,
};

async function getBlog(slug: string): Promise<IBlog | null> {
    try {
        await connectDB();
        let blog = await Blog.findOne({ slug, published: true });
        if (!blog && slug.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await Blog.findById(slug);
        }
        if (blog) return blog;
    } catch {
        // Continue to fallback
    }
    return DEFAULT_FALLBACKS[slug] || null;
}

async function getRecentBlogs(currentSlug: string): Promise<IBlog[]> {
    try {
        await connectDB();
        const recent = await Blog.find({ slug: { $ne: currentSlug }, published: true })
            .sort({ createdAt: -1 })
            .limit(3);
        if (recent && recent.length > 0) return recent;
    } catch {
        // Fallback
    }
    return Object.values(DEFAULT_FALLBACKS).filter(b => b.slug !== currentSlug).slice(0, 3);
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const blog = await getBlog(slug);
    if (!blog) return { title: "Blog Post Not Found | Shree Finance" };

    return {
        title: `${blog.title} | Shree Finance Knowledge Hub`,
        description: blog.excerpt,
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            images: blog.coverImage ? [blog.coverImage] : [],
        }
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        notFound();
    }

    const recentBlogs = await getRecentBlogs(slug);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">
            {/* ARTICLE HEADER / HERO */}
            <header className="bg-gradient-to-b from-sky-950 via-slate-900 to-slate-900 text-white pt-20 pb-16 border-b border-sky-800/40 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-6 relative z-10">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#38bdf8] hover:text-white transition-colors uppercase tracking-wider group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to All Articles
                    </Link>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-[#0284c7] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                            {blog.category}
                        </span>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-[#38bdf8]" />
                            {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </span>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {blog.readTime || "4 min read"}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        {blog.title}
                    </h1>

                    <p className="text-base md:text-lg text-slate-300 leading-relaxed font-medium">
                        {blog.excerpt}
                    </p>

                    {/* Author Bar */}
                    <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-sky-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
                            {blog.author ? blog.author[0] : "S"}
                        </div>
                        <div>
                            <p className="text-sm font-black text-white">{blog.author}</p>
                            <p className="text-xs text-[#38bdf8] font-bold">{blog.authorRole || "Senior Financial Advisory Team"}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN ARTICLE BODY */}
            <main className="container mx-auto px-4 md:px-6 max-w-4xl pt-12 space-y-12">
                {/* Cover Image if available */}
                {blog.coverImage && (
                    <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900">
                        <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content Area */}
                <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8">
                    <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base prose-li:text-slate-700 prose-strong:text-slate-900 prose-a:text-[#0284c7] whitespace-pre-line text-sm sm:text-base leading-relaxed">
                        {blog.content}
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mr-1">
                                <Tag className="h-3.5 w-3.5" /> Topics:
                            </span>
                            {blog.tags.map((tag, i) => (
                                <Link
                                    key={i}
                                    href={`/blogs?tag=${encodeURIComponent(tag)}`}
                                    className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-50 text-[#0284c7] hover:bg-sky-100 transition-colors border border-sky-200"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </article>

                {/* CTA BANNER */}
                <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-800/40">
                    <div className="space-y-2 text-center md:text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0284c7]/30 text-[#38bdf8] text-[10px] font-black uppercase tracking-wider">
                            <Sparkles className="h-3 w-3" /> Quick Pre-Approval
                        </span>
                        <h3 className="text-2xl font-black text-white">Looking for the Lowest Loan Rates in Pune?</h3>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                            Get quotes from 40+ partner banks with instant sanction checks and zero brokerage.
                        </p>
                    </div>

                    <Link href="/#eligibility-check">
                        <Button className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-black px-6 h-12 rounded-xl text-xs uppercase tracking-wider shadow-lg shrink-0 cursor-pointer">
                            Check Live Eligibility <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Button>
                    </Link>
                </div>

                {/* MORE RECENT ARTICLES */}
                {recentBlogs.length > 0 && (
                    <div className="space-y-6 pt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900">Recommended Reading</h3>
                            <Link href="/blogs" className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1">
                                View All <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-6">
                            {recentBlogs.map((item) => (
                                <Link key={String(item._id || item.slug)} href={`/blogs/${item.slug}`} className="block group">
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-sky-500/40 transition-all space-y-3 h-full flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black uppercase text-[#0284c7]">
                                                {item.category}
                                            </span>
                                            <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0284c7] transition-colors line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                {item.excerpt}
                                            </p>
                                        </div>

                                        <span className="text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-100 flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-slate-400" /> {item.readTime || "4 min read"}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
