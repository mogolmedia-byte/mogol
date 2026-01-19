@ -0,0 +1,68 @@
"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Сайн уу! Юугаар туслах вэ?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });

    const data = await r.json();
    setMessages([...next, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>AI Chatbot</h2>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          minHeight: 400,
          borderRadius: 12,
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{m.role === "user" ? "Та" : "Бот"}:</b> {m.content}
          </div>
        ))}
        {loading && <div>Бодолт хийж байна...</div>}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Энд бич..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />
        <button onClick={send} style={{ padding: "12px 18px", borderRadius: 10 }}>
          Илгээх
        </button>
      </div>
    </main>
  );
}
