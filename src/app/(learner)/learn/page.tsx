"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileAPI } from "@/hooks/useProfileAPI";
import { useNewsAPI } from "@/hooks/useNewsAPI";
import { useStoryAPI } from "@/hooks/useStoryAPI";
import { useProgressAPI } from "@/hooks/useProgressAPI";
import type { NewsItem, StoryItem, GetProfileResponse } from "@/types";
import { getCEFRColor, getCEFRTextColor } from "@/lib/cefr";
import { welcomeMsg } from "@/lib/welcome-msg";
import Link from "next/link";

export default function LearnPage() {
  const router = useRouter();
  const { getProfile } = useProfileAPI();
  const { queryNews } = useNewsAPI();
  const { queryStories } = useStoryAPI();
  const { getStreak } = useProgressAPI();

  const [profile, setProfile] = useState<GetProfileResponse | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"today" | "search">("today");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProfile();
        if (!data) { router.push("/welcome"); return; }
        setProfile(data);

        const [newsData, storyData, streakData] = await Promise.all([
          queryNews({ language: data.learning_language, cefr: data.skill_level, subject: "any", page: "1", pagesize: "6" }),
          queryStories({ language: data.learning_language, cefr: data.skill_level, subject: "any", page: "1", pagesize: "6" }),
          getStreak(),
        ]);
        setNews(newsData);
        setStories(storyData);
        setStreak(streakData.streak || 0);
      } catch { router.push("/welcome"); }
      finally { setLoading(false); }
    };
    load();
  }, [getProfile, queryNews, queryStories, getStreak, router]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-selected" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-primary mb-1">
          {profile ? `${welcomeMsg[profile.learning_language] || "Welcome,"} ${profile.username}` : "Welcome!"}
        </h1>
        {streak > 0 && <p className="text-sm font-secondary text-text-secondary">Current streak: {streak} days</p>}
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("today")} className={`px-4 py-2 rounded-xl font-secondary text-sm cursor-pointer border-none transition-colors ${tab === "today" ? "bg-selected text-black" : "bg-item-background text-text-secondary hover:bg-gray-200"}`}>Today</button>
        <button onClick={() => setTab("search")} className={`px-4 py-2 rounded-xl font-secondary text-sm cursor-pointer border-none transition-colors ${tab === "search" ? "bg-selected text-black" : "bg-item-background text-text-secondary hover:bg-gray-200"}`}>Browse</button>
      </div>

      {tab === "today" && (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-primary mb-4">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item) => (
                <Link key={item.id} href={`/read/News/${item.id}`} className="no-underline">
                  <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-hover transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-secondary px-2 py-0.5 rounded-full ${getCEFRColor(item.cefr_level)} ${getCEFRTextColor(item.cefr_level)}`}>{item.cefr_level}</span>
                      <span className="text-xs font-secondary text-text-secondary">{item.topic}</span>
                    </div>
                    <h3 className="font-primary text-base mb-2 text-text-primary line-clamp-2">{item.title}</h3>
                    <p className="font-secondary text-sm text-text-secondary line-clamp-3">{item.preview_text}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-primary mb-4">Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((item) => (
                <Link key={item.id} href={`/read/Story/${item.id}`} className="no-underline">
                  <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-hover transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-secondary px-2 py-0.5 rounded-full ${getCEFRColor(item.cefr_level)} ${getCEFRTextColor(item.cefr_level)}`}>{item.cefr_level}</span>
                      <span className="text-xs font-secondary text-text-secondary">{item.topic}</span>
                    </div>
                    <h3 className="font-primary text-base mb-2 text-text-primary line-clamp-2">{item.title}</h3>
                    <p className="font-secondary text-sm text-text-secondary line-clamp-3">{item.preview_text}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === "search" && (
        <div className="text-center py-12">
          <p className="font-secondary text-text-secondary">Content browser - search by language, level, and topic.</p>
          <p className="font-secondary text-sm text-text-secondary mt-2">Coming in the next iteration.</p>
        </div>
      )}
    </div>
  );
}
