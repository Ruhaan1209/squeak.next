"use client";

import { useEffect, useState } from "react";
import { useTeacherAPI } from "@/hooks/useTeacherAPI";
import { useDashboard } from "@/contexts/DashboardContext";
import { useNotification } from "@/contexts/NotificationContext";
import type { ClassroomContentItem } from "@/types";
import { getCEFRColor, getCEFRTextColor } from "@/lib/cefr";

export default function ModeratePage() {
  const { fetchContent, acceptContent, rejectContent } = useTeacherAPI();
  const { selectedClassroom } = useDashboard();
  const { showNotification } = useNotification();
  const [items, setItems] = useState<ClassroomContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadContent = async () => {
    if (!selectedClassroom) return;
    setLoading(true);
    try {
      const data = await fetchContent({
        language: "any", cefr: "any", subject: "any", page: String(page),
        pagesize: "20", whitelist: "any", classroom_id: selectedClassroom.classroom_id,
      });
      setItems(data);
    } catch { showNotification("Failed to load content", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadContent(); }, [selectedClassroom, page]);

  const handleAccept = async (item: ClassroomContentItem) => {
    try {
      await acceptContent({ classroom_id: selectedClassroom!.classroom_id, content_id: Number(item.id), content_type: item.content_type });
      showNotification("Content accepted", "success");
      loadContent();
    } catch { showNotification("Failed to accept content", "error"); }
  };

  const handleReject = async (item: ClassroomContentItem) => {
    try {
      await rejectContent({ classroom_id: selectedClassroom!.classroom_id, content_id: Number(item.id), content_type: item.content_type });
      showNotification("Content rejected", "success");
      loadContent();
    } catch { showNotification("Failed to reject content", "error"); }
  };

  if (!selectedClassroom) return <p className="font-secondary text-text-secondary">Select a classroom to moderate content.</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-primary mb-6">Moderate Content</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-selected" /></div>
      ) : items.length === 0 ? (
        <p className="font-secondary text-text-secondary text-center py-12">No content to moderate.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.content_type}-${item.id}`} className="bg-white rounded-2xl border border-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-secondary px-2 py-0.5 rounded-full ${getCEFRColor(item.cefr_level)} ${getCEFRTextColor(item.cefr_level)}`}>{item.cefr_level}</span>
                  <span className="text-xs font-secondary text-text-secondary">{item.content_type}</span>
                  <span className="text-xs font-secondary text-text-secondary">{item.topic}</span>
                </div>
                <h3 className="font-primary text-base mb-1">{item.title}</h3>
                <p className="font-secondary text-sm text-text-secondary line-clamp-2">{item.preview_text}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleAccept(item)} className="px-4 py-2 rounded-xl bg-green-100 text-green-800 font-secondary text-sm cursor-pointer border-none hover:bg-green-200">Accept</button>
                <button onClick={() => handleReject(item)} className="px-4 py-2 rounded-xl bg-red-100 text-red-800 font-secondary text-sm cursor-pointer border-none hover:bg-red-200">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl bg-item-background font-secondary text-sm cursor-pointer border-none disabled:opacity-50">Previous</button>
        <span className="font-secondary text-sm text-text-secondary py-2">Page {page}</span>
        <button onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-xl bg-item-background font-secondary text-sm cursor-pointer border-none">Next</button>
      </div>
    </div>
  );
}
