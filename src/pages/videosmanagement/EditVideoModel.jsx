import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useUpdateVideoInfoMutation,
  useGetVideoByIdQuery,
} from "../../redux/Admin/AdminApi";
import { toast } from "react-toastify";

const EditVideoModel = ({ isOpen, onClose, videoId }) => {
  if (!isOpen || !videoId) return null;

  const [updateVideo, { isLoading }] = useUpdateVideoInfoMutation();

  const { data } = useGetVideoByIdQuery(videoId);

  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm();

  const videoURL = watch("videoURL");
  const videoFile = watch("video");

  // ✅ PREFILL DATA
  useEffect(() => {
    if (data?.data) {
      reset({
        videoTitle: data.data.videoTitle,
        videoDescription: data.data.videoDescription,
        videoURL: (data.data.video || data.data.videoURL) || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (form) => {
    if (!form.videoURL && !form.video?.length) {
      return toast.error("Provide Video URL or Upload Video");
    }

    if (form.videoURL && form.video?.length) {
      return toast.error("Only one allowed (URL or File)");
    }

    const formData = new FormData();
    formData.append("id", data?.data?._id);
    formData.append("videoTitle", form.videoTitle);
    formData.append("videoDescription", form.videoDescription);

    if (form.videoURL) {
      formData.append("videoURL", form.videoURL);
    }

    if (form.video?.length) {
      formData.append("video", form.video[0]);
    }
    console.log(formData);
    
    const res = await updateVideo({data : formData , id : data?.data?._id});
    if (res.error) {
      toast.error("Failed to update video");
    } else {
      toast.success("Video Updated");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-6">Edit Video</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
            
          <input
            {...register("videoTitle")}
            placeholder="Video Title"
            className="w-full mb-3 bg-gray-100 px-4 py-3 rounded-lg"
          />

          <input
            {...register("videoDescription")}
            placeholder="Video Description"
            className="w-full mb-3 bg-gray-100 px-4 py-3 rounded-lg"
          />

          <input
            {...register("videoURL")}
            placeholder="YouTube URL"
            disabled={videoFile?.length}
            className="w-full mb-3 bg-gray-100 px-4 py-3 rounded-lg"
          />

          <input
            {...register("video")}
            type="file"
            accept="video/*"
            disabled={videoURL}
            className="mb-4"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg"
          >
            {isLoading ? "Updating..." : "Update Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVideoModel;
