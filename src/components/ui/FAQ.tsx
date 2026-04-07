"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer border-none bg-transparent"
          >
            <span className="font-secondary font-medium text-sm">{faq.question}</span>
            <span className="text-text-secondary text-lg">{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <div className="px-6 pb-4">
              <p className="font-secondary text-sm text-text-secondary">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
