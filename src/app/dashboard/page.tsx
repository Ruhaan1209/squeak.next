"use client";

import { useDashboard } from "@/contexts/DashboardContext";

export default function DashboardHome() {
  const { profileUsername, classrooms, selectedClassroom } = useDashboard();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-primary mb-2">Welcome, {profileUsername || "Teacher"}</h1>
      <p className="text-text-secondary font-secondary mb-8">
        {classrooms.length > 0
          ? `You have ${classrooms.length} classroom${classrooms.length > 1 ? "s" : ""}. Currently viewing: ${selectedClassroom?.name || "none"}`
          : "Create your first classroom in Settings."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-lg font-primary mb-2">Quick Stats</h2>
          <p className="font-secondary text-text-secondary text-sm">Classrooms: {classrooms.length}</p>
          {selectedClassroom && <p className="font-secondary text-text-secondary text-sm">Students: {selectedClassroom.students_count || 0}</p>}
        </div>
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-lg font-primary mb-2">Actions</h2>
          <div className="space-y-2">
            <a href="/dashboard/moderate" className="block font-secondary text-sm text-text-secondary hover:text-text-primary no-underline">Moderate content &rarr;</a>
            <a href="/dashboard/settings" className="block font-secondary text-sm text-text-secondary hover:text-text-primary no-underline">Manage classrooms &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  );
}
