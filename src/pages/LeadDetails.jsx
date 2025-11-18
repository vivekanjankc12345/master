// src/pages/LeadDetails.jsx
import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateLead } from "../store/leadSlice";
import { addActivityRealtime } from "../store/activitySlice";
import { getSocket } from "../api/socket";
import axiosClient from "../api/axiosClient";
import {
  Mail,
  Phone,
  User,
  Tag,
  CheckCircle,
  Clock,
  Send,
} from "lucide-react";

const LeadDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: leads } = useSelector((s) => s.leads);
  const { items: activities } = useSelector((s) => s.activities);

  const lead = leads.find((l) => String(l.id) === id);

  const [activityText, setActivityText] = useState("");

  useEffect(() => {
    if (!lead) return;

    const socket = getSocket();

    socket.emit("join_lead", id);

    return () => {
      socket.emit("leave_lead", id);
    };
  }, [id, lead]);

  if (!lead) {
    return (
      <MainLayout>
        <h2 className="text-gray-500 text-lg">Lead not found.</h2>
      </MainLayout>
    );
  }

  // Filter activities belonging to this lead
  const leadActivities = activities.filter((a) => a.leadId === lead.id);

  // Update status
  const updateStatus = async (newStatus) => {
    const payload = { status: newStatus };
    dispatch(updateLead({ id: lead.id, payload }));
  };

  // Save activity
  const submitActivity = async () => {
    if (!activityText.trim()) return;

    const { data } = await axiosClient.post(`/activities`, {
      leadId: lead.id,
      description: activityText,
    });

    dispatch(addActivityRealtime(data));

    const socket = getSocket();
    socket.emit("activity_added", data);

    setActivityText("");
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL - Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Lead Card */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3">{lead.name}</h2>

            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-gray-500" size={18} />
              <span>{lead.email}</span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <Phone className="text-gray-500" size={18} />
              <span>{lead.phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <User className="text-gray-500" size={18} />
              <span>Assigned To: {lead.assignedTo?.name ?? "Not Assigned"}</span>
            </div>

            <div className="mt-5">
              <p className="font-semibold text-gray-600 mb-2">Status</p>
              <div className="flex gap-3">
                {["pending", "converted", "lost"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`px-4 py-1 rounded-full text-sm border 
                    ${
                      lead.status === s
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag size={18} /> Tags
            </h3>

            <div className="flex gap-2 flex-wrap">
              {lead.tags?.length > 0 ? (
                lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tags</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Timeline & Notes */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Activity</h3>

            <div className="flex gap-3">
              <input
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="Add a note or activity..."
                value={activityText}
                onChange={(e) => setActivityText(e.target.value)}
              />

              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={submitActivity}
              >
                <Send size={18} />
                Add
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>

            {leadActivities.length === 0 && (
              <p classname="text-gray-500 text-sm">No activities yet.</p>
            )}

            <div className="space-y-6">
              {leadActivities.map((a) => (
                <div key={a.id} className="flex gap-4 items-start">
                  <div className="bg-indigo-600 text-white p-2 rounded-full">
                    <CheckCircle size={20} />
                  </div>

                  <div>
                    <p className="font-medium">{a.description}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadDetails;
