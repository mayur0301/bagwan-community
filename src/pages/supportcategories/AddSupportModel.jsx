import React from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useGetAllCategoryQuery,
  useAddSupportMutation,
} from "../../redux/Admin/AdminApi";
import { toast } from "react-toastify";

const AddSupportModel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { data, isLoading: categoryLoading } = useGetAllCategoryQuery();
  const categories = data?.data || [];

  const [addSupport, { isLoading }] = useAddSupportMutation();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (form) => {
    const payload = {
      CategoryId: form.CategoryId,
      SupportName: form.SupportName,
    };

    try {
      const res = await addSupport(payload);
      if (res.error) {
        toast.error("Error adding support");
      } else {
        toast.success("Support added successfully");
        reset();
        onClose();
      }
    } catch (err) {
      toast.error("Error adding support");
    }
  };

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

        <h2 className="text-xl font-bold mb-6">Add Support</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Select Category */}
          <div>
            <label className="text-sm font-medium">Select Category</label>
            <select
              {...register("CategoryId", { required: true })}
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
              disabled={categoryLoading}
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Support Name */}
          <div>
            <label className="text-sm font-medium">Support name</label>
            <input
              {...register("SupportName", { required: true })}
              type="text"
              placeholder="Enter"
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60"
            >
              {isLoading ? "Adding..." : "+ Add Support"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupportModel;