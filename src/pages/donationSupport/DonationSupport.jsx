import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  HandCoins,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  Calendar
} from "lucide-react";
import {
  useGetAllDonationsQuery,
  useUpdateDonationStatusMutation,
} from "../../redux/Admin/AdminApi";

const DonationSupport = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading } = useGetAllDonationsQuery({ page });
  const [updateDonation] = useUpdateDonationStatusMutation();

  const donations = data?.donations || [];
  const counts = data?.counts || {};
  const pagination = data?.pagination || {};

  // 🔍 Search Filter
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      // Search match
      const matchesSearch =
        !search || d.purpose?.toLowerCase().includes(search.toLowerCase());

      // Status match
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [donations, search, statusFilter]);

  // ✅ Update Status
  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(id + status);
      await updateDonation({ id, status }).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  // ================= LOADING UI =================
  if (isLoading) {
    return (
      <div className="p-6 w-full">
        {/* Title Skeleton */}
        <div className="mb-6">
          <div className="shimmer h-7 w-48 rounded mb-2"></div>
          <div className="shimmer h-4 w-72 rounded"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border">
              <div className="shimmer h-4 w-24 rounded mb-3"></div>
              <div className="shimmer h-8 w-16 rounded"></div>
            </div>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="bg-white p-4 rounded-xl mb-6">
          <div className="shimmer h-10 w-full rounded-lg"></div>
        </div>

        {/* List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border">
              <div className="flex justify-between">
                <div className="w-full">
                  <div className="shimmer h-5 w-2/3 rounded mb-3"></div>
                  <div className="shimmer h-4 w-32 rounded mb-3"></div>
                  <div className="shimmer h-6 w-20 rounded"></div>
                </div>

                <div className="flex gap-2">
                  <div className="shimmer h-10 w-24 rounded"></div>
                  <div className="shimmer h-10 w-24 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3FFF7] p-6 rounded-2xl w-full">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Donation Requests</h2>
        <p className="text-gray-500">
          Manage and review all donation support requests
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Donations"
          value={counts.total}
          icon={HandCoins}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={counts.pending}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Approved"
          value={counts.approved}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={counts.rejected}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* ================= SEARCH & Filter ================= */}
      {/* <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border">
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by purpose..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div> */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* SEARCH */}
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/2">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by purpose..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* STATUS FILTER */}
        <div className="relative w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-gray-100 px-4 py-2 pr-10 rounded-lg text-sm font-medium outline-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Arrow Icon */}
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-4">
        {filteredDonations.length === 0 ? (
          <EmptyState />
        ) : (
          filteredDonations.map((donation) => (
            // <div
            //   key={donation._id}
            //   className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition"
            // >
            //   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            //     {/* LEFT */}
            //     <div>
            //       <p className="font-semibold text-lg">{donation.purpose}</p>

            //       <p className="text-sm text-gray-500 mt-1">
            //         Submitted on{" "}
            //         {new Date(donation.createdAt).toLocaleDateString()}
            //       </p>

            //       <StatusBadge status={donation.status} />
            //     </div>

            //     {/* RIGHT ACTIONS */}
            //     {donation.status === "pending" && (
            //       <div className="flex gap-3">
            //         <button
            //           onClick={() =>
            //             handleStatusUpdate(donation._id, "approved")
            //           }
            //           disabled={actionLoading === donation._id + "approved"}
            //           className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-60"
            //         >
            //           <CheckCircle size={16} />
            //           {actionLoading === donation._id + "approved"
            //             ? "Approving..."
            //             : "Approve"}
            //         </button>

            //         <button
            //           onClick={() =>
            //             handleStatusUpdate(donation._id, "rejected")
            //           }
            //           disabled={actionLoading === donation._id + "rejected"}
            //           className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-60"
            //         >
            //           <XCircle size={16} />
            //           {actionLoading === donation._id + "rejected"
            //             ? "Rejecting..."
            //             : "Reject"}
            //         </button>
            //       </div>
            //     )}
            //   </div>
            // </div>
            <div
              key={donation._id}
              className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* LEFT SIDE */}
                <div className="flex-1">
                  {/* ===== NAME / EMAIL + STATUS ===== */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <p className="font-semibold text-lg">
                      {donation.user?.email || "Unknown User"}
                    </p>

                    <StatusBadge status={donation.status} />
                  </div>

                  {/* ===== PURPOSE (GRAY TEXT) ===== */}
                  <p className="text-gray-600 text-sm mb-2">
                    {donation.purpose}
                  </p>

                  {/* ===== SUBMITTED DATE (GREEN LIKE SUPPORT REQUEST) ===== */}
                  <p className="text-green-600 text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} />Submitted on{" "}
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* ===== ACTION BUTTONS (ONLY IF PENDING) ===== */}
                {donation.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleStatusUpdate(donation._id, "approved")
                      }
                      disabled={actionLoading === donation._id + "approved"}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full flex items-center gap-2 transition disabled:opacity-60"
                    >
                      <CheckCircle size={16} />
                      {actionLoading === donation._id + "approved"
                        ? "Approving..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(donation._id, "rejected")
                      }
                      disabled={actionLoading === donation._id + "rejected"}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full flex items-center gap-2 transition disabled:opacity-60"
                    >
                      <XCircle size={16} />
                      {actionLoading === donation._id + "rejected"
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={pagination.page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-5 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {pagination.page || 1} of {pagination.pages || 1}
        </span>

        <button
          disabled={pagination.page === pagination.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-5 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DonationSupport;

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${colors[color]}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="text-3xl font-bold mt-4">{value || 0}</p>
    </div>
  );
};

// const StatusBadge = ({ status }) => {
//   if (status === "approved")
//     return (
//       <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
//         Approved
//       </span>
//     );

//   if (status === "rejected")
//     return (
//       <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
//         Rejected
//       </span>
//     );

//   return (
//     <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
//       Pending
//     </span>
//   );
// };
const StatusBadge = ({ status }) => {
  const styles = {
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || styles.pending
      }`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const EmptyState = () => (
  <div className="text-center py-16 text-gray-500">
    No donation requests found
  </div>
);



// const DonationSkeleton = () => (
//   <div className="p-6 space-y-6">
//     <div className="grid grid-cols-4 gap-4">
//       {[1, 2, 3, 4].map((i) => (
//         <div key={i} className="shimmer h-24 rounded-xl" />
//       ))}
//     </div>

//     {[1, 2, 3].map((i) => (
//       <div key={i} className="shimmer h-28 rounded-xl" />
//     ))}
//   </div>
// );
