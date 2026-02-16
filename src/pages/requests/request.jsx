import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  useGetAllSupportsQuery,
  useUpdateSupportStatusMutation,
} from "../../redux/Admin/AdminApi";
import defaultAvatar from "../../assets/default-avatar.jpg";
import { toast } from "react-toastify";
const Request = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [updatestatus, { isLoading: updatestatusloading }] =
    useUpdateSupportStatusMutation();
  const [updateId, setupdateId] = useState(null);

  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllSupportsQuery({
    page,
    status: statusFilter,
  });

  const requests = data?.data || [];
  const counts = data?.counts || {};
  const pagination = data?.pagination || {};

  async function UpdateStatuss(id, status) {
    try {
      const res = await updatestatus({ id, status });
      if (res.error) {
        toast.error("Error in Update Status");
      } else {
        toast.success("Status Updated");
      }
    } catch (error) {
      toast.error("Error in Update Status");
    }
  }

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  if (isLoading)
    return (
      <div className="bg-[#F3FFF7] p-6 rounded-2xl w-full animate-pulse">
        {/* Header */}
        <div className="mb-6">
          <div className="h-7 w-56 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-80 bg-gray-200 rounded"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-4 border mb-6">
          <div className="h-10 bg-gray-200 rounded-lg w-full md:w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full md:w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full md:w-1/4"></div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border flex flex-col md:flex-row gap-6"
            >
              {/* Left */}
              <div className="flex gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

                <div className="flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>

                  <div className="flex gap-2 mb-3">
                    <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-28 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                  </div>

                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>

                  <div className="h-4 w-44 bg-gray-200 rounded mt-3"></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 w-full md:w-40">
                <div className="h-9 bg-gray-200 rounded-full"></div>
                <div className="h-9 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="bg-[#F3FFF7] p-4 sm:p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Support Requests</h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Review and manage support requests from users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Pending Review"
          count={counts.pendingReview || 0}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Approved"
          count={counts.approved || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Rejected"
          count={counts.rejected || 0}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 flex flex-col gap-3 justify-between md:flex-row md:gap-4 md:items-center border mb-6">
        {/* Search */}
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/2">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={["All", "pending", "approved", "rejected"]}
          label="All Status"
        />
      </div>

      {/* Requests */}
      <div className="space-y-4">
        {requests.map((req) => {
          const statusStyle =
            req.status === "pending"
              ? "bg-orange-100 text-orange-600"
              : req.status === "approved"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600";

          return (
            <div
              key={req._id}
              className="bg-white rounded-2xl p-4 sm:p-6 border flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
            >
              {/* Left */}
              <div className="flex gap-4">
                <img
                  src={req.User?.userProfilePhoto || defaultAvatar}
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold">{req.User?.fullName}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Chip outline>{req.Category?.categoryName}</Chip>
                    <Chip solid>{req.SupportId?.SupportName}</Chip>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-3 max-w-xl">
                    {req.Notes}
                  </p>

                  <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
                    <Calendar size={16} />
                    Submitted on: {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        setupdateId({ id: req._id, status: "approved" });
                        UpdateStatuss(req._id, "approved");
                      }}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {updatestatusloading &&
                      updateId?.id === req._id &&
                      updateId?.status === "approved" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        setupdateId({ id: req._id, status: "rejected" });
                        UpdateStatuss(req._id, "rejected");
                      }}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {updatestatusloading &&
                      updateId?.id === req._id &&
                      updateId?.status === "rejected" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Reject
                    </button>
                  </>
                )}

                {req.status === "approved" && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <CheckCircle size={16} />
                    Approved
                  </div>
                )}

                {req.status === "rejected" && (
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <XCircle size={16} />
                    Rejected
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {requests.length === 0 && (
          <div className="text-center text-gray-500 py-8 sm:py-10">
            No requests found
          </div>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={!pagination.has_prev_page}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {pagination.page || 1} / {pagination.total_pages || 1}
        </span>

        <button
          disabled={!pagination.has_next_page}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Request;

/* ================= COMPONENTS ================= */

const StatCard = ({ title, count, icon: Icon, color }) => (
  <div
    className={`bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-${color}-500`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-100`}
    >
      <Icon className={`text-${color}-600`} size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{count}</p>
    </div>
  </div>
);

const Select = ({ value, onChange, options, label }) => (
  <div className="relative w-full md:w-44">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-gray-100 px-4 py-2 rounded-lg text-sm w-full cursor-pointer"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
    />
  </div>
);

const Chip = ({ children, outline, solid }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      outline
        ? "border border-green-600 text-green-600"
        : solid
          ? "bg-green-500 text-white"
          : ""
    }`}
  >
    {children}
  </span>
);
