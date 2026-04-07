"use client";

import { useEffect, useState } from "react";
import { useProfileAPI } from "@/hooks/useProfileAPI";
import { useProgressAPI } from "@/hooks/useProgressAPI";
import { useBillingAPI } from "@/hooks/useBillingAPI";
import { usePlatform } from "@/contexts/PlatformContext";
import { useNotification } from "@/contexts/NotificationContext";
import type { GetProfileResponse } from "@/types";
import { AVAILABLE_TOPICS } from "@/lib/topics";

export default function ProfilePage() {
  const { getProfile, upsertProfile } = useProfileAPI();
  const { getStreak } = useProgressAPI();
  const { getBillingAccount, createCheckoutSession, cancelSubscriptionAtEndOfPeriod } = useBillingAPI();
  const { plan, checkPlan, isTeacher } = usePlatform();
  const { showNotification } = useNotification();

  const [profile, setProfile] = useState<GetProfileResponse | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTopics, setEditTopics] = useState<string[]>([]);
  const [editGoal, setEditGoal] = useState(3);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, streakRes] = await Promise.all([getProfile(), getStreak()]);
        if (profileRes.data) {
          setProfile(profileRes.data);
          setEditTopics(profileRes.data.interested_topics);
          setEditGoal(profileRes.data.daily_questions_goal || 3);
        }
        setStreak(streakRes.streak || 0);
      } catch (err) {
        const detail =
          err instanceof Error
            ? err.message
            : typeof err === "object" && err !== null
              ? JSON.stringify(err)
              : String(err);
        console.error("Profile load failed:", detail, err);
      }
      finally { setLoading(false); }
    };
    load();
  }, [getProfile, getStreak]);

  const handleSave = async () => {
    if (!profile) return;
    try {
      await upsertProfile({ ...profile, interested_topics: editTopics, daily_questions_goal: editGoal });
      setProfile({ ...profile, interested_topics: editTopics, daily_questions_goal: editGoal });
      setEditing(false);
      showNotification("Profile updated!", "success");
    } catch { showNotification("Failed to update profile", "error"); }
  };

  const handleUpgrade = async () => {
    const { data } = await createCheckoutSession();
    if (data?.redirect_url) window.location.href = data.redirect_url;
  };

  const handleCancel = async () => {
    const { data } = await cancelSubscriptionAtEndOfPeriod();
    if (data?.success) { showNotification("Subscription cancelled. Active until end of period.", "success"); checkPlan(); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-selected" /></div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-primary mb-6">Profile</h1>

      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-xs font-secondary text-text-secondary">Username</p><p className="font-secondary font-medium">{profile.username}</p></div>
          <div><p className="text-xs font-secondary text-text-secondary">Language</p><p className="font-secondary font-medium">{profile.learning_language}</p></div>
          <div><p className="text-xs font-secondary text-text-secondary">Level</p><p className="font-secondary font-medium">{profile.skill_level}</p></div>
          <div><p className="text-xs font-secondary text-text-secondary">Streak</p><p className="font-secondary font-medium">{streak} days</p></div>
          {isTeacher && <div className="col-span-2"><span className="px-3 py-1 bg-emphasis rounded-full text-xs font-secondary">Teacher</span></div>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-primary">Preferences</h2>
          <button onClick={() => editing ? handleSave() : setEditing(true)} className="px-4 py-2 rounded-xl bg-selected text-black font-secondary text-sm cursor-pointer border-none">{editing ? "Save" : "Edit"}</button>
        </div>
        <div className="mb-4">
          <p className="text-xs font-secondary text-text-secondary mb-2">Topics</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TOPICS.map((t) => (
              <button key={t} onClick={() => editing && setEditTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}
                className={`px-3 py-1.5 rounded-xl font-secondary text-xs border-none cursor-pointer transition-colors ${editTopics.includes(t) ? "bg-selected text-black" : "bg-item-background text-text-secondary"} ${!editing && "cursor-default"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-secondary text-text-secondary mb-2">Daily Goal: {editGoal} questions</p>
          {editing && (
            <input type="range" min={1} max={20} value={editGoal} onChange={(e) => setEditGoal(Number(e.target.value))} className="w-full" />
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-lg font-primary mb-4">Subscription</h2>
        <p className="font-secondary mb-4">Current plan: <strong>{plan}</strong></p>
        {plan === "FREE" ? (
          <button onClick={handleUpgrade} className="px-6 py-3 rounded-xl bg-selected text-black font-secondary text-sm cursor-pointer border-none hover:opacity-90">Upgrade to Premium - $0.99/mo</button>
        ) : (
          <button onClick={handleCancel} className="px-6 py-3 rounded-xl bg-danger-bg text-danger font-secondary text-sm cursor-pointer border-none hover:opacity-90">Cancel Subscription</button>
        )}
      </div>
    </div>
  );
}
