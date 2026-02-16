import React, { useState, useMemo } from "react";
import { Search, Plus, Calendar, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  useGetAllUpdatesQuery,
  useDeleteUpdatesMutation,
} from "../../redux/Admin/AdminApi";
import AddUpdatesModel from "./AddUpdatsModel";
import EditUpdatesModel from "./UpdateUpdates";
import { toast } from "react-toastify";

const UpdatesNews = () => {
  const { data, isLoading } = useGetAllUpdatesQuery();
  const [deleteupdates, { isLoading: deleteingupdates }] =
    useDeleteUpdatesMutation();
  const [deleteId, setDeleteId] = useState(null);

  const updates = data?.data || [];

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [search, setSearch] = useState("");

  // 🔍 SEARCH FILTER
  const filteredUpdates = useMemo(() => {
    return updates.filter((u) =>
      u.Headline?.toLowerCase().includes(search.toLowerCase())
    );
  }, [updates, search]);

  if (isLoading) {
    return (
      <div className="bg-[#F3FFF7] p-6 rounded-2xl w-full animate-pulse">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="h-7 w-56 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-80 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl border mb-6">
          <div className="h-10 w-72 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Update Cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border flex flex-col lg:flex-row gap-6 mb-6 overflow-hidden"
          >
            {/* Image */}
            <div className="w-full lg:w-[360px] h-56 bg-gray-200"></div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>

              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-1/2 bg-gray-200 rounded mb-4"></div>

              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded mb-6"></div>

              {/* Actions */}
              <div className="flex gap-3">
                <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
                <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  async function DeleteUpdates(id) {
    try {
      const res = await deleteupdates(id);
      if (res.error) {
        toast.error("Error in Delete Updates");
      } else {
        toast.success("Update Deleted");
      }
    } catch (error) {
      toast.error("Error in Delete Updates");
    }
  }

  return (
    <div className="bg-[#F3FFF7] p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Updates & News</h2>
          <p className="text-gray-500">
            Manage platform updates and announcements
          </p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          <Plus size={18} />
          Add Update
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl border mb-6">
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2 max-w-md">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search Update"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Update Cards */}
      {filteredUpdates.map((item) => {
        const date = new Date(item.createdAt).toLocaleDateString();

        return (
          <div
            key={item._id}
            className="bg-white rounded-2xl  border flex flex-col lg:flex-row gap-6 mb-6"
          >
            {/* Image */}
            <img
              src={item.Image}
              alt="update"
              className="w-full f-full lg:w-[360px] object-cover rounded"
            />

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <Calendar size={16} />
                {date}
              </div>

              <h3 className="text-xl font-bold mb-1">{item.Headline}</h3>

              <p className="text-gray-600 font-medium mb-3">
                {item.Subheadline}
              </p>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {item.Description}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setUpdateId(item._id);
                    setOpenEdit(true);
                  }}
                  className="flex items-center gap-2 border border-green-600 text-green-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-50"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => {
                    DeleteUpdates(item._id), setDeleteId(item._id);
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                >
                  {deleteingupdates && deleteId === item._id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {filteredUpdates.length === 0 && (
        <div className="text-center text-gray-500 py-10">No updates found</div>
      )}

      {/* Modals */}
      <AddUpdatesModel isOpen={openAdd} onClose={() => setOpenAdd(false)} />

      <EditUpdatesModel
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        updateId={updateId}
      />
    </div>
  );
};

export default UpdatesNews;
