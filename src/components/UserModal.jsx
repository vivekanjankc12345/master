import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup.string().oneOf(["manager", "sales"]).required(),
});

const defaultValues = {
  name: "",
  email: "",
  password: "",
  role: "sales",
};

const UserModal = ({ onClose, onSubmit, submitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const loading = submitting || isSubmitting;

  const handleFormSubmit = async (values) => {
    await onSubmit(values);
    reset(defaultValues);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white p-6 w-full max-w-md rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Create User</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Alex Johnson"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="alex@company.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="******"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              {...register("role")}
            >
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg min-w-[110px]"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserModal;
