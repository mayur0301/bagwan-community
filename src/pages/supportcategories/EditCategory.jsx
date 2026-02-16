import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useUpdateCategoryMutation } from "../../redux/Admin/AdminApi";

const EditCategory = ({ onClose, editData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [updateCategory, { isLoading }] =
    useUpdateCategoryMutation();

  /* 🔹 Prefill form */
  useEffect(() => {
    if (editData) {
      reset({
        categoryName: editData.categoryName,
      });
    }
  }, [editData, reset]);

  /* 🔹 Submit */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("categoryName", data.categoryName);

      // Image optional
      if (data.Image && data.Image[0]) {
        formData.append("Image", data.Image[0]);
      }

      await updateCategory({
        id: editData._id,
        data: formData,
      }).unwrap();

      toast.success("Category updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update category");
    }
  };

  if (!editData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-6">
          Edit Category
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="text-sm font-medium">
              Category Name
            </label>
            <input
              type="text"
              {...register("categoryName", {
                required: "Category name is required",
              })}
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
            />
            {errors.categoryName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-medium">
              Category Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("Image")}
              className="mt-2 w-full text-sm"
            />

            {/* Existing Image Preview */}
            {editData?.Image && (
              <img
                src={editData.Image}
                alt="category"
                className="w-16 h-16 mt-3 rounded-lg object-cover"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <Loader2 size={16} className="animate-spin" />
            )}
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;