"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import FAQ from "@/components/ui/FAQ";
import SubscriptionDetails from "@/components/ui/SubscriptionDetails";

export default function HomePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRoleModal, setShowRoleModal] = useState(!searchParams.has("section"));
  const [animationsEnabled, setAnimationsEnabled] = useState(!showRoleModal);

  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/learn");
    });
  }, [router]);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
        features: featuresRef,
        pricing: pricingRef,
        faq: faqRef,
      };
      setTimeout(() => refs[section]?.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [searchParams]);

  const handleRoleSelection = (role: "individual" | "teacher") => {
    if (role === "teacher") {
      router.push("/educators");
    } else {
      setShowRoleModal(false);
      setAnimationsEnabled(true);
    }
  };

  const headingWords = "Learn Languages Reading What You Love.".split(" ");

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-border">
        <h1 className="text-xl font-primary font-bold">Squeak</h1>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/?section=features" className="text-sm font-secondary text-text-secondary hover:text-text-primary">Features</Link>
          <Link href="/?section=pricing" className="text-sm font-secondary text-text-secondary hover:text-text-primary">Pricing</Link>
          <Link href="/?section=faq" className="text-sm font-secondary text-text-secondary hover:text-text-primary">FAQs</Link>
        </nav>
        <div className="flex gap-3">
          <button onClick={() => router.push("/auth/login")} className="cursor-pointer text-sm font-secondary px-4 py-2 rounded-2xl border border-border hover:bg-gray-50 transition-colors">Log In</button>
          <button onClick={() => router.push("/auth/signup")} className="cursor-pointer text-sm font-secondary px-4 py-2 rounded-2xl bg-selected text-black hover:opacity-90 transition-opacity">Get Started</button>
        </div>
      </header>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="z-[1000] bg-black/50 flex fixed inset-0 justify-center items-center">
          <div className="rounded-2xl bg-white py-4 px-8">
            <h2 className="mt-2 text-center text-lg font-primary mb-4">I am a...</h2>
            <div className="mb-4 flex gap-4">
              <button onClick={() => handleRoleSelection("individual")} className="cursor-pointer border-none font-secondary hover:bg-selected bg-item-background text-black py-3 px-12 rounded-2xl text-base transition-colors">Individual</button>
              <button onClick={() => handleRoleSelection("teacher")} className="cursor-pointer border-none font-secondary hover:bg-selected bg-item-background text-black py-3 px-12 rounded-2xl text-base transition-colors">Teacher</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-primary mb-6 max-w-3xl">
          {headingWords.map((word, i) => (
            <span key={i} className={`inline-block mr-3 ${animationsEnabled ? "animate-slide-in" : ""}`} style={{ animationDelay: `${0.5 + i * 0.15}s`, animationFillMode: "backwards" }}>
              {word}
            </span>
          ))}
        </h2>
        <p className="text-lg text-text-secondary font-secondary max-w-xl mb-8">
          Fluency with an effective, all-around platform using content tailored to your interests and skill level.
        </p>
        <div className="flex gap-4">
          <button onClick={() => router.push("/auth/signup")} className="cursor-pointer border-none font-secondary bg-selected text-black py-3 px-12 rounded-2xl text-base hover:opacity-90 transition-opacity">Get Started</button>
          <button onClick={() => router.push("/auth/login")} className="cursor-pointer font-secondary border border-border text-text-secondary py-3 px-8 rounded-2xl text-base hover:bg-gray-50 transition-colors">I have an account</button>
        </div>
      </section>

      {/* Languages */}
      <section className="flex flex-col items-center py-8">
        <p className="text-base text-gray-600 font-secondary text-center mb-4">Our supported languages (with more coming soon!)</p>
        <div className="flex gap-8 items-center justify-center">
          {["🇫🇷 French", "🇪🇸 Spanish"].map((lang) => (
            <span key={lang} className="text-lg font-secondary text-text-secondary">{lang}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} id="features" className="py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-primary text-center mb-4">
          Built for <span className="text-selected bg-emphasis px-2 rounded">Everyone</span>
        </h2>
        <p className="text-text-secondary font-secondary text-center max-w-xl mb-12">
          We deliver languages the right way - enjoyable, understandable, and challenging content.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          {[
            { title: "Personalized Content", desc: "Stories and news tailored to your interests and skill level." },
            { title: "Instant Translation", desc: "Click any word or sentence for immediate translations." },
            { title: "Track Progress", desc: "Daily goals, streaks, and comprehension exercises." },
          ].map((f) => (
            <div key={f.title} className="bg-item-background rounded-2xl p-6 text-center">
              <h3 className="font-primary text-lg mb-2">{f.title}</h3>
              <p className="font-secondary text-sm text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef} id="pricing" className="py-16 px-4 flex flex-col items-center bg-white">
        <h2 className="text-3xl md:text-4xl font-primary text-center mb-4">
          Simple <span className="text-selected bg-emphasis px-2 rounded">Pricing</span>
        </h2>
        <p className="text-text-secondary font-secondary text-center italic mb-8">Quality learning for every student.</p>
        <div className="flex justify-center gap-8 flex-wrap">
          <SubscriptionDetails title="Free" price={0} priceUnit="/month" benefits={["Unlimited stories", "Unlimited articles", "Unlimited exercises", "Basic translation features"]} buttonText="Sign Up" onButtonClick={() => router.push("/auth/signup")} />
          <SubscriptionDetails title="Premium" price={0.99} priceUnit="/month" benefits={["Everything in Free", "Natural Pronunciations", "Premium Speech-to-Text", "Audiobook Mode", "Tutor Mode"]} buttonText="Go Premium" onButtonClick={() => router.push("/auth/signup")} />
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} id="faq" className="py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-primary text-center mb-8">FAQs</h2>
        <FAQ faqs={[
          { question: "Is Squeak available for multiple languages?", answer: "Currently, Squeak supports French and Spanish. We're working hard to add more languages soon!" },
          { question: "Is Squeak free?", answer: "Yes! Squeak's full content library and basic exercises are 100% free." },
          { question: "How do you source your news articles?", answer: "We combine hundreds of different news sources and create articles translated into your target language and difficulty. Squeak will NEVER make up any information." },
          { question: "What are the exercises in Squeak?", answer: "Squeak offers exercises across all skills: writing, reading, listening, and speaking with comprehension questions and conversational practice." },
        ]} />
      </section>

      {/* CTA */}
      <section className="py-16 flex flex-col items-center bg-white">
        <h2 className="text-2xl md:text-4xl font-primary text-center mb-8">
          Learn the right way with <span className="text-selected bg-emphasis px-2 rounded">Squeak!</span>
        </h2>
        <button onClick={() => router.push("/auth/signup")} className="cursor-pointer border-none font-secondary bg-selected text-black py-3 px-12 rounded-2xl text-base hover:opacity-90 transition-opacity">Get Started</button>
      </section>

      <Footer />
    </div>
  );
}
