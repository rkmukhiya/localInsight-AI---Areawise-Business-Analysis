import React, { useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    MapPin,
    Target,
    TrendingUp,
    Download,
    Search,
    Briefcase,
    Layout,
    Users,
    BarChart3,
    CheckCircle2,
    Loader2,
    CalendarDays,
    Sparkles,
    Zap,
    Globe,
    Activity
} from 'lucide-react';

const StrategyDashboard = () => {
    const [formData, setFormData] = useState({ domain: '', location: '' });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const reportRef = useRef();

    const domains = [
        { id: "food", label: "Food & Beverage" },
        { id: "shopping", label: "Retail & Shopping" },
        { id: "healthcare", label: "Healthcare" },
        { id: "education", label: "Education" },
        { id: "professional_services", label: "Professional Services" },
        { id: "personal_services", label: "Personal Services" },
        { id: "hospitality", label: "Hospitality" }
    ];

    const handleGenerate = async () => {
        if (!formData.domain || !formData.location) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/generate_strategy', formData);
            setData(response.data);
        } catch (error) {
            console.error("Error generating plan:", error);
            setError(error.response?.data?.details || error.message || "Failed to generate plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!data) return;

        console.log("Constructing precisely aligned PDF roadmap...");
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 30;

        // --- Header Section ---
        doc.setFont("times", "bold");
        doc.setFontSize(32); // Large Title
        doc.setTextColor(15, 23, 42); // Slate 900
        doc.text(data.business_plan.business_name, margin, y);
        y += 12;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text("BUSINESS PLAN", margin, y);
        doc.text(`LOCATION: ${data.location.toUpperCase()}`, pageWidth - margin, y, { align: 'right' });
        y += 5;

        // Heavy Master Divider
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(1.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 25;

        // --- Layout Configuration ---
        const labelColWidth = 60;
        const contentColX = margin + labelColWidth;
        const contentWidth = pageWidth - contentColX - margin;

        const addTwoColumnSection = (label, content) => {
            if (!content) return;

            const splitContent = doc.splitTextToSize(content, contentWidth);
            const sectionHeight = (splitContent.length * 6) + 10;

            // Page Break Logic
            if (y + sectionHeight > 280) {
                doc.addPage();
                y = 25;
            }

            // Divider Line
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.setLineWidth(0.3);
            doc.line(margin, y - 8, pageWidth - margin, y - 8);

            // Label (Left)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(15, 23, 42);
            doc.text(label.toUpperCase(), margin, y);

            // Content (Right)
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.setTextColor(51, 65, 85); // Slate 700
            doc.text(splitContent, contentColX, y, { align: 'left', lineHeightFactor: 1.5 });

            y += sectionHeight + 10;
        };

        // --- Populate Sections ---
        addTwoColumnSection("Executive Summary", data.business_plan.executive_summary);
        addTwoColumnSection("Target Market", data.business_plan.target_market);
        addTwoColumnSection("Regional Strategy", data.business_plan.location_analysis);

        // --- Implementation Section ---
        if (y + 30 > 280) { doc.addPage(); y = 25; }

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y - 8, pageWidth - margin, y - 8);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("IMPLEMENTATION", margin, y);

        data.business_plan.implementation_plan.forEach((phase) => {
            const timeframeHeight = 10;
            const phaseTitleHeight = 8;
            const bulletsHeight = phase.key_activities.length * 6;
            const totalPhaseHeight = timeframeHeight + phaseTitleHeight + bulletsHeight + 10;

            if (y + totalPhaseHeight > 280) {
                doc.addPage();
                y = 25;
            }

            // Timeframe (Top Label)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);
            doc.text(phase.timeframe.toUpperCase(), contentColX, y);
            y += 6;

            // Phase Name
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.setTextColor(30, 41, 59);
            doc.text(phase.phase, contentColX, y);
            y += 7;

            // Bullet Points
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(71, 85, 105);

            phase.key_activities.forEach((activity) => {
                const bullet = "• ";
                const splitActivity = doc.splitTextToSize(bullet + activity, contentWidth - 5);
                doc.text(splitActivity, contentColX, y);
                y += (splitActivity.length * 5) + 2;
            });

            y += 8; // Break between phases
        });

        doc.save(`${data.business_plan.business_name.replace(/\s+/g, '_')}_Strategic_Plan.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a] text-[#e0e7ff] font-sans selection:bg-indigo-500/30 pt-28 pb-16" style={{ backgroundImage: 'linear-gradient(110deg, #1a1a2e 0%, #0a0a1a 100%)', backgroundAttachment: 'fixed' }}>
            {/* Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Refined Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    data-html2canvas-ignore
                    className="mb-14 flex flex-col lg:flex-row lg:items-center justify-between gap-10 no-print"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-indigo-400 font-bold tracking-[0.3em] text-[10px] uppercase">
                            <Zap className="w-3 h-3 fill-indigo-400" /> Business Intelligence Engine
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">
                            Strategic <span className="text-indigo-500">Growth Plan</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">Next-gen market auditing and actionable growth roadmap generation.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 bg-white/[0.03] backdrop-blur-3xl p-2 rounded-[24px] border border-white/10 shadow-3xl">
                        <div className="flex items-center gap-3 px-5 py-3 border-r border-white/5">
                            <Briefcase className="w-4 h-4 text-indigo-500" />
                            <select
                                className="bg-transparent outline-none text-sm font-bold text-slate-300 min-w-[180px] cursor-pointer appearance-none"
                                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                value={formData.domain}
                            >
                                <option value="" className="bg-[#0a0a1a]">Select Sector</option>
                                {domains.map(d => <option key={d.id} value={d.id} className="bg-[#0a0a1a]">{d.label}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-3 px-5 py-3">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            <input
                                type="text"
                                placeholder="Core Location..."
                                className="bg-transparent outline-none text-sm font-bold text-white placeholder:text-slate-700 w-44"
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                value={formData.location}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGenerate}
                            disabled={loading || !formData.domain || !formData.location}
                            className={`px-8 py-3.5 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all ${loading || !formData.domain || !formData.location
                                ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-indigo-50 shadow-xl shadow-white/5'
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Syncing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    <span>Initiate Analysis</span>
                                </div>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                <main>
                    <AnimatePresence mode='wait'>
                        {error && !loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-[32px] p-8 text-center backdrop-blur-sm"
                            >
                                <div className="text-red-400 font-bold mb-2">Generation Error</div>
                                <p className="text-red-300/70 text-sm max-w-md mx-auto">{error}</p>
                            </motion.div>
                        )}

                        {!data && !loading && !error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.01 }}
                                className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[48px] py-32 flex flex-col items-center justify-center text-center backdrop-blur-sm"
                            >
                                <div className="w-24 h-24 bg-indigo-500/5 rounded-[32px] flex items-center justify-center mb-8 ring-1 ring-white/10">
                                    <Globe className="w-10 h-10 text-indigo-500/30" />
                                </div>
                                <h2 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">Operational Readiness</h2>
                                <p className="text-slate-600 max-w-sm font-medium">Please define your sector and geographic target to generate high-fidelity reports.</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-40 flex flex-col items-center justify-center space-y-10"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 border-[4px] border-white/5 border-t-indigo-500 rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="w-8 h-8 text-indigo-500/50" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="font-black text-white text-xl uppercase tracking-widest">Processing Intelligence</p>
                                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed italic">Decoding regional saturation levels and opportunity coefficients...</p>
                                </div>
                            </motion.div>
                        )}

                        {data && !loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid lg:grid-cols-12 gap-10 items-start"
                            >
                                {/* Main Report */}
                                <div ref={reportRef} className="lg:col-span-8 bg-[#0a0a1a] border border-white/10 rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                                    <div className="p-12 md:p-16">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 mb-20">
                                            <div className="space-y-6">
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/20">
                                                    Strategic Assessment Report
                                                </div>
                                                <h3 className="text-5xl font-black text-white tracking-tighter leading-none">
                                                    {data.business_plan.business_name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><MapPin className="w-3 h-3 text-indigo-500" /> {data.location}</div>
                                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><CalendarDays className="w-3 h-3 text-indigo-500" /> 2026 Roadmap</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleDownloadPDF}
                                                data-html2canvas-ignore
                                                className="h-fit bg-white text-black px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all flex items-center gap-3"
                                            >
                                                <Download className="w-4 h-4" /> Export Result
                                            </button>
                                        </div>

                                        <div className="space-y-20">
                                            <section className="space-y-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                                                        Executive Synthesis
                                                    </h4>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed text-xl font-medium tracking-tight">
                                                    {data.business_plan.executive_summary}
                                                </p>
                                            </section>

                                            <div className="grid md:grid-cols-2 gap-12 py-14 border-y border-white/5">
                                                <ReportMetric title="Market Segmentation" content={data.business_plan.target_market} icon={<Users className="w-5 h-5 text-indigo-500" />} />
                                                <ReportMetric title="Regional Leverage" content={data.business_plan.location_analysis} icon={<TrendingUp className="w-5 h-5 text-indigo-400" />} />
                                            </div>

                                            <section className="space-y-12">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-1.5 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                                                        Implementation Architecture
                                                    </h4>
                                                </div>

                                                <div className="space-y-6">
                                                    {data.business_plan.implementation_plan.map((phase, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex gap-8 p-8 rounded-[32px] bg-white/[0.01] hover:bg-white/[0.03] transition-all border border-white/5 hover:border-white/10 group"
                                                        >
                                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white font-black shrink-0 transition-all group-hover:bg-indigo-600 group-hover:border-indigo-400">
                                                                {i + 1}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{phase.timeframe}</span>
                                                                <h5 className="text-2xl font-black text-white tracking-tight">{phase.phase}</h5>
                                                                <div className="mt-5 flex flex-wrap gap-2">
                                                                    {phase.key_activities.map((act, j) => (
                                                                        <span key={j} className="flex items-center gap-2 text-[10px] font-bold px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-slate-500 uppercase tracking-tighter">
                                                                            <CheckCircle2 className="w-3 h-3 text-indigo-500/50" /> {act}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>

                                {/* Intelligence Sidebar */}
                                <div className="lg:col-span-4 space-y-8">
                                    <SummaryCard
                                        title="Opportunity Multiplier"
                                        value={data.market_gap_score}
                                        label="Gap Co-efficient"
                                        footer={`Optimal Niche: ${data.best_opportunity.split('.')[1] || data.best_opportunity}`}
                                        icon={<BarChart3 className="w-5 h-5 text-indigo-400" />}
                                    />

                                    <div className="bg-indigo-600 p-10 rounded-[48px] shadow-[0_20px_40px_rgba(79,70,229,0.3)] relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all transform group-hover:scale-110 group-hover:-rotate-6">
                                            <Layout className="w-40 h-40 text-white" />
                                        </div>
                                        <div className="relative z-10 space-y-10">
                                            <h4 className="text-indigo-100/50 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Market Vitals</h4>
                                            <div className="space-y-5">
                                                <HealthItem label="Competitive Density" value={data.status} />
                                                <HealthItem label="Calculated Bound" value={`${data.area_sq_km} sq km`} />
                                                <HealthItem label="Target Segment" value={data.best_opportunity.split('.')[1] || data.best_opportunity} />
                                            </div>
                                            <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-2xl transition-all">
                                                Advanced Analytics
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-10 rounded-[48px] border border-white/5 bg-white/[0.01] text-center space-y-6">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Reliability Index</p>
                                        <div className="flex justify-between items-end h-16 gap-1.5 px-4">
                                            {[...Array(15)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-t-sm transition-all duration-500 ${i < 11 ? 'bg-indigo-500/40' : 'bg-white/5'}`}
                                                    style={{ height: `${Math.random() * 60 + 40}%` }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase">Confidence Level: 94.8%</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

// --- Sub-components ---

const ReportMetric = ({ title, content, icon }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl text-indigo-400 border border-white/5 shadow-inner">{icon}</div>
            <h5 className="font-black text-white text-xs uppercase tracking-widest">{title}</h5>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed font-medium">{content}</p>
    </div>
);

const SummaryCard = ({ title, value, label, footer, icon }) => (
    <div className="bg-white/[0.03] p-10 rounded-[48px] border border-white/10 shadow-2xl group hover:border-indigo-500/30 transition-all">
        <div className="flex items-center justify-between mb-12">
            <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">{title}</h4>
            <div className={`p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/10`}>{icon}</div>
        </div>
        <div className="space-y-2">
            <div className="text-7xl font-black text-white tracking-tighter">{value}</div>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">{label}</p>
        </div>
        <div className="mt-12 pt-10 border-t border-white/5 flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
            {footer}
        </div>
    </div>
);

const HealthItem = ({ label, value }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/10 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors">
        <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
        <span className="font-black text-[11px] text-white uppercase tracking-tight">{value}</span>
    </div>
);

export default StrategyDashboard;