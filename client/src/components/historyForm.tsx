import React, { useState } from "react";

const API_BASE = "http://localhost:5001";

export default function HistoryForm({
  carId,
  onHistoryAdded,
}: {
  carId: string;
  onHistoryAdded?: () => void | Promise<void>;
}) {
  const [form, setForm] = useState<{
    title: string;
    date: string;       
    description: string;
  }>({
    title: "",
    date: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "title" || name === "date" || name === "description") {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title || !form.date || !form.description) {
      alert("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/cars/${carId}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          date: new Date(form.date).toISOString(),
          description: form.description,
        }),
      });

      if (res.ok) {
        setForm({ title: "", date: "", description: "" });
        await onHistoryAdded?.(); // opcional
      } else {
        alert("Error adding history event");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="historyForm">
      <div className="inputBox">
        <label htmlFor="title">Event title</label>
        <input
          className="typeHere"
          type="text"
          name="title"
          id="title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={submitting}
        />
      </div>

      <div className="inputBox">
        <label htmlFor="date">Event date</label>
        <input
          className="typeHere"
          type="date"
          name="date"
          id="date"
          value={form.date}
          onChange={handleChange}
          required
          disabled={submitting}
        />
      </div>

      <div className="inputBox">
        <label htmlFor="description">Description</label>
        <input
          className="typeHere"
          type="text"
          name="description"
          id="description"
          value={form.description}
          onChange={handleChange}
          required
          disabled={submitting}
        />
      </div>

      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Create"}
      </button>
    </form>
  );
}
