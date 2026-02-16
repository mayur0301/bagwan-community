import React, { useState } from "react";
import { X } from "lucide-react";
import { useAddCategoryMutation } from "../../redux/Admin/AdminApi";
import { toast } from "react-toastify";

const AddCategoryModel = ({ onClose, editData }) => {
  const [categoryName, setCategoryName] = useState(
    editData?.categoryName || ""
  );
  const [image, setImage] = useState(null);

  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) return toast.error("Enter category name");
    if (!image && !editData) return toast.error("Upload category icon");

    const formData = new FormData();
    formData.append("categoryName", categoryName);
    if (image) formData.append("Image", image);

    try {
      await addCategory(formData).unwrap();
      toast.success("Category added successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add category");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white w-full max-w-md rounded-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-6">
          {editData ? "Edit Category" : "Add New Category"}
        </h2>

        {/* CATEGORY NAME */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">
            Category
          </label>
          <input
            type="text"
            placeholder="Enter name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
          />
        </div>

        {/* UPLOAD ICON */}
        <div className="mb-6">
          <label className="text-sm font-medium block mb-2">
            Upload Icon Image
          </label>

          <label className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm cursor-pointer flex items-center justify-between">
            <span className="text-gray-500">
              {image ? image.name : "Upload"}
            </span>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mx-auto block px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          {isLoading
            ? "Saving..."
            : editData
            ? "Update Category"
            : "+ Add Category"}
        </button>
      </div>
    </div>
  );
};

export default AddCategoryModel;