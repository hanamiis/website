import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveMessage } from "@/lib/messages";

const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.CONTACT_RECEIVER_EMAIL
);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, projectDetails, message } = body;

    if (!name || !email || !subject || !projectDetails || !message) {
      return NextResponse.json({ error: "Semua field harus diisi." }, { status: 400 });
    }

    await saveMessage({
      name,
      email,
      subject,
      projectDetails,
      message,
    });

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `${name} <${email}>`,
          to: process.env.CONTACT_RECEIVER_EMAIL,
          subject: `[Website MOP] ${subject}`,
          text: `Nama: ${name}\nEmail: ${email}\n\nDetail Proyek:\n${projectDetails}\n\nPesan:\n${message}`,
          html: `<p><strong>Nama:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subjek:</strong> ${subject}</p><p><strong>Detail Proyek:</strong><br/>${projectDetails.replace(/\n/g, "<br/>")}</p><p><strong>Pesan:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>`,
        });
      } catch (mailError) {
        console.error("Email send failed", mailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pesan berhasil dikirim dan disimpan.",
    });
  } catch (error) {
    console.error("Contact save failed", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menyimpan pesan." }, { status: 500 });
  }
}
