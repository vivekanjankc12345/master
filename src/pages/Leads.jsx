// src/pages/Leads.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import toast from "react-hot-toast";

const Leads = () => {
  const dispatch = useDispatch();
  const { items: leads, loading } = useSelector((s) => s.leads);
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [editLeadData, setEditLeadData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [search, filter, leads.length]);

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

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

  // Role-based permission
  const canEditDelete =
    user?.role === "admin" || user?.role === "manager";

  const handleLeadSubmit = async (payload) => {
    try {
      setModalLoading(true);
      if (editLeadData) {
        await dispatch(
          updateLead({ id: editLeadData.id, payload })
        ).unwrap();
        toast.success("Lead updated");
      } else {
        await dispatch(createLead(payload)).unwrap();
        toast.success("Lead created");
      }
      setOpenModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save lead");
    } finally {
      setModalLoading(false);
    }
  };

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
      <div className="bg-white shadow rounded-xl">
        <div className="overflow-x-auto">
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

            {displayedLeads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Link
                    to={`/leads/${lead.id}`}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    {lead.name}
                  </Link>
                </td>
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
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">
            {filteredLeads.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + pageSize, filteredLeads.length)}
          </span>{" "}
          of <span className="font-semibold">{filteredLeads.length}</span> leads
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="border rounded-lg px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded-lg disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded-lg disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {openModal && (
        <LeadModal
          data={editLeadData}
          onClose={() => setOpenModal(false)}
          onSubmit={handleLeadSubmit}
          submitting={modalLoading}
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
