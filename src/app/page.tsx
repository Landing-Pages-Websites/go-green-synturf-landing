"use client";

import { useState, useEffect, useRef } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            setCount(target);
            clearInterval(interval);
          } else {
            setCount(current);
          }
        }, 30);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="font-display text-5xl md:text-6xl font-bold text-primary">{count}{suffix}</div>;
}

export default function LandingPage() {
  const { submit: submitLead, isSubmitting } = useMegaLeadForm();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", needsType: "", message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloating(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.needsType) return;
    try {
      await submitLead(formData);
      setSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", needsType: "", message: "" });
    } catch { /* fail silently */ }
  };

  const LeadForm = ({ id = "hero-form" }: { id?: string }) => (
    <form id={id} onSubmit={handleSubmit} className="bg-dark-card/90 backdrop-blur-md rounded-2xl p-8 border border-dark-border shadow-2xl">
      <h3 className="font-display text-3xl font-bold mb-2 text-primary uppercase tracking-wide">Get Your Quote</h3>
      <p className="text-text-muted mb-6 text-sm">Fill out the form below and our team will reach out within 24 hours.</p>
      
      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h4 className="font-display text-2xl font-bold text-white mb-2">Thank You!</h4>
          <p className="text-text-muted">We&apos;ll be in touch within 24 hours.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" name="firstName" placeholder="First Name" required className="bg-dark border-2 border-dark-border rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary outline-none transition-colors" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <input type="text" name="lastName" placeholder="Last Name" required className="bg-dark border-2 border-dark-border rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary outline-none transition-colors" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="email" name="email" placeholder="Email" required className="bg-dark border-2 border-dark-border rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary outline-none transition-colors" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="tel" name="phone" placeholder="Phone" required className="bg-dark border-2 border-dark-border rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary outline-none transition-colors" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <select name="needsType" required className="w-full bg-dark border-2 border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors mb-3" value={formData.needsType} onChange={(e) => setFormData({ ...formData, needsType: e.target.value })}>
            <option value="">What best describes your needs? *</option>
            <option value="residential">I&apos;m a homeowner (Residential)</option>
            <option value="commercial">I&apos;m a property/facility manager (Commercial)</option>
            <option value="contractor">I&apos;m a contractor or installer</option>
            <option value="dealer">I&apos;m a turf dealer</option>
          </select>
          <textarea name="message" placeholder="Tell us about your project (optional)" rows={3} className="w-full bg-dark border-2 border-dark-border rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary outline-none transition-colors mb-4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-black font-bold py-4 rounded-lg text-lg uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50">
            {isSubmitting ? "Submitting..." : "Get Your Quote"}
          </button>
        </>
      )}
    </form>
  );

  return (
    <>
      <QueryParamPersistence />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-dark/95 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <span className="font-display text-xl font-bold uppercase">
              <span className="text-white">Go</span>
              <span className="text-primary"> Green</span>
              <span className="text-text-muted text-sm ml-1">Synturf</span>
            </span>
          </div>
          <a href="#hero-form" className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-all">
            Get Quote
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="min-h-screen pt-20 flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-secondary/5" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
          <div>
            <Reveal>
              <div className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
                Premium Engineered Turf Systems
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 uppercase leading-[0.95]">
                GO TO THE <span className="text-primary">MAXX</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-text-muted mb-8 leading-relaxed max-w-lg">
                Go Green Synthetic Turf engineers premium artificial turf solutions built for performance, durability, and innovation. Six product lines. Unlimited possibilities.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a href="#hero-form" className="bg-primary text-black px-8 py-4 rounded-lg font-bold text-lg uppercase tracking-wider hover:bg-primary/90 transition-all">
                  Get Your Quote
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={400}>
            <LeadForm />
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 bg-dark-card border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <AnimatedCounter target={15} suffix="+" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm">Years Experience</div>
              </div>
              <div>
                <AnimatedCounter target={500} suffix="+" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm">Projects Completed</div>
              </div>
              <div>
                <AnimatedCounter target={6} />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm">Product Lines</div>
              </div>
              <div>
                <AnimatedCounter target={50} suffix="+" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm">States Served</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product Lines */}
      <section id="products" className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-4">Our Product Lines</div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-white uppercase">Engineered Turf Products</h2>
              <p className="text-text-muted mt-4 text-lg max-w-2xl mx-auto">Six specialized product lines, each engineered for specific applications and environments.</p>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "HEATMAXX", tagline: "Beat the Heat", desc: "Advanced heat-resistant technology that keeps surface temperatures significantly cooler than standard turf. Ideal for Sunbelt regions and high-temperature environments.", color: "from-orange-500/20 to-red-500/20" },
              { name: "AQUAMAXX", tagline: "Superior Drainage", desc: "Engineered drainage system handles heavy rainfall with ease. Perfect for flood-prone areas and properties that demand rapid water management.", color: "from-blue-500/20 to-cyan-500/20" },
              { name: "LAWNMAXX", tagline: "Premium Landscaping", desc: "The most realistic residential turf on the market. Ultra-soft blades, natural color variation, and a lush appearance that rivals real grass.", color: "from-green-500/20 to-emerald-500/20" },
              { name: "PETMAXX", tagline: "Pet-Friendly Protection", desc: "Antimicrobial-treated turf designed for pet owners. Easy cleaning, odor control technology, and durable construction that stands up to heavy use.", color: "from-amber-500/20 to-yellow-500/20" },
              { name: "SPORTMAXX", tagline: "Athletic Performance", desc: "Professional-grade athletic turf for sports fields, training facilities, and recreational areas. Consistent ball roll, shock absorption, and certified safety.", color: "from-purple-500/20 to-indigo-500/20" },
              { name: "PLAYMAXX", tagline: "Safe Play Surfaces", desc: "IPEMA-certified playground surfaces with fall-height ratings. Maximum safety for children with soft landing and antimicrobial protection.", color: "from-pink-500/20 to-rose-500/20" }
            ].map((product, index) => (
              <Reveal key={product.name} delay={index * 80}>
                <div className={`bg-gradient-to-br ${product.color} rounded-2xl p-8 border border-dark-border hover:border-primary/50 transition-all group`}>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-primary uppercase tracking-wider mb-1">{product.name}<span className="text-white">®</span></h3>
                  <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-4">{product.tagline}</div>
                  <p className="text-text-muted leading-relaxed">{product.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={500}>
            <div className="flex justify-center mt-12">
              <a href="#contact" className="bg-primary text-black px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-primary/90 transition-all">
                Request Product Samples
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Go Green */}
      <section id="why-us" className="py-24 bg-dark-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-4">Our Difference</div>
                <h2 className="font-display text-5xl font-bold text-white uppercase mb-6">Built Different. <span className="text-primary">Built Better.</span></h2>
                <p className="text-text-muted text-lg mb-6 leading-relaxed">
                  At Go Green, we believe in creating the best turf on the market. While remaining grounded in the roots of manufacturing, we also believe in relentless innovation. Our team is constantly pushing forward, staying ahead of the curve.
                </p>
                <p className="text-text-muted text-lg mb-8 leading-relaxed">
                  Our customers are our number one priority. This isn't about simply keeping you happy — this is about creating the best experience from start to finish. Knowledge, confidence, and ultimate support in your future as a top distributor.
                </p>
                <div className="space-y-4">
                  {["USA-manufactured premium materials", "Rigorous quality testing on every batch", "Dedicated dealer & installer support", "Industry-leading warranties", "Custom solutions for any project"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span className="text-text-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-10 border border-dark-border">
                <h3 className="font-display text-3xl font-bold text-primary uppercase mb-6">What We Believe</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display text-xl font-bold text-white uppercase mb-2">Faith-Driven</h4>
                    <p className="text-text-muted">A faith-based company that chooses daily to glorify God in everything we do.</p>
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-white uppercase mb-2">Trust First</h4>
                    <p className="text-text-muted">Creating an atmosphere of trust that surrounds your relationship with our team.</p>
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-white uppercase mb-2">Customer Obsessed</h4>
                    <p className="text-text-muted">Your support is what binds us to this industry. We go above and beyond.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section id="audience" className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-4">Who We Serve</div>
              <h2 className="font-display text-5xl font-bold text-white uppercase">Your Partner in Turf</h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Homeowners", desc: "Premium residential turf for lawns, backyards, rooftops, and patios. Year-round green without the maintenance." },
              { title: "Property Managers", desc: "Commercial-grade turf for HOAs, apartment complexes, office parks, and municipal spaces. Low maintenance, high impact." },
              { title: "Contractors & Installers", desc: "Wholesale pricing, technical support, and training for installation professionals. Become a certified Go Green installer." },
              { title: "Turf Dealers", desc: "Distribution partnerships with competitive margins, marketing support, and exclusive territory opportunities." }
            ].map((audience, index) => (
              <Reveal key={audience.title} delay={index * 100}>
                <div className="bg-dark-card rounded-2xl p-8 border border-dark-border text-center hover:border-primary/50 transition-all">
                  <h3 className="font-display text-xl font-bold text-primary uppercase mb-4">{audience.title}</h3>
                  <p className="text-text-muted leading-relaxed">{audience.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div className="flex justify-center mt-12">
              <a href="#contact" className="bg-primary text-black px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-primary/90 transition-all">
                Start Your Partnership
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 bg-dark-card">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-4">How It Works</div>
              <h2 className="font-display text-5xl font-bold text-white uppercase">Simple Process, Premium Results</h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Tell us about your project. We'll recommend the right product line and provide expert guidance." },
              { step: "02", title: "Product Selection", desc: "Choose from six engineered turf lines. Request free samples to see and feel the quality." },
              { step: "03", title: "Customization", desc: "We tailor specifications to your exact project requirements — size, drainage, usage, climate." },
              { step: "04", title: "Delivery & Support", desc: "Fast shipping nationwide with full installation guides, technical support, and warranty coverage." }
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 150}>
                <div className="text-center">
                  <div className="font-display text-6xl font-bold text-primary/30 mb-4">{item.step}</div>
                  <h3 className="font-display text-xl font-bold text-white uppercase mb-3">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-4">Testimonials</div>
              <h2 className="font-display text-5xl font-bold text-white uppercase">Trusted by Professionals</h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Go Green's HEATMAXX product completely transformed our approach to Sunbelt installations. Our clients are thrilled with the temperature difference.", name: "Marcus D.", role: "Certified Installer, Arizona" },
              { quote: "As a dealer, the margins and support from Go Green are unmatched. Their team genuinely cares about our success in the market.", name: "Jennifer R.", role: "Turf Distributor, Texas" },
              { quote: "SPORTMAXX delivered exactly what our athletic facility needed — consistent performance, safety certifications, and a surface our athletes love.", name: "Coach Williams", role: "Athletic Director, Georgia" }
            ].map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 100}>
                <div className="bg-dark-card rounded-2xl p-8 border border-dark-border">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-text-light mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-text-muted text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-dark-card">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-4">FAQ</div>
              <h2 className="font-display text-5xl font-bold text-white uppercase">Common Questions</h2>
            </div>
          </Reveal>
          
          <div className="space-y-4">
            {[
              { q: "What makes Go Green turf different from competitors?", a: "Our six engineered product lines are each designed for specific applications. Unlike one-size-fits-all solutions, we match the right turf to your exact environment — heat resistance, drainage, pet safety, or athletic performance." },
              { q: "Do you offer dealer and installer programs?", a: "Yes. We offer competitive wholesale pricing, exclusive territory opportunities, technical training, marketing support, and dedicated account management for qualified dealers and installers." },
              { q: "How long does synthetic turf last?", a: "Go Green turf products are engineered for 15-20+ years of performance with proper installation and minimal maintenance. All products include comprehensive warranties." },
              { q: "Can I get samples before ordering?", a: "Absolutely. We offer free product samples for all six turf lines. Fill out the form and specify which products you'd like to evaluate." },
              { q: "Do you ship nationwide?", a: "Yes. We ship to all 50 states with competitive freight rates. Most orders ship within 5-7 business days from our warehouse." },
              { q: "What maintenance does synthetic turf require?", a: "Minimal. Occasional brushing to keep fibers upright, rinsing for debris removal, and light infill top-ups as needed. No mowing, watering, or fertilizing." }
            ].map((faq, index) => (
              <Reveal key={index} delay={index * 80}>
                <div className="bg-dark rounded-xl p-6 border border-dark-border">
                  <h3 className="font-display text-lg font-bold text-white uppercase mb-3">{faq.q}</h3>
                  <p className="text-text-muted leading-relaxed">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={500}>
            <div className="flex justify-center mt-12">
              <a href="#contact" className="bg-primary text-black px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-primary/90 transition-all">
                Still Have Questions? Ask Us
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA / Contact */}
      <section id="contact" className="py-24 bg-gradient-to-b from-dark to-dark-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Reveal>
            <div className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-4">Ready to Get Started?</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white uppercase mb-6">
              Join the Go Green <span className="text-primary">Family</span>
            </h2>
            <p className="text-text-muted text-xl mb-12 max-w-2xl mx-auto">
              Whether you're a homeowner, contractor, or dealer — we have the right turf solution for you. Get your free quote today.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="max-w-2xl mx-auto">
              <LeadForm id="contact-form" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-dark border-t border-dark-border text-center">
        <p className="text-text-muted text-sm">
          © 2026 Go Green Synthetic Turf. All rights reserved.
        </p>
      </footer>

      {/* Floating CTA */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${showFloating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
        <a href="#contact" className="bg-primary text-black px-6 py-4 rounded-full font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
          Get Quote
        </a>
      </div>
    </>
  );
}