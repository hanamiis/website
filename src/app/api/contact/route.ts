import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Semua field harus diisi." }, { status: 400 });
    }

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;
    if (!receiverEmail) {
      return NextResponse.json({ error: "Email penerima belum dikonfigurasi." }, { status: 500 });
    }

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: receiverEmail,
      subject: `[Website MOP] ${subject}`,
      text: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
      html: `<p><strong>Nama:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subjek:</strong> ${subject}</p><p><strong>Pesan:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    return NextResponse.json({ success: true, message: "Pesan berhasil dikirim." });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat mengirim email." }, { status: 500 });
  }
}
