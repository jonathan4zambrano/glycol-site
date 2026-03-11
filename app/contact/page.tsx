"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#050d1a] text-white -mt-20 pt-20">
      {/* Hero Banner */}
      <div
        className="w-full py-20 flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: "url('/Contact_Background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1
          className="text-6xl font-semibold tracking-[0.3em] text-white uppercase"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)" }}
        >
          Contact
        </h1>
        <p
          className="mt-4 text-sm font-medium tracking-[0.2em] text-white uppercase"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}
        >
          Have a question? We&apos;re always open to talk!
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-6 py-16">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-[#0f2540] bg-[#0a1628] px-4 py-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-700"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[#0f2540] bg-[#0a1628] px-4 py-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-700"
            />
          </div>

          <textarea
            placeholder="Message"
            rows={7}
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className="w-full rounded-lg border border-[#0f2540] bg-[#0a1628] px-4 py-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-700 resize-none"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg bg-white py-4 text-sm font-medium text-zinc-900 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send"}
          </button>

          {status === "sent" && (
            <p className="text-center text-sm text-green-400">Message sent! We&apos;ll be in touch.</p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-red-400">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>

      {/* Find Us */}
      <div className="bg-[#0a1628] py-16 px-6 border-t border-[#0f2540]">
        <h2 className="text-center text-2xl font-light tracking-[0.3em] text-white uppercase mb-12">
          Find Us
        </h2>

        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Call Us */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Call Us</p>
            <p className="text-sm text-zinc-300">+1 (416) 970-7616</p>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Address</p>
            <div className="text-sm text-zinc-300 space-y-1">
              <p className="font-semibold text-zinc-200">Canada</p>
              <p>200 University Ave W</p>
              <p>Waterloo, ON N2L 3G1</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Email</p>
            <p className="text-sm text-zinc-300">jonathan4zambrano@gmail.com</p>
          </div>
        </div>

        {/* Map */}
        <div className="mx-auto max-w-4xl rounded-2xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.3!2d-80.5449!3d43.4723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf48c03ee5105%3A0x9432b09eeadfc5c3!2sUniversity%20of%20Waterloo!5e0!3m2!1sen!2sca!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#0f2540] py-8 bg-[#050d1a]">
        <div className="mx-auto flex max-w-2xl justify-between px-6 text-xs text-zinc-500">
          <span>GlycoTech • FYDP prototype</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
