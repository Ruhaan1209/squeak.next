"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganizationAPI } from "@/hooks/useOrganizationAPI";
import { useNotification } from "@/contexts/NotificationContext";

export default function OrgPage() {
  const router = useRouter();
  const { jwtToken } = useAuth();
  const { getOrganization, createOrganization, joinOrganization } = useOrganizationAPI();
  const { showNotification } = useNotification();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [orgId, setOrgId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jwtToken) { router.push("/auth/login"); return; }
    const check = async () => {
      const { data } = await getOrganization();
      if (data?.organization_id) router.push("/dashboard");
      else setLoading(false);
    };
    check();
  }, [jwtToken, getOrganization, router]);

  const handleCreate = async () => {
    try {
      await createOrganization();
      showNotification("Organization created!", "success");
      router.push("/dashboard");
    } catch { showNotification("Failed to create organization", "error"); }
  };

  const handleJoin = async () => {
    if (!orgId.trim()) return;
    try {
      await joinOrganization(orgId.trim());
      showNotification("Joined organization!", "success");
      router.push("/dashboard");
    } catch { showNotification("Failed to join organization", "error"); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-selected" /></div>;

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-primary mb-6 text-center">Organization Setup</h1>
      <div className="flex bg-item-background rounded-xl mb-6">
        <button onClick={() => setMode("create")} className={`flex-1 py-2 text-sm font-secondary cursor-pointer border-none bg-transparent rounded-xl ${mode === "create" ? "bg-white shadow-sm font-bold" : "text-text-secondary"}`}>Create</button>
        <button onClick={() => setMode("join")} className={`flex-1 py-2 text-sm font-secondary cursor-pointer border-none bg-transparent rounded-xl ${mode === "join" ? "bg-white shadow-sm font-bold" : "text-text-secondary"}`}>Join</button>
      </div>

      {mode === "create" ? (
        <div className="text-center">
          <p className="font-secondary text-text-secondary mb-4">Create a new organization and become its admin.</p>
          <button onClick={handleCreate} className="px-6 py-3 rounded-xl bg-selected text-black font-secondary cursor-pointer border-none hover:opacity-90">Create Organization</button>
        </div>
      ) : (
        <div>
          <p className="font-secondary text-text-secondary mb-4">Join an existing organization by ID.</p>
          <input value={orgId} onChange={(e) => setOrgId(e.target.value)} placeholder="Organization ID"
            className="w-full px-4 py-3 rounded-xl border border-border font-secondary text-base focus:outline-none focus:ring-2 focus:ring-selected mb-4" />
          <button onClick={handleJoin} disabled={!orgId.trim()} className="w-full py-3 rounded-xl bg-selected text-black font-secondary cursor-pointer border-none hover:opacity-90 disabled:opacity-50">Join Organization</button>
        </div>
      )}
    </div>
  );
}
