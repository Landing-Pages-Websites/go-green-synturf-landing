"use client";

import { useState } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

export default function LandingPage() {
  const { submit: submitLead, isSubmitting } = useMegaLeadForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    needsType: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.needsType) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await submitLead(formData);
      alert("Thank you! We'll be in touch soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        needsType: "",
        message: ""
      });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const LeadForm = () => (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h3 className="font-display text-2xl font-bold mb-4 text-primary">Get Your Quote</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <select
        name="needsType"
        required
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none mb-4"
        value={formData.needsType}
        onChange={(e) => setFormData({ ...formData, needsType: e.target.value })}
      >
        <option value="">Please tell us what best describes your needs?</option>
        <option value="residential">I'm a homeowner (Residential)</option>
        <option value="commercial">I'm a property/facility manager (Commercial)</option>
        <option value="contractor">I'm a contractor or installer</option>
        <option value="dealer">I'm a turf dealer</option>
      </select>

      <textarea
        name="message"
        placeholder="Tell us about your project (optional)"
        rows={3}
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none mb-4"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Get My Quote"}
      </button>
    </form>
  );

  return (
    <>
      <QueryParamPersistence />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-display text-2xl font-bold text-primary">
            GO GREEN SYNTURF
          </div>
          <a
            href="#contact"
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Get Quote
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen bg-gradient-to-br from-green-50 to-primary/10 pt-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <h1 className="font-display text-6xl md:text-7xl font-bold text-gray-900 mb-6">
                PREMIUM SYNTHETIC TURF SYSTEMS
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Go Green Synthetic Turf specializes in premium artificial turf solutions for dealers, installers, and commercial prospects. Our engineered turf products deliver exceptional performance and durability.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="#contact"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg text-center hover:opacity-90"
                >
                  Get Your Quote
                </a>
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal delay={600}>
              <LeadForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-gray-600">Quality Guaranteed</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">6</div>
                <div className="text-gray-600">Product Lines</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="font-display text-5xl font-bold text-center mb-4">
              ENGINEERED TURF PRODUCTS
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">
              Premium synthetic turf solutions for every application
            </p>
          </Reveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "HEATMAXX", desc: "Superior heat resistance technology" },
              { name: "AQUAMAXX", desc: "Advanced drainage performance" },
              { name: "LAWNMAXX", desc: "Premium residential landscaping" },
              { name: "PETMAXX", desc: "Pet-friendly antimicrobial protection" },
              { name: "SPORTMAXX", desc: "Professional athletic applications" },
              { name: "PLAYMAXX", desc: "Safe playground surfaces" }
            ].map((product, index) => (
              <Reveal key={product.name} delay={index * 100}>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-display text-2xl font-bold text-primary mb-3">
                    {product.name}®
                  </h3>
                  <p className="text-gray-600 mb-6">{product.desc}</p>
                  <a
                    href="#contact"
                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
                  >
                    Learn More
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <h2 className="font-display text-5xl font-bold mb-6">
                OUR DIFFERENCE
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                At Go Green, we believe in creating the best turf on the market. While remaining grounded in the roots of manufacturing is quite the accomplishment for Go Green, we also believe in innovation.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Our team consists of highly motivated members that do just that. Innovate. We are constantly trying to move forward and stay ahead of the curve.
              </p>
              <a
                href="#contact"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90"
              >
                Partner With Us
              </a>
            </Reveal>
            <Reveal delay={300}>
              <div className="bg-primary/10 rounded-xl p-8">
                <h3 className="font-display text-3xl font-bold text-primary mb-4">
                  WHAT WE BELIEVE
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li>Faith-based company glorifying God in everything we do</li>
                  <li>Creating an atmosphere of trust with our partners</li>
                  <li>Customer service through and through</li>
                  <li>Supporting our dealers and installers</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="font-display text-5xl font-bold mb-6">
              READY TO GET STARTED?
            </h2>
            <p className="text-xl mb-12 opacity-90">
              Join the Go Green family and discover premium synthetic turf solutions for your business.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="max-w-2xl mx-auto">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <p className="text-sm opacity-75">
          © 2026 Go Green Synthetic Turf. All rights reserved.
        </p>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="#contact"
          className="bg-primary text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:opacity-90 transition-opacity"
        >
          Get Quote
        </a>
      </div>
    </>
  );
}