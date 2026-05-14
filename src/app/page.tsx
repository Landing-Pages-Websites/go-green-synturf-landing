"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

const PHONE = "(844) 875-5999";
const PHONE_HREF = "tel:8448755999";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length === 10;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const step = Math.ceil(target / 50);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { setCount(target); clearInterval(interval); }
          else { setCount(current); }
        }, 25);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count}{suffix}</div>;
}

function LeadFormContent({ onSubmit, isSubmitting, submitted }: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitted: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(100,214,19,0.2)" }}>
          <svg className="w-8 h-8" style={{ color: "#83B940" }} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h4 className="text-2xl font-black mb-2" style={{ color: "#000000" }}>Thank You!</h4>
        <p style={{ color: "#64748b" }}>Our team will be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => {
      if (!isValidPhone(phone)) { e.preventDefault(); setPhoneError(true); return; }
      setPhoneError(false);
      onSubmit(e);
    }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="firstName" type="text" placeholder="First Name" required
          className="border-2 rounded-lg px-4 py-3 placeholder-gray-400 outline-none transition-colors w-full text-sm"
          style={{ borderColor: "#e2e8f0", color: "#4d4d4d" }}
          onFocus={e => (e.target.style.borderColor = "#83B940")}
          onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
        <input name="lastName" type="text" placeholder="Last Name" required
          className="border-2 rounded-lg px-4 py-3 placeholder-gray-400 outline-none transition-colors w-full text-sm"
          style={{ borderColor: "#e2e8f0", color: "#4d4d4d" }}
          onFocus={e => (e.target.style.borderColor = "#83B940")}
          onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
      </div>
      <input name="email" type="email" placeholder="Email Address" required
        className="border-2 rounded-lg px-4 py-3 placeholder-gray-400 outline-none transition-colors w-full text-sm"
        style={{ borderColor: "#e2e8f0", color: "#4d4d4d" }}
        onFocus={e => (e.target.style.borderColor = "#83B940")}
        onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
      <div>
        <input name="phone" type="tel" inputMode="numeric" placeholder="(555) 123-4567" required
          value={phone}
          onChange={e => { setPhone(formatPhone(e.target.value)); if (phoneError) setPhoneError(false); }}
          pattern="\(\d{3}\) \d{3}-\d{4}" title="Please enter a valid 10-digit phone number"
          className="border-2 rounded-lg px-4 py-3 placeholder-gray-400 outline-none transition-colors w-full text-sm"
          style={{ borderColor: phoneError ? "#ef4444" : "#e2e8f0", color: "#4d4d4d" }}
          onFocus={e => { if (!phoneError) e.target.style.borderColor = "#83B940"; }}
          onBlur={e => { if (!phoneError) e.target.style.borderColor = "#e2e8f0"; }} />
        {phoneError && <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit phone number.</p>}
      </div>
      <select name="needsType" required defaultValue=""
        className="border-2 rounded-lg px-4 py-3 outline-none transition-colors w-full text-sm bg-white"
        style={{ borderColor: "#e2e8f0", color: "#4d4d4d" }}
        onFocus={e => (e.target.style.borderColor = "#83B940")}
        onBlur={e => (e.target.style.borderColor = "#e2e8f0")}>
        <option value="" disabled>Please tell us what best describes your needs?</option>
        <option value="residential">I am a homeowner (Residential)</option>
        <option value="commercial">I am a property/facility manager (Commercial)</option>
        <option value="contractor">I am a contractor or installer</option>
        <option value="dealer">I am a turf dealer</option>
      </select>
      <textarea name="message" placeholder="Tell us about your project (optional)" rows={3}
        className="border-2 rounded-lg px-4 py-3 placeholder-gray-400 outline-none transition-colors w-full text-sm resize-none"
        style={{ borderColor: "#e2e8f0", color: "#4d4d4d" }}
        onFocus={e => (e.target.style.borderColor = "#83B940")}
        onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
      <button type="submit" disabled={isSubmitting}
        className="w-full font-black py-4 rounded-lg text-base uppercase tracking-wide transition-all disabled:opacity-50 shadow-lg"
        style={{ backgroundColor: "#83B940", color: "#000000" }}>
        {isSubmitting ? "Submitting..." : "Apply for Dealer Pricing"}
      </button>
    </form>
  );
}

