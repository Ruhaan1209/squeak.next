"use client";

import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { useNotification } from "@/contexts/NotificationContext";
import { useOrganizationAPI } from "@/hooks/useOrganizationAPI";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import type { CreateClassroomResponse, DeleteClassroomResponse, UpdateClassroomResponse } from "@/types";

export default function SettingsPage() {
  const { jwtToken } = useAuth();
  const { classrooms, fetchClassrooms, selectedClassroom } = useDashboard();
  const { showNotification } = useNotification();
  const { createCheckoutSession, cancelSubscriptionAtEndOfPeriod } = useOrganizationAPI();
  const [tab, setTab] = useState<"teacher" | "organization">("teacher");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const { data } = await apiFetch<CreateClassroomResponse>("/teacher/classroom/create", {
      method: "POST", body: JSON.stringify({ name: newName.trim() }),
    }, jwtToken);
    if (data) { showNotification("Classroom created!", "success"); setNewName(""); fetchClassrooms(); }
  };

  const handleUpdate = async (id: string) => {
    const { data } = await apiFetch<UpdateClassroomResponse>("/teacher/classroom/update", {
      method: "POST", body: JSON.stringify({ classroom_id: id, name: editName }),
    }, jwtToken);
    if (data) { showNotification("Classroom updated!", "success"); setEditingId(null); fetchClassrooms(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { data } = await apiFetch<DeleteClassroomResponse>("/teacher/classroom/delete", {
      method: "POST", body: JSON.stringify({ classroom_id: id }),
    }, jwtToken);
    if (data) { showNotification("Classroom deleted", "success"); fetchClassrooms(); }
  };

  const handleOrgUpgrade = async () => {
    const { data } = await createCheckoutSession();
    if (data?.redirect_url) window.location.href = data.redirect_url;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-primary mb-6">Settings</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("teacher")} className={`px-4 py-2 rounded-xl font-secondary text-sm cursor-pointer border-none ${tab === "teacher" ? "bg-selected text-black" : "bg-item-background text-text-secondary"}`}>Teacher</button>
        <button onClick={() => setTab("organization")} className={`px-4 py-2 rounded-xl font-secondary text-sm cursor-pointer border-none ${tab === "organization" ? "bg-selected text-black" : "bg-item-background text-text-secondary"}`}>Organization</button>
      </div>

      {tab === "teacher" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-lg font-primary mb-4">Classrooms</h2>
          <div className="flex gap-2 mb-4">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New classroom name"
              className="flex-1 px-4 py-2 rounded-xl border border-border font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-selected" />
            <button onClick={handleCreate} className="px-4 py-2 rounded-xl bg-selected text-black font-secondary text-sm cursor-pointer border-none">Create</button>
          </div>
          <div className="space-y-2">
            {classrooms.map((c) => (
              <div key={c.classroom_id} className="flex items-center justify-between bg-item-background rounded-xl px-4 py-3">
                {editingId === c.classroom_id ? (
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 px-2 py-1 rounded border border-border font-secondary text-sm mr-2" />
                ) : (
                  <div>
                    <span className="font-secondary text-sm font-medium">{c.name}</span>
                    <span className="font-secondary text-xs text-text-secondary ml-2">ID: {c.classroom_id}</span>
                    <span className="font-secondary text-xs text-text-secondary ml-2">Students: {c.students_count || 0}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {editingId === c.classroom_id ? (
                    <>
                      <button onClick={() => handleUpdate(c.classroom_id)} className="px-3 py-1 rounded-lg bg-selected text-black font-secondary text-xs cursor-pointer border-none">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded-lg bg-gray-200 font-secondary text-xs cursor-pointer border-none">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(c.classroom_id); setEditName(c.name); }} className="px-3 py-1 rounded-lg bg-white font-secondary text-xs cursor-pointer border border-border">Edit</button>
                      <button onClick={() => handleDelete(c.classroom_id)} className="px-3 py-1 rounded-lg bg-danger-bg text-danger font-secondary text-xs cursor-pointer border-none">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "organization" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-lg font-primary mb-4">Organization Billing</h2>
          <button onClick={handleOrgUpgrade} className="px-6 py-3 rounded-xl bg-selected text-black font-secondary text-sm cursor-pointer border-none hover:opacity-90">Upgrade Organization</button>
        </div>
      )}
    </div>
  );
}
