import React, { useState } from "react";
import { createLead } from "../store/leadSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateLead = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createLead(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/leads");
      }
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Lead</h1>

      <form className="bg-white p-4 shadow rounded w-full md:w-1/2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          required
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Phone"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Create Lead
        </button>
      </form>
    </div>
  );
};

export default CreateLead;
