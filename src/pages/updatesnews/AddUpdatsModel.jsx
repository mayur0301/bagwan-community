import React from "react";
import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAddUpdatesMutation } from "../../redux/Admin/AdminApi";
import { toast } from "react-toastify";

const AddUpdatesModel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [addUpdates, { isLoading }] = useAddUpdatesMutation();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("Headline", data.title);
    formData.append("Subheadline", data.subtitle);
    formData.append("Description", data.description);
    formData.append("Image", data.image[0]);

    const res = await addUpdates(formData);

    if (res.error) {
      toast.error("Error in Add Update");
    } else {
      toast.success("Update Published");
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-6">Add New Update</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Headline</label>
            <input
              {...register("title", { required: true })}
              placeholder="Enter"
              className="w-full mt-2 bg-gray-100 px-4 py-3 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Subheadline</label>
            <input
              {...register("subtitle")}
              placeholder="Enter"
              className="w-full mt-2 bg-gray-100 px-4 py-3 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              placeholder="Enter"
              rows={4}
              className="w-full mt-2 bg-gray-100 px-4 py-3 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Image</label>
            <label className="mt-2 flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg cursor-pointer">
              <Upload size={16} />
              Upload
              <input
                {...register("image", { required: true })}
                type="file"
                accept="image/*"
                hidden
              />
            </label>
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            {isLoading ? "Publishing..." : "Publish Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUpdatesModel;
