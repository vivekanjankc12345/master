// src/pages/LeadDetails.jsx
import React, { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateLead } from "../store/leadSlice";
import { addActivityRealtime, setActivities } from "../store/activitySlice";
import { getSocket } from "../api/socket";
import axiosClient from "../api/axiosClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  User,
  Tag,
  CheckCircle,
  Clock,
  Send,
  PhoneCall,
  CalendarDays,
  FileText,
  MapPin,
  Timer,
} from "lucide-react";

const activitySchema = yup.object({
  type: yup.string().oneOf(["note", "call", "meeting"]).required(),
  subject: yup.string().max(120, "Subject too long").nullable().optional(),
  description: yup.string().required("Description is required"),
  scheduledAt: yup
    .string()
    .nullable()
    .test("valid-date", "Provide a valid date/time", (value) => {
      if (!value) return true;
      return !Number.isNaN(new Date(value).valueOf());
    }),
  durationMinutes: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Duration must be a number")
    .positive("Duration must be positive")
    .integer("Duration must be in minutes")
    .optional(),
  location: yup.string().max(120, "Location too long").nullable().optional(),
  outcome: yup.string().max(250, "Outcome too long").nullable().optional(),
});

const defaultActivityValues = {
  type: "note",
  subject: "",
  description: "",
  scheduledAt: "",
  durationMinutes: "",
  location: "",
  outcome: "",
};

const typeOptions = [
  { value: "note", label: "Note", helper: "Quick updates or reminders" },
  { value: "call", label: "Call", helper: "Log phone conversations" },
  {
    value: "meeting",
    label: "Meeting",
    helper: "Track in-person/virtual meets",
  },
];

const LeadDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: leads } = useSelector((s) => s.leads);
  const { items: activities } = useSelector((s) => s.activities);

  const lead = leads.find((l) => String(l.id) === id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(activitySchema),
    defaultValues: defaultActivityValues,
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (!lead) return;

    dispatch(setActivities([]));
    reset(defaultActivityValues);

    const fetchActivities = async () => {
      const { data } = await axiosClient.get(`/activities/lead/${lead.id}`);
      dispatch(setActivities(data));
    };
    fetchActivities();

    const socket = getSocket();
    socket.emit("join_lead", id);

    return () => {
      socket.emit("leave_lead", id);
    };
  }, [dispatch, id, lead, reset]);

  if (!lead) {
    return (
      <MainLayout>
        <h2 className="text-gray-500 text-lg">Lead not found.</h2>
      </MainLayout>
    );
  }

  const leadActivities = activities.filter((a) => a.leadId === lead.id);
  const sortedActivities = [...leadActivities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const updateStatus = (newStatus) => {
    const payload = { status: newStatus };
    dispatch(updateLead({ id: lead.id, payload }));
  };

  const submitActivity = async (values) => {
    const payload = {
      leadId: lead.id,
      type: values.type,
      description: values.description,
      subject: values.subject || undefined,
      scheduledAt: values.scheduledAt || undefined,
      durationMinutes: values.durationMinutes || undefined,
      location: values.location || undefined,
      outcome: values.outcome || undefined,
    };
   
    try {
      const { data } = await axiosClient.post(`/activities`, payload);
      dispatch(addActivityRealtime(data));
      const socket = getSocket();
      socket.emit("activity_added", data);
      toast.success("Activity logged");
      reset({ ...defaultActivityValues, type: values.type });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to log activity");
    }
  };

  const activityBadge = {
    note: {
      icon: FileText,
      iconBg: "bg-indigo-600 text-white",
      chip: "bg-indigo-100 text-indigo-700",
    },
    call: {
      icon: PhoneCall,
      iconBg: "bg-emerald-500 text-white",
      chip: "bg-emerald-100 text-emerald-700",
    },
    meeting: {
      icon: CalendarDays,
      iconBg: "bg-amber-500 text-white",
      chip: "bg-amber-100 text-amber-700",
    },
    status_change: {
      icon: CheckCircle,
      iconBg: "bg-sky-500 text-white",
      chip: "bg-sky-100 text-sky-700",
    },
  };
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
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
              <span>
                Assigned To: {lead.assignedTo?.name ?? "Not Assigned"}
              </span>
            </div>

            <div className="mt-5">
              <p className="font-semibold text-gray-600 mb-2">Status</p>
              <div className="flex gap-3">
                {["pending", "converted", "lost"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`px-4 py-1 rounded-full text-sm border ${
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

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Activity</h3>

            <div className="flex flex-wrap gap-3 mb-4">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-4 py-2 rounded-lg border text-sm transition ${
                    selectedType === option.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setValue("type", option.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                className="border px-3 py-2 rounded-lg"
                placeholder="Subject / Title"
                {...register("subject")}
              />
              {(selectedType === "call" || selectedType === "meeting") && (
                <input
                  type="datetime-local"
                  className="border px-3 py-2 rounded-lg"
                  {...register("scheduledAt")}
                />
              )}
              {(errors.subject || errors.scheduledAt) && (
                <div className="text-xs text-red-600 md:col-span-2">
                  {errors.subject?.message || errors.scheduledAt?.message}
                </div>
              )}
            </div>

            {(selectedType === "call" || selectedType === "meeting") && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  className="border px-3 py-2 rounded-lg"
                  placeholder="Duration (minutes)"
                  {...register("durationMinutes")}
                />
                {selectedType === "meeting" && (
                  <input
                    className="border px-3 py-2 rounded-lg"
                    placeholder="Location / Link"
                    {...register("location")}
                  />
                )}
                <input
                  className="border px-3 py-2 rounded-lg"
                  placeholder={
                    selectedType === "call" ? "Call outcome" : "Meeting notes"
                  }
                  {...register("outcome")}
                />
                {(errors.durationMinutes ||
                  errors.location ||
                  errors.outcome) && (
                  <div className="text-xs text-red-600 md:col-span-3">
                    {errors.durationMinutes?.message ||
                      errors.location?.message ||
                      errors.outcome?.message}
                  </div>
                )}
              </div>
            )}

            <textarea
              className="w-full border px-4 py-3 rounded-lg mb-2"
              placeholder="Add details or notes..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mb-2">
                {errors.description.message}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
                onClick={() => handleSubmit(submitActivity)()}
                disabled={isSubmitting}
              >
                <Send size={18} />
                {isSubmitting ? "Saving..." : "Log Activity"}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>

            {sortedActivities.length === 0 && (
              <p className="text-gray-500 text-sm">No activities yet.</p>
            )}

            <div className="space-y-6">
              {sortedActivities.map((a) => {
                const badge = activityBadge[a.type] || activityBadge.note;
                const Icon = badge.icon;

                return (
                  <div key={a.id} className="flex gap-4 items-start">
                    <div className={`${badge.iconBg} p-2 rounded-full`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.chip}`}
                        >
                          {a.type.replace("_", " ")}
                        </span>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(a.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {a.subject && (
                        <p className="font-semibold text-gray-800">
                          {a.subject}
                        </p>
                      )}

                      <p className="text-gray-700">{a.description}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                        {a.scheduledAt && (
                          <span className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {new Date(a.scheduledAt).toLocaleString()}
                          </span>
                        )}
                        {a.durationMinutes && (
                          <span className="flex items-center gap-1">
                            <Timer size={12} />
                            {a.durationMinutes} min
                          </span>
                        )}
                        {a.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {a.location}
                          </span>
                        )}
                        {a.outcome && (
                          <span className="italic text-gray-600">
                            Outcome: {a.outcome}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadDetails;
