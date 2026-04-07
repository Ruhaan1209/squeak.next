"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { useNotification } from "@/contexts/NotificationContext";
import { useProfileAPI } from "@/hooks/useProfileAPI";

export default function AuthPage() {
  const { mode } = useParams<{ mode: string }>();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showResetForm, setShowResetForm] = useState<boolean | string>(false);
  const { showNotification } = useNotification();
  const { getProfile } = useProfileAPI();

  const toggleMode = (newMode: string) => {
    setIsLogin(newMode === "login");
    router.push(`/auth/${newMode}`);
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        router.push("/auth/reset");
      }
    });

    if (mode !== "reset") {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
          try {
            await getProfile();
            router.push("/learn");
          } catch {
            router.push("/welcome");
          }
        }
      });
    }
  }, [router, mode, getProfile]);

  useEffect(() => {
    setIsLogin(mode === "login");
    setSignupSuccess(false);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/learn");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/welcome` },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already registered")) {
            showNotification("An account with this email already exists. Please log in.", "error");
            toggleMode("login");
          } else {
            showNotification(error.message, "error");
          }
          return;
        }
        if (data?.user?.identities && data.user.identities.length === 0) {
          showNotification("An account with this email already exists. Log in instead!", "error");
          toggleMode("login");
          return;
        }
        setSignupSuccess(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "Failed to fetch") {
        showNotification(
          "Cannot reach Supabase. Restart the dev server after editing .env.local, check your network/VPN, and ensure your .env has no unescaped $ in values (use %24 or single-quoted URLs).",
          "error"
        );
      } else {
        showNotification(msg || "Authentication error. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) throw error;
      showNotification("Check your email for password reset instructions!", "success");
      setShowResetForm(false);
      setEmail("");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to send reset email";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showNotification("Password updated successfully!", "success");
      setPassword("");
      router.push("/auth/login");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update password";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const cardClass = "min-h-screen flex items-center justify-center bg-background";
  const boxClass = "bg-white rounded-2xl shadow-base p-8 w-full max-w-md";
  const inputClass = "w-full px-4 py-3 rounded-xl border border-border font-secondary text-base focus:outline-none focus:ring-2 focus:ring-selected";
  const btnClass = "w-full py-3 rounded-xl bg-selected text-black font-secondary font-medium text-base cursor-pointer border-none hover:opacity-90 transition-opacity disabled:opacity-50";
  const linkClass = "text-sm font-secondary text-text-secondary hover:text-text-primary cursor-pointer text-center";

  if (signupSuccess) {
    return (
      <div className={cardClass}>
        <div className={boxClass}>
          <h2 className="text-2xl font-primary text-center mb-4">Check Your Email!</h2>
          <p className="font-secondary text-text-secondary text-center mb-2">We&apos;ve sent a verification link to <strong>{email}</strong>.</p>
          <p className="font-secondary text-text-secondary text-center mb-4">Check your junk or spam folder if you don&apos;t see it.</p>
          <button onClick={() => router.push("/")} className={btnClass}>Return Home</button>
        </div>
      </div>
    );
  }

  if (mode === "reset") {
    return (
      <div className={cardClass}>
        <div className={boxClass}>
          <h2 className="text-2xl font-primary text-center mb-6">Set New Password</h2>
          <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
            <button type="submit" disabled={loading} className={btnClass}>{loading ? "Updating..." : "Update Password"}</button>
          </form>
        </div>
      </div>
    );
  }

  if (showResetForm === "request") {
    return (
      <div className={cardClass}>
        <div className={boxClass}>
          <h2 className="text-2xl font-primary text-center mb-6">Reset Password</h2>
          <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            <button type="submit" disabled={loading} className={btnClass}>{loading ? "Sending..." : "Send Reset Link"}</button>
          </form>
          <p onClick={() => setShowResetForm(false)} className={`${linkClass} mt-4`}>Back to Login</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className={boxClass}>
        <h2 className="text-2xl font-primary text-center mb-6">{isLogin ? "Welcome Back!" : "Create Account"}</h2>

        <div className="flex bg-item-background rounded-xl mb-6 relative">
          <div className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm transition-transform duration-300 ${isLogin ? "translate-x-[calc(100%-4px)]" : "translate-x-1"}`} />
          <button onClick={() => toggleMode("signup")} className={`flex-1 py-2 text-sm font-secondary relative z-10 cursor-pointer border-none bg-transparent ${!isLogin ? "font-bold" : "text-text-secondary"}`}>Sign Up</button>
          <button onClick={() => toggleMode("login")} className={`flex-1 py-2 text-sm font-secondary relative z-10 cursor-pointer border-none bg-transparent ${isLogin ? "font-bold" : "text-text-secondary"}`}>Login</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
          <button type="submit" disabled={loading} className={btnClass}>
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {isLogin && <p onClick={() => setShowResetForm("request")} className={`${linkClass} mt-4`}>Forgot password?</p>}
        <p onClick={() => toggleMode(isLogin ? "signup" : "login")} className={`${linkClass} mt-2`}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
