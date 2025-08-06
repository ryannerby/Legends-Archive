import React, { useState } from "react";

export default function CarForm({
  onAddCar,
}: {
  onAddCar: (data: FormData) => Promise<{ success: boolean; message?: string }>;
}) {
  
  const [form, setForm] = useState<{
    name: string;
    year: string;           
    chassisNumber: string;
    image: File | null;
  }>({
    name: "",
    year: "",
    chassisNumber: "",
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files?.[0] ?? null }));
    } else if (name === "name" || name === "year" || name === "chassisNumber") {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name || !form.year || !form.chassisNumber) {
      alert("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("year", form.year);
    formData.append("chassisNumber", form.chassisNumber);
    if (form.image) formData.append("image", form.image);

    try {
      const result = await onAddCar(formData);
      setSubmitting(false);

      if (result.success) {
        setForm({
          name: "",
          year: "",
          chassisNumber: "",
          image: null, 
        });
      } else {
        alert(result.message || "Error adding car");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error submitting form");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="carForm">
      <h2>Add a new car</h2>
      <p>To start adding events to your car, add it here.</p>

      <label>
        Name
        <div className="inputBox">
          <input
            className="typeHere"
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
      </label>

      <label>
        Build year
        <div className="inputBox">
          <input
            className="typeHere"
            type="number"
            name="year"
            id="year"
            value={form.year}
            onChange={handleChange}
            required
            disabled={submitting}
            inputMode="numeric"
          />
        </div>
      </label>

      <label>
        Chassis number
        <div className="inputBox">
          <input
            className="typeHere"
            type="text"
            name="chassisNumber"
            id="chassisNumber"
            value={form.chassisNumber}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
      </label>

      <label>
        Image
        <div className="inputBox">
          <input
            className="typeHere"
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
      </label>

      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Create"}
      </button>
    </form>
  );
}
