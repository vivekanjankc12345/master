import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const STATUS_OPTIONS = ["pending", "verified", "follow_up", "converted", "lost", "rejected"];

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\-() ]*$/, "Phone can include digits and symbols only")
    .nullable()
    .optional(),
  status: yup.string().oneOf(STATUS_OPTIONS).required(),
});

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  status: "pending",
};

const LeadModal = ({ data, onClose, onSubmit, submitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset({ ...defaultValues, ...(data || {}) });
  }, [data, reset]);

  const handleFormSubmit = async (values) => {
    await onSubmit(values);
  };

  const loading = submitting || isSubmitting;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white p-6 w-full max-w-md rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">
          {data ? "Edit Lead" : "Create Lead"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <input
              placeholder="Enter full name"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              placeholder="customer@email.com"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <input
              placeholder="+1 555 222 1111"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <select
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              {...register("status")}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center min-w-[110px]"
          >
            {loading ? "Saving..." : data ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadModal;
