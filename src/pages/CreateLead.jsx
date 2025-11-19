import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { createLead } from "../store/leadSlice";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\-() ]*$/, "Phone can include digits and symbols only")
    .nullable()
    .optional(),
});

const CreateLead = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const onSubmit = async (values) => {
    try {
      await dispatch(createLead(values)).unwrap();
      toast.success("Lead created");
      navigate("/leads");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create lead");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Lead</h1>

      <form
        className="bg-white p-6 shadow rounded-xl space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="text-sm font-medium text-gray-600">Name</label>
          <input
            className="w-full border px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500"
            placeholder="Jane Doe"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            className="w-full border px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500"
            placeholder="jane@company.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Phone</label>
          <input
            className="w-full border px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500"
            placeholder="+1 555 123 4567"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Lead"}
        </button>
      </form>
    </div>
  );
};

export default CreateLead;
