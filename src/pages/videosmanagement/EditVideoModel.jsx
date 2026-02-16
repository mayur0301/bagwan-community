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

  const { register, handleSubmit, watch, reset } = useForm();

  const videoURL = watch("videoURL");
  const videoFile = watch("video");

  // ✅ PREFILL DATA
  // useEffect(() => {
  //   if (data?.data) {
  //     reset({
  //       videoTitle: data.data.videoTitle,
  //       videoDescription: data.data.videoDescription,
  //       videoURL: data.data.video || data.data.videoURL || "",
  //     });
  //   }
  // }, [data, reset]);
  useEffect(() => {
    if (data?.data) {
      reset({
        videoTitle: data.data.videoTitle || "",
        videoDescription: data.data.videoDescription || "",
        videoURL: data.data.videoURL || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (form) => {
    // if (!form.videoURL && !form.video?.length) {
    //   return toast.error("Provide Video URL or Upload Video");
    // }

    if (form.videoURL && form.video?.length) {
      return toast.error("Only one allowed (URL or File)");
    }

    // const formData = new FormData();
    // formData.append("id", data?.data?._id);
    // formData.append("videoTitle", form.videoTitle);
    // formData.append("videoDescription", form.videoDescription);

    // if (form.videoURL) {
    //   formData.append("videoURL", form.videoURL);
    // }

    // if (form.video?.length) {
    //   formData.append("video", form.video[0]);
    // }
    // console.log(formData);

    // const res = await updateVideo({ data: formData, id: data?.data?._id });
    // if (res.error) {
    //   toast.error("Failed to update video");
    // } else {
    //   toast.success("Video Updated");
    //   onClose();
    // }
    const formData = new FormData();

    formData.append("videoTitle", form.videoTitle);
    formData.append("videoDescription", form.videoDescription);

    if (form.videoURL) {
      formData.append("videoURL", form.videoURL);
    }

    if (form.video?.length) {
      formData.append("video", form.video[0]);
    }

    if (form.videoThumbnail?.length) {
      formData.append("videoThumbnail", form.videoThumbnail[0]);
    }

    const res = await updateVideo({
      id: data?.data?._id,
      data: formData,
    });

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

        {/* <form onSubmit={handleSubmit(onSubmit)}>
            
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
        </form> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* TITLE */}
          <div className="mb-4">
            <label className="text-sm font-medium">Video Title</label>
            <input
              {...register("videoTitle")}
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <label className="text-sm font-medium">Video Description</label>
            <input
              {...register("videoDescription")}
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm"
            />
          </div>

          {/* VIDEO URL */}
          <div className="mb-4">
            <label className="text-sm font-medium">Video URL</label>
            <input
              {...register("videoURL")}
              disabled={videoFile?.length}
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm"
            />
          </div>

          {/* VIDEO FILE */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Replace Video (Optional)
            </label>
            <input
              {...register("video")}
              type="file"
              accept="video/*"
              disabled={videoURL}
              className="mt-2 w-full text-sm"
            />
          </div>

          {/* THUMBNAIL */}
          <div className="mb-6">
            <label className="text-sm font-medium">Replace Thumbnail</label>

            {data?.data?.videoThumbnail && (
              <img
                src={data.data.videoThumbnail}
                className="w-32 h-20 object-cover rounded mb-2"
              />
            )}

            <input
              {...register("videoThumbnail")}
              type="file"
              accept="image/*"
              className="mt-2 w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            {isLoading ? "Updating..." : "Update Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVideoModel;
