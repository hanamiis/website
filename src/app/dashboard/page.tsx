import Link from "next/link";
import { readMessages } from "@/lib/messages";

export default async function DashboardPage() {
  const messages = await readMessages();
  const unreadCount = messages.filter((message) => !message.isRead).length;

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-4xl border border-white/10 bg-[#0b0b0b] p-8 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#ffffff]/70">Dashboard Pesan</p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Pesan Masuk dari Form Kontak</h1>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link href="#contact" className="inline-flex items-center rounded-full border border-white/10 bg-[#ffffff] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#f3f3f3]">
                Kembali ke Halaman Utama
              </Link>
              {unreadCount > 0 ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-4 py-2 text-sm text-[#ffffff]">
                  <span className="h-3 w-3 rounded-full bg-[#D4AF37]" />
                  {unreadCount} pesan belum dibaca
                </div>
              ) : (
                <div className="inline-flex items-center rounded-full bg-white/5 px-4 py-2 text-sm text-white/70">
                  Semua pesan sudah dibaca
                </div>
              )}
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-white/70">Di sini Anda dapat melihat semua pesan proyek, termasuk detail kebutuhan dan data kontak klien. Pesan terbaru akan muncul di bagian atas.</p>
        </div>

        <section className="space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-4xl border border-white/10 bg-[#121212] p-8 text-center text-white/70">
              Belum ada pesan yang masuk. Coba kirim pesan melalui formulir kontak di halaman utama.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-white/70">Menampilkan {messages.length} pesan.</div>
                <form action="/api/messages/mark-read" method="post">
                  <button type="submit" className="rounded-full border border-white/10 bg-[#ffffff] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#f3f3f3]">
                    Tandai semua dibaca
                  </button>
                </form>
              </div>
              <div className="grid gap-4">
                {messages.map((message) => (
                  <article key={message.id} className={`rounded-4xl border border-white/10 bg-[#121212] p-6 shadow-sm shadow-black/20 ${message.isRead ? "" : "ring-2 ring-[#D4AF37]/30"}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-sm uppercase tracking-[0.35em] text-[#ffffff]/70">{message.subject}</p>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-semibold text-white">{message.name}</h2>
                          {!message.isRead ? <span className="rounded-full bg-[#D4AF37] px-2 py-1 text-xs font-semibold text-black">Baru</span> : null}
                        </div>
                        <p className="text-sm text-white/70">{message.email}</p>
                      </div>
                      <div className="text-right text-sm text-white/60">
                        <p>{new Date(message.createdAt).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</p>
                        <p className="mt-1">ID pesan: {message.id}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-5">
                        <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#ffffff]/70">Detail Proyek</p>
                        <p className="whitespace-pre-line text-sm leading-7 text-white/80">{message.projectDetails}</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-5">
                        <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#ffffff]/70">Pesan Klien</p>
                        <p className="whitespace-pre-line text-sm leading-7 text-white/80">{message.message}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
