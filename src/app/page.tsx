"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Building2, Clapperboard, Compass, Crown, Menu, Sparkles, Video } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const services = [
  { title: "Desain Pameran", description: "Pengalaman merek yang imersif dan konsep galeri yang dirancang untuk memberi dampak besar.", icon: Compass },
  { title: "Desain Interior", description: "Ruang premium dengan detail halus dan storytelling yang kuat sesuai identitas brand.", icon: Building2 },
  { title: "Event Organizer", description: "Produksi yang mulus, dari peluncuran intim hingga aktivasi berskala besar.", icon: Crown },
  { title: "Pengembangan Studio", description: "Penataan studio lengkap untuk fotografi, video, konten, dan kebutuhan siaran.", icon: Video },
  { title: "Setup Studio YouTube", description: "Lingkungan konten profesional yang dirancang untuk performa dan kualitas terbaik.", icon: Clapperboard },
  { title: "Produksi Kreatif", description: "Konten visual premium dengan arahan sinematik dan eksekusi yang presisi.", icon: Sparkles },
];

const portfolioItems = [
  { title: "Pameran Brand Mewah", category: "Proyek Pameran", image: "/portfolio-placeholder.svg" },
  { title: "Interior Rumah Pribadi", category: "Proyek Interior", image: "/portfolio-placeholder.svg" },
  { title: "Event Peluncuran Korporat", category: "Proyek Event", image: "/portfolio-placeholder.svg" },
  { title: "Pembangunan Studio Kreator", category: "Proyek Studio", image: "/portfolio-placeholder.svg" },
  { title: "Aktivasi Brand Retail", category: "Proyek Komersial", image: "/portfolio-placeholder.svg" },
  { title: "Studio Kampanye Digital", category: "Proyek Komersial", image: "/portfolio-placeholder.svg" },
];

const testimonials = [
  { quote: "Exhibition design dan interior yang oke. Mantap.", author: "Arif N." },
  { quote: "Yang punya pameran segala bidang merapat.", author: "Sinta L." },
  { quote: "Recommend untuk yang mau buat studio YouTube channel.", author: "Dimas K." },
];

const processSteps = ["Konsultasi", "Perencanaan", "Desain", "Produksi", "Pengiriman"];

