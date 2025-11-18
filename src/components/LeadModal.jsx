import React, { useState, useEffect } from "react";

const LeadModal = ({ data, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "pending",
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-96 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {data ? "Edit Lead" : "Create Lead"}
        </h2>

        <div className="space-y-3">
          <input
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <input
            placeholder="Phone"
            className="w-full border px-3 py-2 rounded"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            onClick={() => onSubmit(form)}
          >
            {data ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
