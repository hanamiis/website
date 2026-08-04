"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Password salah.");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Password salah atau tidak valid.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-4xl border border-white/10 bg-[#0b0b0b] p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.35em] text-[#ffffff]/70">Akses Terbatas</p>
        <h1 className="mt-3 text-3xl font-semibold">Masuk ke Dashboard</h1>
        <p className="mt-4 text-sm leading-7 text-white/70">
          Masukkan password tim untuk melihat pesan masuk.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#ffffff] px-6 py-3 font-medium text-black"
          >
            {isSubmitting ? "Memeriksa..." : "Masuk"}
          </button>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </form>
      </div>
    </main>
  );
}