const stats = [
  { value: "5.000+", label: "Ulasan" },
  { value: "24/7", label: "Layanan" },
  { value: "300+", label: "Proyek" },
  { value: "18", label: "Profesional" },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.25]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "Semua") return portfolioItems;
    return portfolioItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setContactStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal mengirim pesan");
      }

      setContactStatus("Pesan telah dikirim. Terima kasih, kami akan segera menghubungi Anda.");
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <motion.header style={{ opacity }} className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="#home" className="flex items-center gap-3">
            <img src="/logoMOP.png" alt="MACAN OMPONG PRODUCTION logo" className="h-10 w-auto object-contain" />
            <span className="text-lg font-semibold tracking-[0.3em] text-[#D4AF37]">MOP</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
            <Link href="#about" className="transition hover:text-[#D4AF37]">Tentang</Link>
            <Link href="#services" className="transition hover:text-[#D4AF37]">Layanan</Link>
            <Link href="#portfolio" className="transition hover:text-[#D4AF37]">Portofolio</Link>
            <Link href="#contact" className="transition hover:text-[#D4AF37]">Kontak</Link>
          </nav>
          <button className="rounded-full border border-[#D4AF37]/40 p-3 text-[#D4AF37] md:hidden" onClick={() => setIsMenuOpen((prev) => !prev)}>
            <Menu size={18} />
          </button>
        </div>
        {isMenuOpen ? (
          <div className="border-t border-white/10 bg-[#050505] px-6 py-4 text-sm md:hidden">
            <div className="flex flex-col gap-3 text-white/80">
              <Link href="#about" onClick={() => setIsMenuOpen(false)}>Tentang</Link>
              <Link href="#services" onClick={() => setIsMenuOpen(false)}>Layanan</Link>
              <Link href="#portfolio" onClick={() => setIsMenuOpen(false)}>Portofolio</Link>
              <Link href="#contact" onClick={() => setIsMenuOpen(false)}>Kontak</Link>
            </div>
          </div>
        ) : null}
      </motion.header>

      <section id="home" className="relative isolate overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80"
        >
          <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.22),_transparent_35%),linear-gradient(120deg,_rgba(0,0,0,0.95),_rgba(0,0,0,0.7))]" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <div className="mb-6 flex items-center gap-4">
              <img src="/logoMOP.png" alt="MACAN OMPONG PRODUCTION logo" className="h-16 w-auto object-contain" />
              <p className="text-sm uppercase tracking-[0.4em] text-[#D4AF37]">MACAN OMPONG PRODUCTION</p>
            </div>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Mengubah Ide Menjadi Pengalaman Luar Biasa
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/75 sm:text-xl">
              Produksi kreatif, desain pameran, solusi interior, dan konten digital yang dirancang untuk brand yang mengutamakan kualitas dan kesan mendalam.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="#portfolio" className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-7 py-3 font-medium text-black transition hover:scale-[1.02]">
                Lihat Portofolio <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link href="#contact" className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 font-medium text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Tentang MOP</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Studio produksi kreatif premium yang menghadirkan pengalaman merek yang tak terlupakan.</h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              Berbasis di Tangerang Selatan, MACAN OMPONG PRODUCTION (MOP) menghadirkan solusi desain pameran, desain interior, produksi event, pengembangan studio, dan konten digital dengan pendekatan yang elegan, presisi, dan berkelas.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-5">
                <h3 className="text-xl font-semibold">Misi</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">Menciptakan lingkungan dan konten yang tak terlupakan untuk mengangkat kualitas brand, audiens, dan ruang.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-5">
                <h3 className="text-xl font-semibold">Visi</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">Menjadi kekuatan kreatif terdepan di Indonesia melalui desain pengalaman yang berani, berkualitas, dan berdampak.</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/15 to-transparent p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Kenapa Klien Memilih Kami</p>
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-semibold">5,036+</span>
                  <span className="text-sm uppercase tracking-[0.25em] text-white/50">Ulasan</span>
                </div>
                <p className="mt-2 text-white/70">Dipercaya oleh berbagai klien yang mencari eksekusi kreatif berkualitas tinggi.</p>
              </div>
              <div>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-semibold">24/7</span>
                  <span className="text-sm uppercase tracking-[0.25em] text-white/50">Dukungan</span>
                </div>
                <p className="mt-2 text-white/70">Kolaborasi yang fleksibel untuk peluncuran, event, dan kebutuhan produksi yang bergerak cepat.</p>
              </div>
              <div>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-semibold">300+</span>
                  <span className="text-sm uppercase tracking-[0.25em] text-white/50">Proyek</span>
                </div>
                <p className="mt-2 text-white/70">Mulai dari pameran dan studio hingga aktivasi korporat dan kampanye konten.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Layanan</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Solusi kreatif yang disesuaikan untuk brand yang ingin tampil berbeda.</h2>
          </div>
          <p className="max-w-xl text-white/70">Kami menciptakan visual, ruang, dan pengalaman yang meninggalkan kesan kuat di berbagai bidang, mulai dari pameran, interior, event, produksi, hingga konten digital.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article key={service.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-[1.75rem] border border-white/10 bg-[#0b0b0b] p-7 transition hover:-translate-y-1 hover:border-[#D4AF37]/40">
                <div className="mb-5 inline-flex rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-3 text-[#D4AF37]">
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{service.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="portfolio" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Portofolio</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Karya pilihan yang mencakup pameran, interior, dan pengalaman merek yang berdampak.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {(["Semua", "Proyek Pameran", "Proyek Interior", "Proyek Event", "Proyek Studio", "Proyek Komersial"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm transition ${activeFilter === filter ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/10 bg-transparent text-white/70 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item, index) => (
            <motion.button key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} onClick={() => setSelectedImage(item.image)} className="group overflow-hidden rounded-[1.75rem] border border-white/10 text-left">
              <div className="relative h-72 overflow-hidden">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">{item.category}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="text-center">
              <p className="text-3xl font-semibold text-[#D4AF37] sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Testimoni</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Suara klien yang mencerminkan kualitas karya kami.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote key={item.author} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-[1.75rem] border border-white/10 bg-[#0b0b0b] p-8">
              <p className="text-lg leading-8 text-white/80">“{item.quote}”</p>
              <footer className="mt-6 text-sm uppercase tracking-[0.25em] text-[#D4AF37]">{item.author}</footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Proses</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Alur kerja yang terstruktur dari ide hingga penyampaian hasil.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {processSteps.map((step, index) => (
            <div key={step} className="rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">{index + 1}</div>
              <h3 className="mt-4 text-lg font-semibold">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Kontak</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Mari wujudkan sesuatu yang luar biasa bersama kami.</h2>
            <p className="mt-4 max-w-xl text-white/70">Untuk pesan cepat, langsung kirim email atau chat WhatsApp. Untuk detail proyek, isi formulir di samping dan kami akan menerima notifikasi tanpa backend sendiri.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="mailto:info@macanompongproduction.com?subject=Permintaan%20Info%20MOP" className="inline-flex items-center rounded-full bg-[#D4AF37] px-6 py-3 font-medium text-black">Kirim Email</a>
              <a href="https://wa.me/6285781733063?text=Halo%20MOP,%20saya%20ingin%20tanya%20tentang%20layanan%20Anda" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 font-medium text-white">Chat WhatsApp</a>
            </div>
            <div className="mt-8 space-y-4 text-white/70">
              <p><span className="font-semibold text-white">Alamat:</span> Jl. PDAM-Persatuan, Ciater, Serpong, Tangerang Selatan, Banten 15310</p>
              <p><span className="font-semibold text-white">Telepon:</span> (021) 75672810</p>
              <p><span className="font-semibold text-white">Jam Operasional:</span> Buka 24 Jam</p>
            </div>
          </div>
          <div className="space-y-6">
            <form onSubmit={handleContactSubmit} className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[#121212] p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  type="text"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  required
                  className="rounded-xl border border-white/10 bg-black px-4 py-3 outline-none ring-0 text-white"
                  placeholder="Nama"
                />
                <input
                  name="email"
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  required
                  className="rounded-xl border border-white/10 bg-black px-4 py-3 outline-none ring-0 text-white"
                  placeholder="Email"
                />
              </div>
              <input
                name="subject"
                type="text"
                value={contactSubject}
                onChange={(event) => setContactSubject(event.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none ring-0 text-white"
                placeholder="Subjek"
              />
              <textarea
                name="message"
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                required
                className="min-h-32 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none ring-0 text-white"
                placeholder="Detail proyek"
              />
              <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#D4AF37] px-6 py-3 font-medium text-black">
                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
              </button>
              {contactStatus ? <p className="text-sm text-white/70">{contactStatus}</p> : null}
            </form>
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
              <iframe
                src="https://www.google.com/maps?q=Tangerang%20Selatan%20Banten%20Indonesia&z=12&output=embed"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MOP location"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505] px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-[0.3em] text-[#D4AF37]">MACAN OMPONG PRODUCTION</p>
            <p className="mt-2 text-sm text-white/60">Produksi Kreatif, Desain Pameran, Solusi Interior, dan Konten Digital.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <Link href="#about" className="transition hover:text-[#D4AF37]">Tentang</Link>
            <Link href="#services" className="transition hover:text-[#D4AF37]">Layanan</Link>
            <Link href="#portfolio" className="transition hover:text-[#D4AF37]">Portofolio</Link>
            <Link href="#contact" className="transition hover:text-[#D4AF37]">Kontak</Link>
          </div>
        </div>
      </footer>

      {selectedImage ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 px-4 py-6" onClick={() => setSelectedImage(null)}>
          <button className="absolute right-6 top-6 rounded-full border border-white/20 px-4 py-2 text-sm text-white" onClick={() => setSelectedImage(null)}>Tutup</button>
          <img src={selectedImage} alt="Portfolio preview" className="max-h-[85vh] w-full max-w-5xl rounded-4xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      ) : null}
    </main>
  );
}
