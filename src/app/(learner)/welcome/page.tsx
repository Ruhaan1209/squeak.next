"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileAPI } from "@/hooks/useProfileAPI";
import { useNotification } from "@/contexts/NotificationContext";
import { AVAILABLE_TOPICS } from "@/lib/topics";

const STEPS = ["username", "language", "level", "topics", "goal", "complete"] as const;
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LANGUAGES = ["French", "Spanish"];

export default function WelcomePage() {
  const router = useRouter();
  const { upsertProfile } = useProfileAPI();
  const { showNotification } = useNotification();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [goal, setGoal] = useState(3);
  const [loading, setLoading] = useState(false);

  const toggleTopic = (t: string) => {
    setTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await upsertProfile({
        username, learning_language: language, skill_level: level,
        interested_topics: topics, daily_questions_goal: goal,
      });
      router.push("/learn");
    } catch {
      showNotification("Failed to create profile. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    switch (STEPS[step]) {
      case "username": return username.trim().length > 0;
      case "language": return language !== "";
      case "level": return level !== "";
      case "topics": return topics.length > 0;
      case "goal": return goal > 0;
      default: return true;
    }
  };

  const btnClass = "px-6 py-3 rounded-xl font-secondary text-sm cursor-pointer border-none transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white rounded-2xl shadow-base p-8 w-full max-w-lg">
        <div className="flex gap-1 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-selected" : "bg-gray-200"}`} />
          ))}
        </div>

        {STEPS[step] === "username" && (
          <div>
            <h2 className="text-2xl font-primary mb-2">What should we call you?</h2>
            <p className="text-text-secondary font-secondary mb-6">Choose a username.</p>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"
              className="w-full px-4 py-3 rounded-xl border border-border font-secondary text-base focus:outline-none focus:ring-2 focus:ring-selected" />
          </div>
        )}

        {STEPS[step] === "language" && (
          <div>
            <h2 className="text-2xl font-primary mb-2">What language are you learning?</h2>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {LANGUAGES.map((l) => (
                <button key={l} onClick={() => setLanguage(l)}
                  className={`${btnClass} ${language === l ? "bg-selected text-black" : "bg-item-background text-text-secondary hover:bg-gray-200"} py-4 text-base`}>{l}</button>
              ))}
            </div>
          </div>
        )}

        {STEPS[step] === "level" && (
          <div>
            <h2 className="text-2xl font-primary mb-2">What&apos;s your level?</h2>
            <p className="text-text-secondary font-secondary mb-6">Select your current proficiency.</p>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map((l) => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`${btnClass} ${level === l ? "bg-selected text-black" : "bg-item-background text-text-secondary hover:bg-gray-200"} py-4 text-base`}>{l}</button>
              ))}
            </div>
          </div>
        )}

        {STEPS[step] === "topics" && (
          <div>
            <h2 className="text-2xl font-primary mb-2">What interests you?</h2>
            <p className="text-text-secondary font-secondary mb-6">Select your favorite topics.</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TOPICS.map((t) => (
                <button key={t} onClick={() => toggleTopic(t)}
                  className={`${btnClass} ${topics.includes(t) ? "bg-selected text-black" : "bg-item-background text-text-secondary hover:bg-gray-200"}`}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {STEPS[step] === "goal" && (
          <div>
            <h2 className="text-2xl font-primary mb-2">Daily goal</h2>
            <p className="text-text-secondary font-secondary mb-6">How many questions per day?</p>
            <div className="flex items-center gap-4 justify-center">
              <button onClick={() => setGoal(Math.max(1, goal - 1))} className={`${btnClass} bg-item-background text-lg px-4`}>-</button>
              <span className="text-3xl font-primary">{goal}</span>
              <button onClick={() => setGoal(goal + 1)} className={`${btnClass} bg-item-background text-lg px-4`}>+</button>
            </div>
          </div>
        )}

        {STEPS[step] === "complete" && (
          <div className="text-center">
            <h2 className="text-2xl font-primary mb-2">You&apos;re all set!</h2>
            <p className="text-text-secondary font-secondary mb-6">Ready to start learning {language}?</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 0 && <button onClick={() => setStep(step - 1)} className={`${btnClass} bg-item-background text-text-secondary`}>Back</button>}
          <div className="ml-auto">
            {STEPS[step] !== "complete" ? (
              <button onClick={() => setStep(step + 1)} disabled={!canNext()} className={`${btnClass} bg-selected text-black disabled:opacity-50`}>Next</button>
            ) : (
              <button onClick={handleFinish} disabled={loading} className={`${btnClass} bg-selected text-black disabled:opacity-50`}>{loading ? "Creating..." : "Start Learning"}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
