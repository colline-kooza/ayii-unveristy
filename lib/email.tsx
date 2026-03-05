import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.EMAIL_FROM || "noreply@ayii.university";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendWelcomeStudent(opts: {
  to: string;
  name: string;
  registrationNumber: string;
  temporaryPassword: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Welcome to AYii University — Your Account Details",
    html: `
      <div style="font-family:sans-serif;background:#000;color:#fff;padding:32px;max-width:600px">
        <h1 style="color:#3B82F6">AYii University</h1>
        <p>Hello <strong>${opts.name}</strong>,</p>
        <p>Your student account has been created. Use the credentials below to log in:</p>
        <div style="background:#111;border:1px solid #1F1F1F;padding:16px;border-radius:8px;margin:16px 0">
          <p><strong>Registration Number:</strong> ${opts.registrationNumber}</p>
          <p><strong>Temporary Password:</strong> <code style="color:#3B82F6">${opts.temporaryPassword}</code></p>
        </div>
        <p>You will be required to change your password on first login.</p>
        <a href="${APP_URL}/login" style="background:#1D4ED8;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Log In Now</a>
        <p style="color:#A1A1AA;margin-top:32px;font-size:12px">AYii University eLearning Platform</p>
      </div>
    `,
  });
}

export async function sendWelcomeLecturer(opts: {
  to: string;
  name: string;
  temporaryPassword: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Welcome to AYii University — Lecturer Account Created",
    html: `
      <div style="font-family:sans-serif;background:#000;color:#fff;padding:32px;max-width:600px">
        <h1 style="color:#3B82F6">AYii University</h1>
        <p>Hello <strong>${opts.name}</strong>,</p>
        <p>Your lecturer account has been created:</p>
        <div style="background:#111;border:1px solid #1F1F1F;padding:16px;border-radius:8px;margin:16px 0">
          <p><strong>Email:</strong> ${opts.to}</p>
          <p><strong>Temporary Password:</strong> <code style="color:#3B82F6">${opts.temporaryPassword}</code></p>
        </div>
        <a href="${APP_URL}/login" style="background:#1D4ED8;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Log In Now</a>
        <p style="color:#A1A1AA;margin-top:32px;font-size:12px">AYii University eLearning Platform</p>
      </div>
    `,
  });
}

export async function sendPasswordReset(opts: {
  to: string;
  name: string;
  otp: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "AYii University — Password Reset Code",
    html: `
      <div style="font-family:sans-serif;background:#000;color:#fff;padding:32px;max-width:600px">
        <h1 style="color:#3B82F6">AYii University</h1>
        <p>Hello <strong>${opts.name}</strong>,</p>
        <p>Your password reset code is:</p>
        <div style="background:#111;border:1px solid #1D4ED8;padding:24px;border-radius:8px;text-align:center;margin:16px 0">
          <span style="font-size:36px;font-weight:bold;color:#3B82F6;letter-spacing:8px">${opts.otp}</span>
        </div>
        <p>This code expires in <strong>15 minutes</strong>. If you did not request this, ignore this email.</p>
        <p style="color:#A1A1AA;margin-top:32px;font-size:12px">AYii University eLearning Platform</p>
      </div>
    `,
  });
}

export async function sendAccountSuspended(opts: {
  to: string;
  name: string;
  reason: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "AYii University — Account Suspended",
    html: `
      <div style="font-family:sans-serif;background:#000;color:#fff;padding:32px;max-width:600px">
        <h1 style="color:#3B82F6">AYii University</h1>
        <p>Hello <strong>${opts.name}</strong>,</p>
        <p>Your account has been suspended for the following reason:</p>
        <div style="background:#111;border:1px solid #ef4444;padding:16px;border-radius:8px;margin:16px 0">
          <p>${opts.reason}</p>
        </div>
        <p>Please contact the administration office for further assistance.</p>
        <p style="color:#A1A1AA;margin-top:32px;font-size:12px">AYii University eLearning Platform</p>
      </div>
    `,
  });
}

export async function sendJournalReviewed(opts: {
  to: string;
  lecturerName: string;
  journalTitle: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}) {
  const approved = opts.status === "APPROVED";
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `AYii University — Journal ${approved ? "Approved" : "Rejected"}`,
    html: `
      <div style="font-family:sans-serif;background:#000;color:#fff;padding:32px;max-width:600px">
        <h1 style="color:#3B82F6">AYii University</h1>
        <p>Hello <strong>${opts.lecturerName}</strong>,</p>
        <p>Your journal "<strong>${opts.journalTitle}</strong>" has been <strong style="color:${approved ? "#22c55e" : "#ef4444"}">${approved ? "approved and published" : "rejected"}</strong>.</p>
        ${!approved && opts.rejectionReason ? `<div style="background:#111;border:1px solid #ef4444;padding:16px;border-radius:8px;margin:16px 0"><p><strong>Reason:</strong> ${opts.rejectionReason}</p></div>` : ""}
        <p style="color:#A1A1AA;margin-top:32px;font-size:12px">AYii University eLearning Platform</p>
      </div>
    `,
  });
}
