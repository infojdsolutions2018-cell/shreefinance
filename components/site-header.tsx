"use client";

import Link from "next/link";
import Image from "next/image";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Menu, Phone, Mail, Zap, ChevronDown, X, Search, Sparkles, ShieldCheck, ArrowRight, Building2, ArrowLeftRight, FileText } from "lucide-react";
import { megaMenuData } from "@/config/navigation";
import { useState } from "react";
import { LeadFormModal } from "@/components/dialogs/lead-form-modal";
import { cn } from "@/lib/utils";

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCibilModalOpen, setIsCibilModalOpen] = useState(false);
    const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const toggleCategory = (category: string) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    return (
        <>
            {/* Contact Us Phone Reveal Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white text-white border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 text-center relative">
                        <button
                            onClick={() => setIsContactModalOpen(false)}
                            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="h-14 w-14 rounded-2xl bg-sky-500/20 text-[#0284c7] flex items-center justify-center mx-auto border border-sky-500/40">
                            <Phone className="h-7 w-7" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white">Shree Finance Helpline</h3>
                            <p className="text-xs text-slate-400">Available Monday to Saturday (9 AM - 8 PM)</p>
                        </div>

                        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Direct Calling Number</span>
                            <p className="text-2xl font-black text-[#38bdf8] tracking-wider">+91 88304 34945</p>
                        </div>

                        <div className="flex gap-2.5 pt-1">
                            <a
                                href="tel:+918830434945"
                                className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-slate-950 font-black h-11 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                            >
                                <Phone className="h-4 w-4" /> Call Now
                            </a>
                            <button
                                onClick={() => setIsContactModalOpen(false)}
                                className="px-5 bg-slate-800 hover:bg-slate-700 text-white font-bold h-11 rounded-xl text-xs uppercase cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Top Contact & Social Channels Header Bar */}
            <div className="bg-[#0b1329] text-white text-xs font-bold border-b border-slate-800/80 hidden md:block py-2.5 px-4">
                <div className="container mx-auto flex items-center justify-center gap-5 px-4 flex-wrap">
                    {/* 1. Phone Number */}
                    <a
                        href="tel:+918830434945"
                        className="flex items-center gap-2 text-white hover:text-[#38bdf8] transition-colors whitespace-nowrap group"
                    >
                        <div className="h-5 w-5 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-[#38bdf8] group-hover:bg-[#0284c7] group-hover:text-white transition-colors">
                            <Phone className="h-3 w-3 fill-[#38bdf8]/30" />
                        </div>
                        <span className="font-extrabold text-xs tracking-wide text-white group-hover:text-[#38bdf8] transition-colors">+91 88304 34945</span>
                    </a>

                    <div className="h-3.5 w-[1px] bg-slate-700/80" />

                    {/* 2. Email ID */}
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=shreefinancec@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-[#38bdf8] transition-colors whitespace-nowrap group"
                    >
                        <div className="h-5 w-5 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-[#38bdf8] group-hover:bg-[#0284c7] group-hover:text-white transition-colors">
                            <Mail className="h-3 w-3" />
                        </div>
                        <span className="font-extrabold text-xs text-white group-hover:text-[#38bdf8] transition-colors">shreefinancec@gmail.com</span>
                    </a>

                    <div className="h-3.5 w-[1px] bg-slate-700/80" />

                    {/* 3. Facebook */}
                    <a
                        href="https://www.facebook.com/profile.php?id=61585560397130#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-white hover:text-[#38bdf8] transition-colors whitespace-nowrap group"
                    >
                        <span className="h-4 w-4 rounded bg-sky-500/20 text-[#38bdf8] font-black text-xs flex items-center justify-center border border-sky-500/30 group-hover:bg-[#0284c7] group-hover:text-white transition-colors">f</span>
                        <span className="font-extrabold text-xs text-white group-hover:text-[#38bdf8] transition-colors">Facebook</span>
                    </a>

                    <div className="h-3.5 w-[1px] bg-slate-700/80" />

                    {/* 4. Instagram */}
                    <a
                        href="https://www.instagram.com/shreefinancec?igsi=ZzVsNXo0MThqZ2E0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-white hover:text-[#38bdf8] transition-colors whitespace-nowrap group"
                    >
                        <svg className="h-3.5 w-3.5 text-[#38bdf8] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                        <span className="font-extrabold text-xs text-white group-hover:text-[#38bdf8] transition-colors">Instagram</span>
                    </a>

                    <div className="h-3.5 w-[1px] bg-slate-700/80" />

                    {/* 5. Twitter */}
                    <a
                        href="https://twitter.com/shreefinance153"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-white hover:text-[#38bdf8] transition-colors whitespace-nowrap group"
                    >
                        <span className="font-extrabold text-xs text-white group-hover:text-[#38bdf8] transition-colors">Twitter</span>
                    </a>

                    <div className="h-3.5 w-[1px] bg-slate-700/80" />

                    {/* 6. YouTube */}
                    <a
                        href="https://www.youtube.com/@Shree-Finance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-white hover:text-red-400 transition-colors whitespace-nowrap group"
                    >
                        <svg className="h-3.5 w-3.5 text-[#38bdf8] group-hover:text-red-500 group-hover:scale-110 transition-all" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0b1329" />
                        </svg>
                        <span className="font-extrabold text-xs text-white group-hover:text-red-400 transition-colors">YouTube</span>
                    </a>
                </div>
            </div>

            <header className="sticky top-0 z-50 w-full bg-white text-slate-900 backdrop-blur-2xl border-b border-slate-200 shadow-md">
                <div className="w-full relative">
                    <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-4 md:px-6 relative gap-4">
                        {/* Logo Section (Far Left) */}
                        <div className="flex items-center shrink-0">
                            <Link href="/" className="flex items-center group transition-transform hover:scale-105">
                                <Image
                                    src="/shreelogobg.png"
                                    alt="ShreeFinance Logo"
                                    width={400}
                                    height={120}
                                    className="h-14 md:h-18 max-h-18 w-auto object-contain py-1"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation (Middle) */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <MainNav />
                        </div>

                        {/* Right Action Buttons (Far Right) */}
                        <div className="flex items-center gap-2.5 shrink-0">
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="hidden xl:flex items-center gap-1.5 text-xs font-black text-slate-800 hover:text-[#0284c7] transition-all p-2 rounded-xl hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                                title="Click to view Contact Number"
                            >
                                <div className="p-1.5 rounded-full bg-sky-50 text-[#0284c7]">
                                    <Phone className="h-3.5 w-3.5" />
                                </div>
                                <span>Contact</span>
                            </button>

                            <Button
                                className="hidden md:inline-flex bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-300 font-black rounded-full px-4 h-10 text-xs tracking-wider uppercase transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
                                onClick={() => setIsCibilModalOpen(true)}
                            >
                                <Zap className="h-3.5 w-3.5 mr-1 fill-[#0284c7] text-[#0284c7]" />
                                Free CIBIL
                            </Button>

                            <Button
                                className="hidden sm:inline-flex bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-full px-5 h-10 text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
                                onClick={() => setIsGeneralModalOpen(true)}
                            >
                                Apply Now <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Button>

                            {/* Mobile Hamburger Toggle */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="lg:hidden text-slate-900 hover:bg-slate-100 rounded-full h-10 w-10 transition-colors cursor-pointer" 
                                onClick={() => {
                                    setIsMobileMenuOpen(!isMobileMenuOpen);
                                    if (!isMobileMenuOpen) setExpandedCategory(null);
                                }}
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Drawer Navigation */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-slate-200/80 bg-white p-6 space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                            <nav className="space-y-3">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-100 font-black text-slate-900 text-base"
                                >
                                    <span>Home</span>
                                </Link>
                                {Object.entries(megaMenuData).map(([key, category]) => (
                                    <div key={key} className="space-y-2">
                                        <button
                                            onClick={() => toggleCategory(key)}
                                            className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 font-extrabold text-slate-900 text-base"
                                        >
                                            <span>{category.title}</span>
                                            <ChevronDown className={cn(
                                                "h-5 w-5 transition-transform duration-300",
                                                expandedCategory === key ? "rotate-180" : ""
                                            )} />
                                        </button>
                                        
                                        {expandedCategory === key && (
                                            <div className="grid grid-cols-1 gap-2 pl-4 animate-in slide-in-from-top-2 duration-200">
                                                {category.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                                                    >
                                                        <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                            <item.icon className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                                                            {item.rate && <p className="text-[10px] text-primary font-black uppercase tracking-widest">{item.rate}</p>}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="pt-2 space-y-2">
                                    <button
                                         onClick={() => {
                                             setIsContactModalOpen(true);
                                             setIsMobileMenuOpen(false);
                                         }}
                                         className="flex items-center justify-between w-full p-4 rounded-2xl bg-sky-50 font-black text-[#0284c7] text-sm cursor-pointer border border-sky-200"
                                     >
                                         <span className="flex items-center gap-2">
                                             <Phone className="h-4 w-4 text-[#0284c7]" />
                                             Contact
                                         </span>
                                     </button>
                                     <Link
                                         href="/track-status"
                                         onClick={() => setIsMobileMenuOpen(false)}
                                         className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 font-black text-[#0284c7] text-sm border border-sky-200"
                                     >
                                         <span className="flex items-center gap-2">
                                             <Search className="h-4 w-4" />
                                             Track Application Status
                                         </span>
                                     </Link>
                                     <Link
                                         href="/become-a-partner"
                                         onClick={() => setIsMobileMenuOpen(false)}
                                         className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 border border-sky-300 font-black text-[#0284c7] text-sm"
                                     >
                                         <span className="flex items-center gap-2">
                                             <Sparkles className="h-4 w-4 text-[#0284c7]" />
                                             Become a Partner (DSA Registration)
                                         </span>
                                         <ArrowRight className="h-4 w-4" />
                                     </Link>
                                     <Link
                                         href="/compare"
                                         onClick={() => setIsMobileMenuOpen(false)}
                                         className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 font-black text-[#0284c7] text-sm border border-sky-200"
                                     >
                                         <span className="flex items-center gap-2">
                                             <ArrowLeftRight className="h-4 w-4" />
                                             Compare Multi-Bank Rates
                                         </span>
                                         <ArrowRight className="h-4 w-4" />
                                     </Link>
                                     <Link
                                         href="/blogs"
                                         onClick={() => setIsMobileMenuOpen(false)}
                                         className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 font-black text-slate-900 text-sm shadow-xs"
                                     >
                                         <span className="flex items-center gap-2">
                                             <FileText className="h-4 w-4 text-[#0284c7]" />
                                             Blogs & Financial Articles
                                         </span>
                                         <ArrowRight className="h-4 w-4" />
                                     </Link>
                                     <Link
                                         href="/partner/login"
                                         onClick={() => setIsMobileMenuOpen(false)}
                                         className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 font-black text-slate-900 text-sm shadow-xs"
                                     >
                                         <span className="flex items-center gap-2">
                                             <Building2 className="h-4 w-4 text-[#0284c7]" />
                                             Partner Portal Login & Dashboard
                                         </span>
                                         <span className="text-xs text-[#0284c7]">➔</span>
                                     </Link>
                                 </div>
                            </nav>
                            
                            <div className="pt-4 space-y-3">
                                <Button 
                                    className="w-full bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-300 font-black rounded-2xl h-14 text-base shadow-sm transition-all active:scale-95 uppercase tracking-wider" 
                                    onClick={() => { setIsCibilModalOpen(true); setIsMobileMenuOpen(false); }}
                                >
                                    <Zap className="h-5 w-5 mr-2 fill-[#0284c7] text-[#0284c7]" />
                                    Free CIBIL Score Check
                                </Button>
                                <Button 
                                    className="w-full bg-primary hover:bg-sky-600 text-white font-black rounded-2xl h-14 text-base shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-wider" 
                                    onClick={() => { setIsGeneralModalOpen(true); setIsMobileMenuOpen(false); }}
                                >
                                    Apply Now <ArrowRight className="h-5 w-5 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <LeadFormModal
                isOpen={isCibilModalOpen}
                onClose={() => setIsCibilModalOpen(false)}
                type="cibil"
            />
            <LeadFormModal
                isOpen={isGeneralModalOpen}
                onClose={() => setIsGeneralModalOpen(false)}
                type="general"
            />
        </>
    );
}
