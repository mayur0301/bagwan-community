import React, { useMemo, useState } from "react";
import { Search, Play, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AddVideoModal from "./AddVideoMaodel";
import {
  useGetAllVideoInfoQuery,
  useDeleteVideoInfoMutation,
} from "../../redux/Admin/AdminApi";
import { toast } from "react-toastify";
import EditVideoModel from "./EditVideoModel";

/* ✅ SAFE HELPERS */
// 🎯 Check YouTube URL
const isYouTubeUrl = (url) =>
  typeof url === "string" &&
  (url.includes("youtube.com") || url.includes("youtu.be"));

// 🎯 Extract YouTube video ID
const getYouTubeId = (url) => {
  if (typeof url !== "string") return null;
  try {
    if (url.includes("youtu.be")) {
      return url.split("/").pop().split("?")[0];
    }
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
};

// 🎯 Thumbnail for MP4
const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return "/video-placeholder.jpg";
  return videoUrl.replace(".mp4", ".jpg");
};

const VideoManage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModel, setopenEditModel] = useState(false);
  const [search, setSearch] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [selectedDelete, setselectedDelete] = useState(null);

  const [deletevideo, { isLoading: deleteingvideo }] =
    useDeleteVideoInfoMutation();

  const { data, isLoading } = useGetAllVideoInfoQuery();
  const videos = data?.data || [];

  const filteredVideos = useMemo(() => {
    return videos.filter((v) =>
      v.videoTitle?.toLowerCase().includes(search.toLowerCase())
    );
  }, [videos, search]);

  async function DeleteVideo(id) {
    try {
      setselectedDelete(id);
      await deletevideo(id).unwrap();
      toast.success("Video Deleted");
    } catch {
      toast.error("Error in Delete Video");
    }
  }

  if (isLoading) {
    return (
    <div className="bg-white rounded-2xl overflow-hidden border animate-pulse">
      {/* Thumbnail */}
      <div className="h-48 w-full bg-gray-200" />

      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-200 rounded" />

        {/* Description */}
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
  }

  return (
    <>
      <div className="bg-[#F3FFF7] p-6 rounded-2xl w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Video Management</h2>
            <p className="text-gray-500">
              Manage educational and informational videos
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            <Plus size={18} />
            Add Video
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border mb-6">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2 max-w-md">
            <Search size={18} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search Video"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const date = new Date(video.createdAt).toLocaleDateString();
            const ytId = getYouTubeId(video.videoURL);

            return (
              <div
                key={video._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border"
              >
                <div className="relative">
                  {isYouTubeUrl(video.videoURL) && ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      className="h-48 w-full rounded-t-2xl"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={getVideoThumbnail(video.video)}
                        alt="video"
                        className="h-48 w-full object-cover"
                      />
                      {video.video && (
                        <a
                          href={video.video}
                          target="_blank"
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="text-green-600 fill-green-600 ml-1" />
                          </div>
                        </a>
                      )}
                    </>
                  )}

                  <span className="absolute bottom-3 right-3 bg-white text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {date}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {video.videoTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {video.videoDescription}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setopenEditModel(true);
                        setVideoId(video._id);
                      }}
                      className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      onClick={() => DeleteVideo(video._id)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                    >
                      {deleteingvideo && selectedDelete === video._id ? (
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

          {filteredVideos.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No videos found
            </div>
          )}
        </div>
      </div>

      <AddVideoModal isOpen={openModal} onClose={() => setOpenModal(false)} />
      <EditVideoModel
        isOpen={openEditModel}
        onClose={() => setopenEditModel(false)}
        videoId={videoId}
      />
    </>
  );
};

export default VideoManage;