// src/pages/Leads.jsx
import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../store/leadSlice";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import LeadModal from "../components/LeadModal";
import DeleteModal from "../components/DeleteModal";

const Leads = () => {
  const dispatch = useDispatch();
  const { items: leads, loading } = useSelector((s) => s.leads);
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [editLeadData, setEditLeadData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  // FILTER + SEARCH
  const filteredLeads = leads.filter((l) => {
    const matchesStatus =
      filter === "all" ? true : l.status.toLowerCase() === filter.toLowerCase();

    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);

    return matchesStatus && matchesSearch;
  });

  // Role-based permission
  const canEditDelete =
    user?.role === "admin" || user?.role === "manager";

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>

        {user?.role !== "sales" && (
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              setEditLeadData(null);
              setOpenModal(true);
            }}
          >
            <Plus size={18} />
            Add Lead
          </button>
        )}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-indigo-500"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border px-3 py-2 rounded-lg focus:ring-indigo-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* LEAD TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              {canEditDelete && <th className="p-3 text-center">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filteredLeads.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No leads found.
                </td>
              </tr>
            )}

            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.phone}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      lead.status === "converted"
                        ? "bg-green-100 text-green-700"
                        : lead.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                {canEditDelete && (
                  <td className="p-3 text-center flex gap-3 justify-center">
                    <button
                      className="text-indigo-600 hover:text-indigo-800"
                      onClick={() => {
                        setEditLeadData(lead);
                        setOpenModal(true);
                      }}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setDeleteId(lead.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT MODAL */}
      {openModal && (
        <LeadModal
          data={editLeadData}
          onClose={() => setOpenModal(false)}
          onSubmit={(payload) => {
            if (editLeadData) {
              dispatch(updateLead({ id: editLeadData.id, payload }));
            } else {
              dispatch(createLead(payload));
            }
            setOpenModal(false);
          }}
        />
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <DeleteModal
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            dispatch(deleteLead(deleteId));
            setDeleteId(null);
          }}
        />
      )}
    </MainLayout>
  );
};

export default Leads;
