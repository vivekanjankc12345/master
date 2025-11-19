// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, createUser, deleteUser } from "../store/userSlice";
import { useAuth } from "../hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";
import UserModal from "../components/UserModal";
import DeleteModal from "../components/DeleteModal";
import toast from "react-hot-toast";

const Users = () => {
  const dispatch = useDispatch();
  const { items: users, loading } = useSelector((s) => s.users);
  const { user } = useAuth();

  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // PERMISSION
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  // Only Admin & Manager can access this page
  if (user?.role === "sales") {
    return (
      <MainLayout>
        <div className="text-lg text-gray-600">
          ❌ You do not have permission to access this page.
        </div>
      </MainLayout>
    );
  }

  // Delete Permission:
  // Admin → delete anyone
  // Manager → delete only sales
  const canDelete = (role) => {
    if (isAdmin) return true;
    if (isManager && role === "sales") return true;
    return false;
  };

  const handleCreateUser = async (payload) => {
    try {
      setModalLoading(true);
      await dispatch(createUser(payload)).unwrap();
      toast.success("User created");
      setOpenModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create user");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User removed");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete user");
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>

        {isAdmin && (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setOpenModal(true)}
          >
            <Plus size={18} />
            Add User
          </button>
        )}
      </div>

      {/* USER TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>

                {/* ROLE BADGES */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : u.role === "manager"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.role.toUpperCase()}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="p-3 text-center">
                  {canDelete(u.role) ? (
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setDeleteId(u.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">No permission</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE USER MODAL */}
      {openModal && (
        <UserModal
          onClose={() => setOpenModal(false)}
          onSubmit={handleCreateUser}
          submitting={modalLoading}
        />
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <DeleteModal
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            await handleDeleteUser(deleteId);
            setDeleteId(null);
          }}
        />
      )}
    </MainLayout>
  );
};

export default Users;
