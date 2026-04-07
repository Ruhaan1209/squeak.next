"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import Footer from "@/components/ui/Footer";
import SubscriptionDetails from "@/components/ui/SubscriptionDetails";
import FAQ from "@/components/ui/FAQ";

export default function Educators() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/learn");
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-border">
        <h1 className="text-xl font-primary font-bold cursor-pointer" onClick={() => router.push("/")}>Squeak</h1>
        <button onClick={() => router.push("/auth/signup")} className="cursor-pointer text-sm font-secondary px-4 py-2 rounded-2xl bg-selected text-black hover:opacity-90 transition-opacity">Get Started</button>
      </header>

      <section className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-primary mb-4">Squeak for Educators</h2>
        <p className="text-lg text-text-secondary font-secondary max-w-xl mb-8">
          Manage classrooms, moderate content, and track student progress with our teacher dashboard.
        </p>
        <button onClick={() => router.push("/auth/signup")} className="cursor-pointer border-none font-secondary bg-selected text-black py-3 px-12 rounded-2xl text-base hover:opacity-90 transition-opacity">
          Create Teacher Account
        </button>
      </section>

      <section className="py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl font-primary text-center mb-8">Educator Pricing</h2>
        <div className="flex justify-center gap-8 flex-wrap">
          <SubscriptionDetails title="Free" price={0} priceUnit="/month" benefits={["1 classroom", "Content moderation", "Basic analytics"]} buttonText="Get Started" onButtonClick={() => router.push("/auth/signup")} />
          <SubscriptionDetails title="Classroom" price={4.99} priceUnit="/month" benefits={["Unlimited classrooms", "Whitelist content", "Priority support", "Advanced analytics"]} buttonText="Go Classroom" onButtonClick={() => router.push("/auth/signup")} />
        </div>
      </section>

      <section className="py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl font-primary text-center mb-8">FAQs</h2>
        <FAQ faqs={[
          { question: "How do classrooms work?", answer: "Create a classroom, share the code with students, and they can join to access curated content at their level." },
          { question: "Can I moderate what students read?", answer: "Yes! With the Classroom plan, you can whitelist specific content for your students." },
        ]} />
      </section>

      <Footer />
    </div>
  );
}
