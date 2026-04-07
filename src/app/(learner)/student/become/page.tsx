"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentAPI } from "@/hooks/useStudentAPI";
import { useNotification } from "@/contexts/NotificationContext";

export default function BecomeStudentPage() {
  const router = useRouter();
  const { joinClassroom } = useStudentAPI();
  const { showNotification } = useNotification();
  const [classroomId, setClassroomId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classroomId.trim()) return;
    setLoading(true);
    try {
      await joinClassroom(classroomId.trim());
      showNotification("Joined classroom successfully!", "success");
      router.push("/learn");
    } catch {
      showNotification("Failed to join classroom. Check the ID and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-primary mb-2">Join a Classroom</h1>
      <p className="text-text-secondary font-secondary mb-6">Enter the classroom ID your teacher gave you.</p>
      <form onSubmit={handleJoin} className="flex flex-col gap-4">
        <input value={classroomId} onChange={(e) => setClassroomId(e.target.value)} placeholder="Classroom ID"
          className="w-full px-4 py-3 rounded-xl border border-border font-secondary text-base focus:outline-none focus:ring-2 focus:ring-selected" />
        <button type="submit" disabled={loading || !classroomId.trim()}
          className="w-full py-3 rounded-xl bg-selected text-black font-secondary font-medium cursor-pointer border-none hover:opacity-90 disabled:opacity-50">{loading ? "Joining..." : "Join Classroom"}</button>
      </form>
    </div>
  );
}
