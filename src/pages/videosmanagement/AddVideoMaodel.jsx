import React from "react";
import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAddVideoInfoMutation } from "../../redux/Admin/AdminApi";
import { toast } from "react-toastify";

const AddVideoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [AddVideo, { isLoading }] = useAddVideoInfoMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const videoURL = watch("videoURL");
  const videoFile = watch("video");

  const onSubmit = async (data) => {
    // ❌ validation: only one allowed
    if (!data.videoURL && !data.video?.length) {
      return toast.error("Please provide Video URL or Upload Video");
    }

    if (data.videoURL && data.video?.length) {
      return toast.error("Provide only one: Video URL OR Video File");
    }

    const formData = new FormData();
    formData.append("videoTitle", data.videoTitle);
    formData.append("videoDescription", data.videoDescription);

    if (data.videoURL) {
      formData.append("videoURL", data.videoURL);
    }

    if (data.video?.length) {
      formData.append("video", data.video[0]);
    }

    try {
      const res = await AddVideo(formData);
      if (res.error) {
        toast.error("Error in Add video");
      } else {
        toast.success("Video Added");
        reset();
        onClose();
      }
    } catch (error) {
      toast.error("Error in Add video");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-6">Add New Video</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className="mb-4">
            <label className="text-sm font-medium">Video Title</label>
            <input
              {...register("videoTitle", { required: "Title is required" })}
              type="text"
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
            />
            {errors.videoTitle && (
              <p className="text-red-500 text-xs mt-1">
                {errors.videoTitle.message}
              </p>
            )}
          </div>

          {/* Subtitle */}
          <div className="mb-4">
            <label className="text-sm font-medium">Video Subtitle</label>
            <input
              {...register("videoDescription")}
              type="text"
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
            />
          </div>

          {/* Video URL */}
          <div className="mb-4">
            <label className="text-sm font-medium">Video URL</label>
            <input
              {...register("videoURL")}
              type="url"
              placeholder="https://youtube.com/..."
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
              disabled={videoFile?.length}
            />
          </div>

          {/* Upload Video */}
          <div className="mb-6">
            <label className="text-sm font-medium">Upload Video</label>
            <input
              {...register("video")}
              type="file"
              accept="video/*"
              className="mt-2 w-full text-sm"
              disabled={videoURL}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60"
          >
            {isLoading ? "Adding..." : "+ Add Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVideoModal;
