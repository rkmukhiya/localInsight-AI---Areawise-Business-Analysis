// src/pages/Home.jsx
import React from "react";
import landscapeImage from "../assets/landscape.png"; // <-- IMPORTED YOUR IMAGE
import { Brain, BarChart3, MapPin, Building2, Users2, Footprints, Activity, Sparkles, FileText } from "lucide-react";
import { motion } from "framer-motion";

// --- Custom Styles for the AI-inspired landing page ---
const customStyles = `
  body {
    font-family: 'Inter', sans-serif; /* Clean, modern sans-serif */
    /* New background inspired by your image: dark purple-blue to near-black */
    background-color: #0a0a1a; 
    background-image: linear-gradient(110deg, #1a1a2e 0%, #0a0a1a 100%);
    background-attachment: fixed; /* Makes the background stay in place on scroll */
    color: #e0e7ff; /* Light, futuristic text color */
  }

  /* Hero section with a dark gradient and subtle tech pattern */
  .hero-background-ai {
    /* Removed the specific gradient, as it now inherits from the body */
    position: relative;
    overflow: hidden; /* For containing potential absolute elements */
  }

  /* Overlay for subtle grid/circuitry effect - updated color */
  .hero-background-ai::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(#2c2a4a 1px, transparent 1px); /* Subtler purple dot grid */
    background-size: 40px 40px;
    opacity: 0.2;
    z-index: 0;
  }

  /* Neon gradient text for highlights - NEW PALETTE (Indigo to Purple) */
  .neon-text-gradient {
    background: linear-gradient(90deg, #6366f1, #a855f7); /* Indigo-500 to Purple-500 */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  /* Neon button style - NEW PALETTE */
  .btn-neon {
    background: linear-gradient(90deg, #6366f1, #a855f7); /* Indigo to Purple */
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 9999px; /* Pill shape */
    font-weight: 700;
    letter-spacing: 0.05em;
    transition: all 0.4s ease;
    /* Updated shadow to match new colors */
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(168, 85, 247, 0.4); 
    position: relative;
    overflow: hidden;
  }
  .btn-neon:hover {
    transform: translateY(-3px) scale(1.02);
    /* Updated hover shadow */
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.7), 0 0 40px rgba(168, 85, 247, 0.6);
  }
  .btn-neon::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: skewX(-30deg);
    transition: all 0.7s ease;
  }
  .btn-neon:hover::after {
    left: 100%;
  }

  /* Glassy card effect adapted for new dark theme */
  .glass-card-dark {
    background: rgba(30, 27, 70, 0.1); /* Subtle purple-tinted glass */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1); /* Slightly stronger border */
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); /* Slightly stronger shadow */
  }

  /* Feature icon styling - NEW PALETTE */
  .feature-icon-circle {
    background: linear-gradient(45deg, #6366f1, #a855f7); /* Indigo to Purple */
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
  }

  /* Timeline line for process section - NEW PALETTE */
  .timeline-line-dark {
    background: linear-gradient(to bottom, #6366f1, #a855f7);
  }
`;

// --- Reusable Components ---

