import React, { useMemo, useState, useEffect } from "react";
import { Search, MoreVertical, ChevronDown } from "lucide-react";
import {
  useGetAllUsersQuery,
  useGetAllCategoryQuery,
} from "../../redux/Admin/AdminApi";
import ActionModel from "./ActionModel";
import defaultAvatar from "../../assets/default-avatar.jpg";

const UserManage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: categoryData } = useGetAllCategoryQuery();

  const { data, isLoading } = useGetAllUsersQuery({
    page,
    categoryId: selectedCategory,
  });

  const users = data?.data || [];
  const pagination = data?.pagination || {};

  const [SelectedUser, SetSelectedUser] = useState(null);

  const categories = useMemo(() => {
    if (!categoryData?.data) return [{ label: "All", value: "All" }];

    return [
      { label: "All", value: "All" },
      ...categoryData.data.map((cat) => ({
        label: cat.categoryName,
        value: cat._id,
      })),
    ];
  }, [categoryData]);

 
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (!search) return true;

      return (
        user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        String(user.contactNo).includes(search)
      );
    });
  }, [users, search]);

  function call() {
    SetSelectedUser(null);
  }

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        {/* Title */}
        <div className="mb-6">
          <div className="shimmer h-7 w-48 rounded mb-2"></div>
          <div className="shimmer h-4 w-72 rounded"></div>
        </div>

        {/* Search bar */}
        <div className="bg-white p-4 rounded-xl mb-6">
          <div className="shimmer h-10 w-full md:w-1/2 rounded-lg"></div>
        </div>

        {/* Table shimmer */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-t">
              <div className="shimmer w-10 h-10 rounded-full"></div>
              <div className="flex-1">
                <div className="shimmer h-4 w-40 rounded mb-2"></div>
                <div className="shimmer h-3 w-24 rounded"></div>
              </div>
              <div className="shimmer h-6 w-20 rounded-full"></div>
              <div className="shimmer h-4 w-20 rounded"></div>
              <div className="shimmer w-8 h-8 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Manage and monitor all registered users
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 flex flex-col gap-3 md:flex-row md:gap-4 md:items-center md:justify-between shadow-sm border">
        {/* Search */}
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/2">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name, email or phone"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto appearance-none bg-gray-100 px-4 py-2 pr-10 rounded-lg text-sm font-medium outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="mt-5 space-y-4 md:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl border p-4 flex flex-col gap-4"
          >
            {/* Top */}
            <div className="flex items-center gap-3">
              <img
                src={user.userProfilePhoto || defaultAvatar}
                alt="profile"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar;
                }}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <MoreVertical
                onClick={() => SetSelectedUser(user)}
                size={18}
                className="text-gray-500"
              />
            </div>

            {/* Info */}
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                {user.categoryId?.categoryName}
              </span>
              <span className="text-gray-600">📞 {user.contactNo}</span>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                Requests:
                <span className="w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center font-bold">
                  {user.supportRequestCount ? 1 : 0}
                </span>
              </span>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500">No users found</div>
        )}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block mt-5 overflow-x-auto bg-white rounded-2xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#E8FAD6] text-left">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Join Date</th>
              <th className="p-4 font-semibold">Requests</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={user.userProfilePhoto || defaultAvatar}
                    alt="profile"
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar;
                    }}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {user.categoryId?.categoryName}
                  </span>
                </td>

                <td className="p-4 text-gray-600">{user.contactNo}</td>

                <td className="p-4 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <span className="w-9 h-9 flex items-center justify-center rounded-full bg-green-200 text-green-700 font-bold">
                    {user.supportRequestCount ? 1 : 0}
                  </span>
                </td>

                <td className="p-4">
                  <MoreVertical
                    onClick={() => SetSelectedUser(user)}
                    size={18}
                    className="cursor-pointer text-gray-500"
                  />
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={!pagination?.has_prev_page}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {pagination?.page || 1} of {pagination?.total_pages || 1}
        </span>

        <button
          disabled={!pagination?.has_next_page}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Action Modal */}
      {SelectedUser && (
        <ActionModel userId={SelectedUser?._id} closemodel={call} />
      )}
    </div>
  );
};

export default UserManage;
