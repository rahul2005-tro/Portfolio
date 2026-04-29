import { NextResponse } from "next/server";

// Rate limiting: simple in-memory store (resets on deploy)
const submissions = new Map<string, number>();
const RATE_LIMIT_MS = 60_000; // 1 minute between submissions per IP

export async function POST(request: Request) {
  try {
    // Basic rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const lastSubmit = submissions.get(ip);
    if (lastSubmit && Date.now() - lastSubmit < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: "Please wait a minute before sending another message." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message, _honeypot } = body;

    // Honeypot — if filled, it's a bot
    if (_honeypot) {
      // Pretend success to bots
      return NextResponse.json({ success: true });
    }

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (name.length > 100 || email.length > 100 || message.length > 5000) {
      return NextResponse.json(
        { error: "Input too long." },
        { status: 400 }
      );
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Send via EmailJS REST API (server-side — keys not exposed to client)
    const EJS_SERVICE = process.env.EMAILJS_SERVICE_ID || "service_1v3431t";
    const EJS_TEMPLATE = process.env.EMAILJS_TEMPLATE_ID || "template_o83rjik";
    const EJS_PUBLIC = process.env.EMAILJS_PUBLIC_KEY || "Nbk0MJXla9KiXjHh3";

    const ejsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EJS_SERVICE,
        template_id: EJS_TEMPLATE,
        user_id: EJS_PUBLIC,
        template_params: {
          from_name: name,
          from_email: email,
          message: message,
        },
      }),
    });

    if (!ejsRes.ok) {
      const errText = await ejsRes.text();
      console.error("EmailJS server error:", ejsRes.status, errText);
      return NextResponse.json(
        { error: `EmailJS error (${ejsRes.status}): ${errText}` },
        { status: 502 }
      );
    }

    // Record successful submission for rate limiting
    submissions.set(ip, Date.now());

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