export default function LandingPage() {
  const { submit: submitLead } = useMegaLeadForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 700);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setIsSubmitting(true);
    try {
      await submitLead({
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        phone: data.get("phone"),
        needsType: data.get("needsType"),
        message: data.get("message") || "",
      });
      setSubmitted(true);
      form.reset();
    } catch { /* fail silently */ }
    finally { setIsSubmitting(false); }
  }, [submitLead, setIsSubmitting]);

  const products = [
    { name: "HEATMAXX® SOFT", tagline: "Stay Cool Under Pressure", desc: "Patented heat-reduction technology keeps surface temperatures significantly cooler — ideal for Sunbelt climates and high-sun environments.", img: "https://www.gogreensynturf.com/wp-content/uploads/2024/10/HEATMAXX-47S-7-web.jpg", bg: "#FFF3E0", badge: "#FF6900" },
    { name: "AQUAMAXX®", tagline: "Built for Superior Drainage", desc: "Our quickest draining product with outstanding durability and appearance. Perfect for pool surrounds, backyards, and areas with heavy rainfall — keeping your space both pet and family friendly.", img: "https://www.gogreensynturf.com/wp-content/uploads/2025/03/Aquamaxx-75-rolled.png", bg: "#E3F2FD", badge: "#0693e3" },
    { name: "PETMAXX®", tagline: "Engineered for Pets", desc: "Premium tuft bind holds up to rough pet play. Superior drainage eliminates odor from pet waste while keeping your backyard both pet and family friendly.", img: "https://www.gogreensynturf.com/wp-content/uploads/2022/09/Petmaxx-CSmall.jpg", bg: "#FFF8E1", badge: "#fcb900" },
    { name: "SPORTMAXX®", tagline: "Professional-Grade Athletics", desc: "All nylon yarns with intricate tuft patterns for unmatched performance and color consistency. Built for golf, sport practice fields, gyms, and high-traffic applications.", img: "https://www.gogreensynturf.com/wp-content/uploads/2025/03/Sportmaxx-100.png", bg: "#EDE7F6", badge: "#7c3aed" },
  ];

  const testimonials = [
    { quote: "Go Green's HEATMAXX completely transformed our approach to Sunbelt installations. Our clients love the temperature difference — total game changer.", name: "Marcus D.", role: "Certified Installer, Arizona" },
    { quote: "As a dealer, the margins and support from Go Green are unmatched. Their team genuinely invests in our success. Best partnership I've had in this industry.", name: "Jennifer R.", role: "Turf Distributor, Texas" },
    { quote: "SPORTMAXX delivered exactly what our facility needed — consistent performance, safety certs, and a surface our athletes actually prefer over natural grass.", name: "Coach Williams", role: "Athletic Director, Georgia" },
    { quote: "PETMAXX has been a revelation for our dog park. Easy cleaning, zero odor problems, and it looks fantastic year-round. Our clients request it by name.", name: "Sarah M.", role: "Property Manager, Florida" },
    { quote: "The AQUAMAXX drainage around our pool deck is incredible. Heavy rain — the surface is dry in minutes. Product quality is absolutely top tier.", name: "David L.", role: "Homeowner, Louisiana" },
    { quote: "Professional team, quality product, they stand behind every warranty claim without question. Go Green is our go-to for every residential job.", name: "Kevin T.", role: "Landscape Contractor, Nevada" },
  ];

  const faqs = [
    { q: "What makes Go Green different from competitors?", a: "Our four purpose-built product lines are each engineered for specific use cases — heat reduction, drainage, pets, and sports. We don't sell one turf for everything. We match the right product to your exact environment, climate, and application." },
    { q: "Do you offer dealer and installer programs?", a: "Yes. We offer competitive wholesale pricing, exclusive territory opportunities, technical training, co-branded marketing materials, and dedicated account management for qualified dealers and certified installers." },
    { q: "How long does Go Green Synthetic Turf last?", a: "Our products are engineered for 15–20+ years of performance with proper installation and routine maintenance. All product lines include comprehensive manufacturer warranties." },
    { q: "Can I request samples before ordering?", a: "Absolutely. Free samples are available for all four product lines. Fill out the form on this page, specify which products you'd like to evaluate, and we'll send them promptly." },
    { q: "Do you ship nationwide?", a: "Yes. We ship to all 50 states with competitive freight rates. Most orders ship within 5–7 business days from our manufacturing facility." },
    { q: "What maintenance does synthetic turf require?", a: "Very little. Occasional brushing to keep fibers upright, periodic rinsing for debris removal, and light infill top-ups as needed. No mowing, no watering, no fertilizing — ever." },
  ];

  return (
    <>
      <QueryParamPersistence />

      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 z-[100] h-1 transition-none" style={{ width: `${scrollProgress}%`, backgroundColor: "#83B940" }} />

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 shadow-sm" style={{ backgroundColor: "rgba(255,255,255,0.97)", borderBottom: "1px solid #e2e8f0", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.gogreensynturf.com/wp-content/uploads/2022/09/GGLogoDark.png" alt="Go Green Synthetic Turf" className="h-14 w-auto" />
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF} className="hidden sm:flex items-center gap-2 border-2 rounded-lg px-4 py-2 font-bold text-sm transition-all" style={{ borderColor: "#000000", color: "#000000" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#000000"; (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#000000"; }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {PHONE}
            </a>
            <a href="#contact" className="rounded-lg px-5 py-2.5 font-black text-sm uppercase tracking-wide transition-all shadow-md" style={{ backgroundColor: "#83B940", color: "#000000" }}>
              Apply for Dealer Pricing
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="min-h-screen pt-16 flex items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f0f7e8 0%, #ffffff 50%, #e8f0ff 100%)" }}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" style={{ backgroundColor: "rgba(100,214,19,0.08)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" style={{ backgroundColor: "rgba(0,51,136,0.05)" }} />

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-16">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6" style={{ backgroundColor: "rgba(100,214,19,0.15)", color: "#6B9A34", border: "1px solid rgba(100,214,19,0.3)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#83B940" }} />
                Vertically Integrated Manufacturer • Dealer Program Open
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display font-black mb-6 uppercase leading-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#000000", lineHeight: "1.0" }}>
                WHOLESALE SYNTHETIC TURF
                <span className="block" style={{ color: "#83B940" }}>FOR DEALERS</span>
                <span className="block" style={{ color: "#4d4d4d", fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>&amp; INSTALLERS</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <ul id="hero-bullets" className="flex flex-wrap gap-x-5 gap-y-2 mb-6" aria-label="Dealer program highlights">
                {["Wholesale pricing", "Bulk rolls available", "32+ product SKUs", "Nationwide shipping", "Manufacturer-direct"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm md:text-base font-semibold" style={{ color: "#000000" }}>
                    <span aria-hidden="true" className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black" style={{ backgroundColor: "#83B940", color: "#000000" }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-lg mb-8 leading-relaxed max-w-lg" style={{ color: "#64748b" }}>
                Go Green Synthetic Turf is a U.S. manufacturer of 32+ products across eight specialized lines — engineered for sports, heat-prone climates, pets, and pools. Wholesale pricing, qualified leads, and exclusive territories for dealers and installers.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="flex flex-wrap gap-4 items-center mb-8">
                {["32+ Products • 8 Specialized Lines", "Class A Fire Rated (ASTM E648)", "Only Burn Warranty in the Industry"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#4d4d4d" }}>
                    <svg className="w-5 h-5" style={{ color: "#83B940" }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div id="hero-form" className="bg-white rounded-2xl shadow-2xl p-8" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#83B940" }} />
                <div>
                  <h2 className="text-xl font-black uppercase" style={{ color: "#000000" }}>Request Dealer Pricing</h2>
                  <p className="text-sm" style={{ color: "#64748b" }}>We&apos;ll respond within 24 hours</p>
                </div>
              </div>
              <LeadFormContent onSubmit={handleSubmit} isSubmitting={isSubmitting} submitted={submitted} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS BAR */}
      <section id="stats" className="py-16" style={{ backgroundColor: "#000000" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { target: 32, suffix: "+", label: "Products in Catalog" },
                { target: 8, suffix: "", label: "Specialized Lines" },
                { target: 428, suffix: "°F", label: "HEATMAXX Melt Point" },
                { target: 50, suffix: "", label: "States Shipped" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-black" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "#83B940" }}>
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 uppercase tracking-wider text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              <a href="#contact" className="rounded-xl px-8 py-3 font-black uppercase tracking-wide transition-all" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Apply for Dealer Pricing
              </a>
              <a href={PHONE_HREF} className="border-2 border-white text-white rounded-xl px-6 py-2.5 font-bold text-sm transition-all">
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SPORTS & GOLF TURF (B2B QS — sports keyword theme) */}
      <section id="sports-golf-turf" className="py-24 relative overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(100,214,19,0.05)" }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#6B9A34" }}>Sports • Golf • Athletic Surfaces</div>
              <h2 className="font-display font-black uppercase leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#000000" }}>
                Professional Sports<span className="block" style={{ color: "#83B940" }}>Turf Systems</span>
              </h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto" style={{ color: "#64748b" }}>
                SPORTMAXX® is engineered for the demands of competitive play. 100% nylon construction with intricate tuft patterns delivers consistent ball roll, color uniformity, and unmatched durability across baseball, soccer, golf, and high-traffic training applications.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-10 items-center mt-6">
            <Reveal delay={100}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://www.gogreensynturf.com/wp-content/uploads/2022/09/Platinum-Putt-CSmall.jpg" alt="SPORTMAXX professional golf putting green turf" className="w-full h-[420px] object-cover" />
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-wider" style={{ backgroundColor: "#7c3aed" }}>SPORTMAXX®</div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="space-y-4">
                {[
                  { title: "Baseball & Soccer Fields", desc: "Shock-absorbing fiber systems engineered for player safety, consistent ball response, and year-round playability — even after heavy rotation." },
                  { title: "Golf Putting Greens & Tees", desc: "Tour-grade Platinum Putt, Emerald Putt, and Fescue Tan profiles deliver authentic ball roll and spin for residential, commercial, and tournament installations." },
                  { title: "Athletic Training Surfaces", desc: "Gym floors, agility lanes, and indoor practice facilities — built to handle cleats, weights, and continuous foot traffic without matting." },
                  { title: "Specs Pros Demand", desc: "100% nylon yarn, IPEMA-tested pad systems available, GMAX/HIC compliance for athletic safety, and replacement-grade durability across every SPORTMAXX SKU." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#f8f9fa" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(124,58,237,0.15)" }}>
                      <svg className="w-5 h-5" style={{ color: "#7c3aed" }} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-wide text-sm mb-1" style={{ color: "#000000" }}>{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Spec a Sports Turf Project
              </a>
              <a href={PHONE_HREF} className="border-2 rounded-xl px-8 py-3 font-bold text-base transition-all" style={{ borderColor: "#000000", color: "#000000" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HEAT-RESISTANT NYLON TURF (B2B QS — nylon keyword theme) */}
      <section id="nylon-heat-turf" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fff3e0 0%, #ffffff 60%)" }}>
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(255,105,0,0.08)" }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#FF6900" }}>Heat-Resistant • Nylon Construction</div>
              <h2 className="font-display font-black uppercase leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#000000" }}>
                HEATMAXX<span className="block" style={{ color: "#FF6900" }}>Melt-Proof Nylon Turf</span>
              </h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto" style={{ color: "#64748b" }}>
                Built for Sunbelt climates and Low-E window reflections. HEATMAXX® SOFT is the only synthetic turf in the industry warranted against reflective-burn damage — backed by a 428°F melting point and Class A fire rating (ASTM E648).
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            <Reveal delay={100}>
              <div className="bg-white rounded-2xl p-8 border shadow-sm h-full" style={{ borderColor: "#FFE0B2" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(255,105,0,0.15)" }}>
                  <svg className="w-7 h-7" style={{ color: "#FF6900" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  </svg>
                </div>
                <h3 className="font-display font-black uppercase mb-3 text-lg" style={{ color: "#000000" }}>428°F Melt Point</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  Nylon fibers handle direct sun, hot patios, and reflective glare without warping or matting. Where polyethylene fails near 250°F, HEATMAXX holds form under conditions that destroy competitor turf.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="bg-white rounded-2xl p-8 border shadow-sm h-full" style={{ borderColor: "#FFE0B2" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(255,105,0,0.15)" }}>
                  <svg className="w-7 h-7" style={{ color: "#FF6900" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="font-display font-black uppercase mb-3 text-lg" style={{ color: "#000000" }}>Only Burn Warranty</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  HEATMAXX SOFT is the only turf in the industry warranted against Low-E window reflective burns — the #1 callback installers face in modern construction. Sell with confidence, install without the warranty risk.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bg-white rounded-2xl p-8 border shadow-sm h-full" style={{ borderColor: "#FFE0B2" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(255,105,0,0.15)" }}>
                  <svg className="w-7 h-7" style={{ color: "#FF6900" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display font-black uppercase mb-3 text-lg" style={{ color: "#000000" }}>Class A Fire Rated</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  ASTM E648 Class A flame-spread rating — code-compliant for commercial installs, rooftops, multifamily, and municipal projects where lower-rated turf gets rejected at inspection.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={400}>
            <div className="mt-10 flex items-center justify-center">
              <div className="bg-white rounded-2xl border p-6 max-w-3xl text-center shadow-sm" style={{ borderColor: "#FFE0B2" }}>
                <p className="text-base" style={{ color: "#4d4d4d" }}>
                  <strong>Priority dealer markets:</strong> Dallas/Fort Worth, Phoenix, Las Vegas, Los Angeles, Inland Empire, and the broader Sunbelt — where heat and Low-E glare callbacks are highest. Ask about exclusive territory protection.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#FF6900", color: "#ffffff" }}>
                Request HEATMAXX Samples
              </a>
              <a href={PHONE_HREF} className="border-2 rounded-xl px-8 py-3 font-bold text-base transition-all" style={{ borderColor: "#000000", color: "#000000" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRODUCT LINES */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#6B9A34" }}>Four Engineered Product Lines</div>
              <h2 className="font-display font-black uppercase leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#000000" }}>
                Purpose-Built for<span className="block" style={{ color: "#83B940" }}>Every Application</span>
              </h2>
              <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>
                Not one turf fits all. Each product line is precision-engineered for a specific environment, use case, and performance standard.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <Reveal key={product.name} delay={index * 80}>
                <div className="rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col" style={{ backgroundColor: product.bg, borderColor: "#e2e8f0" }}>
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: product.badge }}>{product.name}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display font-black uppercase mb-1 text-xl" style={{ color: "#000000" }}>{product.tagline}</h3>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: "#64748b" }}>{product.desc}</p>
                    <a href="#contact" className="inline-flex items-center gap-1 font-bold text-sm mt-4 transition-all" style={{ color: "#6B9A34" }}>
                      Get a Sample
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={500}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Request Free Product Samples
              </a>
              <a href={PHONE_HREF} className="border-2 rounded-xl px-8 py-3 font-bold text-base transition-all" style={{ borderColor: "#000000", color: "#000000" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY GO GREEN */}
      <section id="why-us" className="py-24" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#6B9A34" }}>Our Difference</div>
                <h2 className="font-display font-black uppercase leading-tight mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#000000" }}>
                  Built Different.<span className="block" style={{ color: "#83B940" }}>Built Better.</span>
                </h2>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: "#64748b" }}>
                  At Go Green, we believe in creating the best turf on the market. While remaining grounded in our manufacturing roots, we relentlessly innovate — staying ahead of the curve and bringing our dealer network with us.
                </p>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: "#64748b" }}>
                  Our customers are our number one priority. We&apos;re not just selling turf — we&apos;re building lasting partnerships built on knowledge, confidence, and ultimate support.
                </p>
                <div className="space-y-4">
                  {["USA-manufactured premium materials", "Rigorous quality testing on every batch", "Dedicated dealer and installer support", "Industry-leading warranties on all products", "Custom solutions tailored to your project"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#83B940" }}>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="font-medium" style={{ color: "#4d4d4d" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://www.gogreensynturf.com/wp-content/uploads/2025/02/Mat1.png" alt="Go Green Synthetic Turf Manufacturing Quality" className="w-full rounded-2xl shadow-2xl" />
                <div className="absolute -bottom-6 -left-6 text-white rounded-xl p-6 shadow-xl max-w-xs" style={{ backgroundColor: "#000000" }}>
                  <div className="font-black text-3xl mb-1" style={{ color: "#83B940" }}>15+</div>
                  <div className="text-sm font-semibold uppercase tracking-wide">Years engineering premium synthetic turf systems</div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-16">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Learn More — Get a Free Quote
              </a>
              <a href={PHONE_HREF} className="border-2 rounded-xl px-8 py-3 font-bold text-base transition-all" style={{ borderColor: "#000000", color: "#000000" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section id="audience" className="py-24" style={{ backgroundColor: "#000000" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#83B940" }}>Who We Serve</div>
              <h2 className="font-display font-black text-white uppercase leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Your Partner in<span className="block" style={{ color: "#83B940" }}>Premium Turf</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Homeowners", desc: "Premium residential turf for lawns, backyards, rooftops, and patios. Year-round green without the maintenance or water bill.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { title: "Property Managers", desc: "Commercial-grade turf for HOAs, apartment complexes, office parks, and municipal spaces. Low maintenance, high curb appeal.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
              { title: "Contractors & Installers", desc: "Wholesale pricing, technical training, and dedicated support. Become a certified Go Green installer and grow your business.", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
              { title: "Turf Dealers", desc: "Distribution partnerships with competitive margins, exclusive territory opportunities, and dedicated account management.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            ].map((audience, index) => (
              <Reveal key={audience.title} delay={index * 100}>
                <div className="rounded-2xl p-8 border text-center transition-all" style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(100,214,19,0.2)" }}>
                    <svg className="w-7 h-7" style={{ color: "#83B940" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={audience.icon} />
                    </svg>
                  </div>
                  <h3 className="font-display font-black text-white uppercase mb-4">{audience.title}</h3>
                  <p className="leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{audience.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Start Your Partnership
              </a>
              <a href={PHONE_HREF} className="border-2 border-white text-white rounded-xl px-8 py-3 font-bold text-base transition-all hover:bg-white" style={{ color: "white" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DEALER & INSTALLER PROGRAM (B2B QS — dealer keyword theme) */}
      <section id="dealer-program" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f0f7e8 0%, #ffffff 50%, #fff3e0 100%)" }}>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(100,214,19,0.08)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(255,105,0,0.06)" }} />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: "rgba(100,214,19,0.15)", color: "#6B9A34", border: "1px solid rgba(100,214,19,0.3)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#83B940" }} />
                Wholesale • Territories • Qualified Leads
              </div>
              <h2 className="font-display font-black uppercase leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#000000" }}>
                Become a Go Green<span className="block" style={{ color: "#83B940" }}>Turf Dealer</span>
              </h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto" style={{ color: "#64748b" }}>
                Grow your turf business with a vertically integrated U.S. manufacturer that invests in your success. Wholesale pricing across 32+ products, exclusive territories in heat-prone markets, qualified consumer leads routed to you, and the only burn warranty in the industry.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "Exclusive Wholesale Pricing",
                desc: "Tiered dealer pricing across our full catalog — from Value Series at $2/SF to premium nylon SPORTMAXX. Margins structured for real profitability, not loss-leaders.",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Qualified Installation Leads",
                desc: "Consumer leads from our installation inquiry portal — filtered by geography and project type, then routed to the dealer partner in that territory. Not blast-marketed leads; matched leads.",
                icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Only Burn Warranty in Industry",
                desc: "HEATMAXX SOFT — the only synthetic turf warranted against Low-E window reflective burns. A product no competitor can match, in markets where this callback kills installer profitability.",
                icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
              },
              {
                title: "Exclusive Territory Protection",
                desc: "Priority dealer markets include Dallas/Fort Worth, Phoenix, Las Vegas, Los Angeles, and the Sunbelt. We protect serious partners — not flood your market with three competing dealers.",
                icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
              },
              {
                title: "Co-Branded Marketing & Training",
                desc: "Product training materials, sales enablement assets, co-branded collateral, and marketing support — so your team sells confidently and your customers see a premium brand behind your install.",
                icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
              },
              {
                title: "Reliable Nationwide Supply Chain",
                desc: "U.S. manufacturing with quick-ship warehousing — most dealer orders ship within 5–7 business days. No tariff exposure, no overseas lead times, no surprise stockouts on your active projects.",
                icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
              },
            ].map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 80}>
                <div className="bg-white rounded-2xl p-6 border shadow-sm h-full transition-all hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: "#e2e8f0" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(100,214,19,0.15)" }}>
                    <svg className="w-6 h-6" style={{ color: "#6B9A34" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={benefit.icon} />
                    </svg>
                  </div>
                  <h3 className="font-display font-black uppercase mb-2 text-base" style={{ color: "#000000" }}>{benefit.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{benefit.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* WHO QUALIFIES */}
          <Reveal delay={400}>
            <div className="mt-14 bg-white rounded-2xl border p-8 shadow-sm" style={{ borderColor: "#e2e8f0" }}>
              <h3 className="font-display font-black uppercase text-xl mb-4 text-center" style={{ color: "#000000" }}>Who Qualifies for the Dealer Program?</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {[
                  { title: "Turf Installers", desc: "Crews installing synthetic turf for residential, commercial, or municipal projects." },
                  { title: "Landscape Contractors", desc: "Adding a high-margin turf line to existing landscape, hardscape, or design-build services." },
                  { title: "General Contractors", desc: "Builders and remodelers specifying turf on residential or commercial new construction." },
                  { title: "Property Managers", desc: "HOAs, multifamily, and commercial portfolios specifying turf across multiple properties." },
                ].map((q) => (
                  <div key={q.title} className="p-4 rounded-xl" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="font-black uppercase tracking-wide text-sm mb-1" style={{ color: "#000000" }}>{q.title}</div>
                    <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{q.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm mt-6" style={{ color: "#64748b" }}>
                <strong>No minimum order required to start.</strong> Most dealers are onboarded and placing their first order within two weeks of application.
              </p>
            </div>
          </Reveal>

          {/* HOW TO BECOME A DEALER */}
          <Reveal delay={500}>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Submit Your Application", desc: "Fill out the dealer inquiry form below with your business details, target territory, and current project volume." },
                { step: "02", title: "Discovery Call", desc: "Our dealer development team reviews your application and schedules a call to discuss pricing tiers, territory availability, and partnership terms." },
                { step: "03", title: "Onboarding & First Order", desc: "After agreement signing, you get dealer pricing access, training materials, marketing resources, and our lead routing system — usually within two weeks." },
              ].map((s) => (
                <div key={s.step} className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: "#e2e8f0" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg" style={{ backgroundColor: "#000000", color: "#83B940" }}>{s.step}</div>
                    <div className="font-black uppercase tracking-wide text-sm" style={{ color: "#000000" }}>{s.title}</div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Apply for Dealer Pricing
              </a>
              <a href={PHONE_HREF} className="border-2 rounded-xl px-8 py-3 font-bold text-base transition-all" style={{ borderColor: "#000000", color: "#000000" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#6B9A34" }}>How It Works</div>
              <h2 className="font-display font-black uppercase leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#000000" }}>
                Simple Process.<span className="block" style={{ color: "#83B940" }}>Premium Results.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Tell us about your project. We recommend the right product line and provide expert technical guidance." },
              { step: "02", title: "Product Selection", desc: "Choose from four engineered turf lines. Request free samples to see and feel the quality before committing." },
              { step: "03", title: "Customization", desc: "We tailor specifications to your exact requirements — size, drainage, usage type, climate, and more." },
              { step: "04", title: "Delivery & Support", desc: "Fast nationwide shipping with full installation guides, technical support, and warranty coverage." },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 130}>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ backgroundColor: "#000000" }}>
                    <span className="font-display font-black text-2xl" style={{ color: "#83B940" }}>{item.step}</span>
                  </div>
                  <h3 className="font-display font-black uppercase mb-3" style={{ color: "#000000" }}>{item.title}</h3>
                  <p className="leading-relaxed text-sm" style={{ color: "#64748b" }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={550}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Get Started Today
              </a>
              <a href={PHONE_HREF} className="border-2 rounded-xl px-8 py-3 font-bold text-base transition-all" style={{ borderColor: "#000000", color: "#000000" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#6B9A34" }}>Testimonials</div>
              <h2 className="font-display font-black uppercase leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#000000" }}>
                Trusted by<span className="block" style={{ color: "#83B940" }}>Pros Nationwide</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <Reveal key={t.name} delay={index * 80}>
                <div className="bg-white rounded-2xl p-8 border transition-all hover:shadow-lg" style={{ borderColor: "#e2e8f0" }}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" style={{ color: "#fcb900" }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 leading-relaxed italic" style={{ color: "#4d4d4d" }}>&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <div className="font-black" style={{ color: "#000000" }}>{t.name}</div>
                    <div className="text-sm" style={{ color: "#64748b" }}>{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={500}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Join Our Growing Network
              </a>
              <a href={PHONE_HREF} className="border-2 rounded-xl px-8 py-3 font-bold text-base transition-all" style={{ borderColor: "#000000", color: "#000000" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#6B9A34" }}>Common Questions</div>
              <h2 className="font-display font-black uppercase leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#000000" }}>
                Everything You<span className="block" style={{ color: "#83B940" }}>Need to Know</span>
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={index * 60}>
                <div className="border-2 rounded-xl overflow-hidden transition-all" style={{ borderColor: openFaq === index ? "#83B940" : "#e2e8f0" }}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full text-left flex items-center justify-between gap-4 p-6 font-bold transition-colors"
                    style={{ color: "#000000", backgroundColor: openFaq === index ? "#f8f9fa" : "white" }}>
                    <span className="text-base leading-snug">{faq.q}</span>
                    <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} style={{ color: "#83B940" }} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6" style={{ backgroundColor: "#f8f9fa" }}>
                      <p className="leading-relaxed" style={{ color: "#64748b" }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
              <a href="#contact" className="rounded-xl px-10 py-4 font-black text-lg uppercase tracking-wide transition-all shadow-lg" style={{ backgroundColor: "#83B940", color: "#000000" }}>
                Still Have Questions? Ask Us
              </a>
              <a href={PHONE_HREF} className="border-2 rounded-xl px-8 py-3 font-bold text-base transition-all" style={{ borderColor: "#000000", color: "#000000" }}>
                Or call us: {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA / CONTACT */}
      <section id="contact" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #000000 0%, #001f55 100%)" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: "rgba(100,214,19,0.1)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <div className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#83B940" }}>Ready to Get Started?</div>
              <h2 className="font-display font-black text-white uppercase leading-tight mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                Request Wholesale<span className="block" style={{ color: "#83B940" }}>Pricing Today</span>
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
                Whether you&apos;re a dealer, installer, contractor, or property manager — get wholesale pricing, qualified leads, and territory protection from a vertically integrated U.S. manufacturer.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="max-w-2xl mx-auto">
              <div id="contact-form" className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#83B940" }} />
                  <div>
                    <h3 className="text-xl font-black uppercase" style={{ color: "#000000" }}>Request Dealer Pricing</h3>
                    <p className="text-sm" style={{ color: "#64748b" }}>We&apos;ll respond within 24 hours</p>
                  </div>
                </div>
                <LeadFormContent onSubmit={handleSubmit} isSubmitting={isSubmitting} submitted={submitted} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center" style={{ backgroundColor: "#1a1f2e" }}>
        <p className="text-sm" style={{ color: "#64748b" }}>
          &copy; 2026 Go Green Synthetic Turf. All rights reserved.{" "}
          <a href="https://www.gogreensynturf.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b" }} className="hover:text-white transition-colors">Privacy Policy</a>
          {" | "}
          <a href="https://www.gogreensynturf.com/terms-conditions/" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b" }} className="hover:text-white transition-colors">Terms of Service</a>
        </p>
      </footer>

      {/* FLOATING STICKY CTA */}
      <div className={`fixed z-40 transition-all duration-500 bottom-0 left-0 right-0 sm:bottom-6 sm:right-6 sm:left-auto sm:w-auto ${showFloating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
        <a href="#contact" className="flex items-center justify-center gap-2 px-6 py-4 sm:rounded-full font-black uppercase tracking-wide text-sm shadow-2xl" style={{ backgroundColor: "#83B940", color: "#000000", boxShadow: "0 8px 32px rgba(100,214,19,0.4)" }}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          Apply for Dealer Pricing
        </a>
      </div>
    </>
  );
}