const FeatureCard = ({ Icon, title, description }) => (
  <div className="glass-card-dark p-8 rounded-[32px] text-center border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group">
    <div className="flex justify-center mb-6">
      <div className="p-5 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-indigo-500/20">
        <Icon className="w-8 h-8" />
      </div>
    </div>
    <h3 className="text-xl font-black text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

const ProcessStep = ({ step, title, description, reverse, Icon }) => (
  <div
    className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${reverse ? "md:flex-row-reverse" : ""
      } mb-24 relative`}
  >
    <motion.div
      initial={{ opacity: 0, x: reverse ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="md:w-5/12 text-center md:text-left z-10"
    >
      <div className="glass-card-dark p-8 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 group shadow-2xl">
        <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
            <Icon size={24} />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed font-medium">{description}</p>
      </div>
    </motion.div>

    <div className="relative flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] z-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
        <span className="transform -rotate-12 group-hover:rotate-0 transition-transform">{step}</span>
      </div>
      {/* Glow behind number */}
      <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 scale-150"></div>
    </div>

    <div className="md:w-5/12 hidden md:block"></div>
  </div>
);

const TestimonialCard = ({ quote, name, title, avatar }) => (
  <div className="glass-card-dark p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
    {avatar && (
      <img
        src={avatar}
        alt={name}
        className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-indigo-500" /* Updated border color */
      />
    )}
    <p className="text-lg italic text-gray-200 mb-5 leading-relaxed">
      "{quote}"
    </p>
    <div className="border-t border-gray-700 w-full pt-4">
      <p className="font-bold text-white text-md">{name}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </div>
);

// --- Page Sections ---

const HeroSection = () => {
  const [rotation, setRotation] = React.useState(0);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20 md:py-32 relative overflow-hidden"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Decorative animated elements */}
      <div className="absolute top-1/2 right-10 w-2 h-2 bg-indigo-400 rounded-full animate-ping-slow"></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>

      <div className="max-w-7xl mx-auto z-10 grid md:grid-cols-2 gap-10 lg:gap-16 items-center text-left">
        {/* --- Left Text Section --- */}
        <div className="md:pr-6 lg:pr-10">
          <h2 className="text-base md:text-lg uppercase tracking-widest text-indigo-400 mb-2 font-semibold">
            Local Insight AI
          </h2>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug md:leading-tight mb-5 tracking-tight">
            The New <br />
            <span className="neon-text-gradient">Intelligent Platform</span> for
            Local Growth
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed md:leading-loose">
            Unlock area-wise business analysis powered by cutting-edge AI — built
            to guide your local enterprise toward smarter growth decisions.
          </p>

          <a href="#features" className="btn-neon inline-block mt-2">
            Discover Insights
          </a>
        </div>

        {/* --- Image Section --- */}
        <div className="relative flex justify-center items-center md:justify-end mt-10 md:mt-0" style={{ perspective: "2000px" }}>
          <motion.img
            src={landscapeImage}
            alt="AI Platform Landscape"
            animate={{ rotateY: rotation }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            onClick={() => setRotation(rotation + 360)}
            className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl scale-105 md:scale-115 cursor-pointer hover:brightness-125 transition-all duration-500 active:scale-95"
            style={{
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 0 40px rgba(99, 102, 241, 0.3)) drop-shadow(0 0 100px rgba(168, 85, 247, 0.2))",
              mixBlendMode: "lighten"
            }}
          />
          {/* Subtle localized glow behind buildings */}
          <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full scale-110 pointer-events-none -z-10"></div>
        </div>
      </div>
    </section>
  );
};


const FeaturesSection = () => {
  const features = [
    {
      Icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Uncover hidden opportunities and mitigate risks with intelligent analysis of local market dynamics.",
    },
    {
      Icon: BarChart3,
      title: "Data Visualization & Trends",
      description:
        "See complex data brought to life through intuitive dashboards and charts, making trends easy to grasp.",
    },
    {
      Icon: Building2,
      title: "Market Forecasting / Predictions",
      description:
        "Anticipate future market shifts and consumer behavior to position your business ahead of the curve.",
    },
    {
      Icon: MapPin,
      title: "City Growth & Land Use",
      description:
        "Identify prime locations by analyzing zoning changes, permit trends, and urban development projects.",
    },
    {
      Icon: Users2,
      title: "Local Demographics & Needs",
      description:
        "Understand the unique characteristics of your local customer base – income, age, preferences, and unmet needs.",
    },
    {
      Icon: Footprints,
      title: "Mobility & Footfall",
      description:
        "Optimize your operations by tracking real-time movement data, peak hours, and pedestrian traffic.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Core Features Driving Your{" "}
            <span className="neon-text-gradient">Local Success</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Our platform equips local businesses with the intelligence to make
            confident, data-backed decisions and foster community growth.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};


const ProcessSection = () => (
  <section
    id="process"
    className="py-32 md:py-48 relative overflow-hidden"
  >
    {/* Smooth Transition Glow */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

    {/* Atmospheric Background Elements */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none"></div>

    <div className="container mx-auto px-6 relative z-10">
      <div className="text-center mb-32">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/20 mb-6">
          System Architecture
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
          The LocalInsight <span className="neon-text-gradient">Engine</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Our methodology bridges the gap between raw regional datasets and
          high-fidelity strategic roadmaps.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* The vertical timeline bar with glowing gradient */}
        <div className="absolute hidden md:block w-[2px] left-1/2 transform -translate-x-1/2 h-full top-0 bg-gradient-to-b from-indigo-500/0 via-indigo-500/50 to-purple-500/0"></div>

        <ProcessStep
          step={1}
          title="Data Aggregation"
          Icon={Activity}
          description="We securely ingest and normalize billions of local data points from public, social, and proprietary sources across your target region."
        />
        <ProcessStep
          step={2}
          title="AI-Powered Analysis"
          Icon={Sparkles}
          description='Our custom AI model, "LocalMind," processes the data, identifies complex patterns, and benchmarks your performance against the local market.'
          reverse
        />
        <ProcessStep
          step={3}
          title="Actionable Reports"
          Icon={FileText}
          description="Receive intuitive, customized reports delivered directly to your dashboard, complete with clear, prioritized recommendations to implement immediately."
        />
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "LocalInsight AI transformed how we approach marketing. We saw a significant increase in foot traffic within weeks of implementing their recommendations. It’s truly a local business game-changer!",
      name: "Maria Sanchez",
      title: "Owner, 'The Corner Cafe'",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      quote:
        "Before LocalInsight, we were guessing. Now, with their precise demographic data and trend forecasts, our new branch opening was the smoothest and most successful to date. Highly recommend!",
      name: "Javier Moreno",
      title: "CEO, 'Peak Fitness Gyms'",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      quote:
        "The data visualization made complex market dynamics so easy to understand. We optimized our product offerings and saw a direct boost in customer satisfaction and sales!",
      name: "Chloe Lim",
      title: "Manager, 'Urban Threads Boutique'",
      avatar: "https://randomuser.me/api/portraits/women/78.jpg",
    },
  ];
  return (
    <section
      id="testimonials"
      className="py-20 md:py-28" /* Removed bg-[#0e0e3e] */
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            What Local Leaders{" "}
            <span className="neon-text-gradient">Are Saying</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hear how LocalInsight AI is already transforming businesses in
            communities just like yours.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section
    id="cta"
    className="py-20 md:py-28 bg-gradient-to-br from-indigo-700 to-purple-700 text-white text-center" /* NEW PALETTE */
  >
    <div className="container mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 max-w-4xl mx-auto leading-tight">
        Ready to Stop Guessing and{" "}
        <span className="neon-text-gradient">Start Growing</span>?
      </h2>
      <p className="text-xl text-indigo-200 mb-10 max-w-3xl mx-auto leading-relaxed">
        {" "}
        {/* Updated text color */}
        Take the first step toward a data-driven future. Sign up for your free,
        7-day trial—no commitment, just pure local business intelligence.
      </p>
      <a
        href="#"
        className="btn-neon inline-block !bg-white !text-indigo-700 !shadow-none !px-12 !py-4" /* Updated text color */
      >
        Start My Free Analysis Now
      </a>
      <p className="text-sm text-indigo-200 mt-4">
        {" "}
        {/* Updated text color */}
        Full access to all features for 7 days. Limited spots available for
        immediate onboarding.
      </p>
    </div>
  </section>
);

const Footer = () => (
  <footer
    className="border-t border-white/10 py-10 text-center text-gray-400" /* Removed bg, updated border */
  >
    <div className="container mx-auto px-6">
      <p className="text-2xl font-bold text-white tracking-wide block mb-4">
        LocalInsight AI
      </p>
      <div className="flex justify-center space-x-8 mb-6 text-gray-500">
        <a
          href="#features"
          className="hover:text-white transition duration-300"
        >
          Features
        </a>
        <a href="#process" className="hover:text-white transition duration-300">
          Process
        </a>
        <a href="#" className="hover:text-white transition duration-300">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-white transition duration-300">
          Contact
        </a>
      </div>
      <p>
        &copy; {new Date().getFullYear()} LocalInsight AI. All rights reserved.
      </p>
    </div>
  </footer>
);

// --- Main Page Component ---
const Home = () => (
  <>
    {/* Google Fonts for 'Inter' (if not already in your project) */}
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <style>{customStyles}</style>
    <style>
      {`
        /* Keyframe animations for background blobs and pulsing elements */
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-fast {
            0% { transform: translate(0px, 0px) scale(1); }
            25% { transform: translate(15px, -25px) scale(1.05); }
            50% { transform: translate(-10px, 10px) scale(0.95); }
            75% { transform: translate(20px, 5px) scale(1.03); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.03); }
        }
        @keyframes ping {
            0% { transform: scale(0.2); opacity: 0.8; }
            100% { transform: scale(2); opacity: 0; }
        }
        @keyframes ping-slow {
            0% { transform: scale(0.5); opacity: 0.6; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        .animate-blob { animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55); }
        .animate-blob-fast { animation: blob-fast 10s infinite alternate cubic-bezier(0.42, 0, 0.58, 1); }
        .animate-pulse { animation: pulse 2s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
        .animate-ping { animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-fade-in { animation: fade-in 2s ease-out forwards; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        `}
    </style>
    <div className="relative">
      {" "}
      {/* Added relative to body to correctly position absolute elements */}
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <Footer />
    </div>
  </>
);

export default Home;
