"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaGithub, FaLinkedin, FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationCircle,
} from "react-icons/fa";
import emailjs from "@emailjs/browser";

/* ─────────────────────────────────────────
  EmailJS Setup:
  1. Create a free account at emailjs.com
  2. Add a service (Gmail / Outlook)
  3. Create an email template with variables:
     {{from_name}}, {{from_email}}, {{message}}
  4. Replace the three constants below with your
     Service ID, Template ID, and Public Key
───────────────────────────────────────── */
const EJS_SERVICE  = "service_7rk2pdp";    // ✓ set
const EJS_TEMPLATE = "template_o83rjik";    // ✓ set
const EJS_PUBLIC   = "Nbk0MJXla9KiXjHh3"; // ✓ set

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.sendForm(EJS_SERVICE, EJS_TEMPLATE, formRef.current!, EJS_PUBLIC);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 5000);
  };

  const inputClass =
    "w-full bg-[#080812] border rounded-lg px-4 py-3 text-slate-200 font-mono text-sm " +
    "focus:outline-none placeholder-slate-700 transition-all duration-200 " +
    "border-neon-green/15 focus:border-neon-green/50 focus:shadow-[0_0_15px_rgba(0,255,65,0.08)]";

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-neon-green/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 top-0 w-64 h-64 bg-cyber-cyan/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 glass-section p-6 sm:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-xs text-neon-green/60 tracking-widest mb-3">[ 07 ]</p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-neon-green/50">// </span>Contact
            <span className="text-neon-green">_</span>Me
          </h2>
          <p className="text-slate-500 font-mono text-sm mt-3">
            Open to collaborations, internships &amp; freelance projects.
          </p>
          <div className="h-px w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-3"
          >
            <div className="rounded-xl p-8 border border-neon-green/10 bg-[#0a0a14]">
              <p className="font-mono text-xs text-neon-green mb-6 flex items-center gap-2">
                <span className="opacity-50">$</span> send_message.sh
                <span className="ml-auto text-slate-700 text-[10px]">press Enter to send</span>
              </p>

              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-slate-500 mb-1.5 block tracking-widest">
                      --name *
                    </label>
                    <input
                      name="from_name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-slate-500 mb-1.5 block tracking-widest">
                      --email *
                    </label>
                    <input
                      name="from_email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-slate-500 mb-1.5 block tracking-widest">
                    --message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or idea..."
                    className={inputClass + " resize-none"}
                  />
                </div>

                {/* Status banners */}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                    <FaExclamationCircle /> Failed to send. Check your EmailJS config or use the mail fallback.
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 font-mono font-bold
                             rounded-lg transition-all duration-300 tracking-widest text-sm mt-1
                             ${status === "sent"
                               ? "bg-neon-green/20 text-neon-green border border-neon-green/40"
                               : status === "sending"
                               ? "bg-neon-green/40 text-dark-bg cursor-wait"
                               : "bg-neon-green text-dark-bg hover:bg-neon-green/90 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]"
                             }`}
                >
                  {status === "sent" ? (
                    <><FaCheckCircle /> MESSAGE SENT!</>
                  ) : status === "sending" ? (
                    <>TRANSMITTING...</>
                  ) : (
                    <><FaPaperPlane /> SEND MESSAGE</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 flex flex-col gap-4"
          >
            {/* Connect */}
            <div className="rounded-xl p-6 border border-neon-green/10 bg-[#0a0a14]">
              <p className="font-mono text-[10px] text-neon-green tracking-widest mb-4">
                CONNECT
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    href: "https://github.com/rahul2005-tro",
                    icon: <FaGithub className="text-xl text-neon-green" />,
                    label: "GitHub",
                    sub: "rahul2005-tro",
                    color: "neon-green",
                  },
                  {
                    href: "https://www.linkedin.com/in/rahul-g-840425239/",
                    icon: <FaLinkedin className="text-xl text-cyber-cyan" />,
                    label: "LinkedIn",
                    sub: "Rahul G",
                    color: "cyber-cyan",
                  },
                  {
                    href: "mailto:rahul.jet10@gmail.com",
                    icon: <FaEnvelope className="text-xl text-neon-purple" />,
                    label: "Email",
                    sub: "rahul.jet10@gmail.com",
                    color: "neon-purple",
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/5
                               hover:border-white/15 hover:bg-white/3 transition-all group"
                  >
                    <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                    <div>
                      <p className="font-mono text-xs text-slate-200 font-semibold">{link.label}</p>
                      <p className="font-mono text-[10px] text-slate-500">{link.sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Status Widget */}
            <div className="rounded-xl p-5 border border-neon-green/10 bg-[#0a0a14]">
              <p className="font-mono text-[10px] text-slate-500 tracking-widest mb-3">CURRENT_STATUS</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#00ff41]" />
                <span className="font-mono text-sm text-neon-green font-bold">Available for Hire</span>
              </div>
              <p className="text-slate-500 text-xs font-mono leading-relaxed mb-4">
                Open to internships, research collaborations &amp; freelance engineering projects.
              </p>
              {/* Response time */}
              <div className="flex items-center gap-2 pt-3 border-t border-neon-green/10">
                <span className="font-mono text-[10px] text-slate-600">Avg. response time:</span>
                <span className="font-mono text-[10px] text-neon-green">&lt; 24h</span>
              </div>
            </div>

            {/* Resume Download */}
            <a
              href="#"
              download
              onClick={(e) => { e.preventDefault(); alert("Resume PDF coming soon! Contact me at rahul.jet10@gmail.com"); }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-neon-green/25
                         font-mono text-xs text-neon-green hover:bg-neon-green/8 hover:border-neon-green/50
                         transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)]"
            >
              ↓ Download Resume
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
