import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const tabs = [
  "Personal Details",
  "Documents",
  "Qualification",
  "Support Request",
];
import { useUpdateStatusMutation } from "../../redux/Admin/AdminApi";
import { useGetUserByIdQuery } from "../../redux/Admin/AdminApi";
import defaultAvatar from "../../assets/default-avatar.jpg";

const ActionModel = ({ userId, closemodel }) => {
  const [activeTab, setActiveTab] = useState("Personal Details");
  const { data, isLoading } = useGetUserByIdQuery(userId);
  const u = data?.data || {};

  const modalRef = useRef(null);
  const [UpdateStatus, { isLoading: loadingstatus }] =
    useUpdateStatusMutation();

  const [loadinId, setloadinId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closemodel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closemodel]);

  // async function Updatestatus(status) {
  //   try {
  //     const res = await UpdateStatus({ currentStatus: status, id: u._id });
  //     if (res.error) {
  //       toast.error("Error in Update Status");
  //     }
  //     toast.success("Status Changed");
  //   } catch (error) {
  //     toast.error("Error in Update Status");
  //   } finally {
  //     closemodel();
  //   }
  // }
  async function Updatestatus(status) {
    try {
      const res = await UpdateStatus({
        id: u._id,
        currentStatus: status.toLowerCase(),
      });

      if (res.error) {
        toast.error("Error in Update Status");
        return;
      }

      toast.success("Status Changed");
    } catch (error) {
      toast.error("Error in Update Status");
    } finally {
      closemodel();
    }
  }

  // ✅ SKELETON LOADER (ONLY FOR MODAL CONTENT)
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white w-[95%] max-w-5xl rounded-2xl overflow-hidden">
          {/* HEADER SKELETON */}
          <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-400/60 animate-pulse"></div>

              <div className="space-y-2">
                <div className="h-4 w-32 bg-green-400/60 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-green-400/60 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="h-6 w-24 bg-white/40 rounded-full animate-pulse"></div>
          </div>

          {/* TABS SKELETON */}
          <div className="flex gap-3 px-6 py-4 bg-green-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-32 bg-green-200 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* BODY SKELETON */}
          <div className="p-6 bg-green-50 min-h-[320px] grid grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* FOOTER SKELETON */}
          <div className="flex justify-end gap-4 p-6">
            <div className="h-10 w-28 bg-green-300 rounded-full animate-pulse"></div>
            <div className="h-10 w-28 bg-red-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white w-[95%] max-w-5xl rounded-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={u.userProfilePhoto || defaultAvatar}
              alt="profile"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="text-white">
              <h2 className="font-semibold">{u.fullName}</h2>
              <p className="text-sm">+91 {u.contactNo}</p>
            </div>
          </div>

          <span className="bg-white text-green-700 px-4 py-1 rounded-full text-sm font-medium">
            {u.categoryId?.categoryName}
          </span>
        </div>

        {/* TABS */}
        <div className="flex gap-3 px-6 py-4 bg-green-50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-6 bg-green-50 min-h-[320px]">
          {/* PERSONAL DETAILS */}
          {activeTab === "Personal Details" && (
            <div className="grid grid-cols-2 gap-6">
              <Info label="Full Name" value={u.fullName} />
              <Info label="Contact No" value={u.contactNo} />
              <Info label="Email ID" value={u.email} />
              <Info
                label="Date of Birth"
                value={
                  u.dateOfBirth
                    ? new Date(u.dateOfBirth).toLocaleDateString()
                    : "-"
                }
              />
              <Info label="City" value={u.city} />
              <Info label="Caste" value={u.caste} />
            </div>
          )}

          {/* DOCUMENTS */}
          {/* {activeTab === "Documents" && (
            <div className="grid grid-cols-2 gap-6">
              <DocCard name="Aadhaar Card" url={u.aadhaarCard} />
              <DocCard name="OBC Certificate" url={u.otherDocuments?.[0]} />
              <DocCard name="Income Certificate" url={u.otherDocuments?.[1]} />
            </div>
          )} */}
          {activeTab === "Documents" && (
            <div className="grid grid-cols-2 gap-6">
              {u.aadhaarCard && (
                <DocCard name="Aadhaar Card" url={u.aadhaarCard} />
              )}

              {u.otherDocuments?.[0] && (
                <DocCard name="OBC Certificate" url={u.otherDocuments[0]} />
              )}

              {u.otherDocuments?.[1] && (
                <DocCard name="Income Certificate" url={u.otherDocuments[1]} />
              )}
            </div>
          )}

          {/* QUALIFICATION */}
          {activeTab === "Qualification" && (
            <div className="grid grid-cols-2 gap-6">
              <Info
                label="Current Qualification"
                // value={user.CurrentQualification}
                value={"-"}
              />
              <Info label="Field of Study" value={"-"} />
              <Info label="Current Status" value={u.status} />
              <Info label="Institute" value={"-"} />

              <div className="bg-white p-4 rounded-xl flex items-center justify-between col-span-2">
                <span className="font-medium">Marksheet</span>
                {/* <a
                  href={u.marksheets?.[0]}
                  target="_blank"
                  className="bg-green-100 p-2 rounded-full text-green-700"
                >
                  <Eye size={18} />
                </a> */}
                {u.marksheets?.[0] ? (
                  <a
                    href={u.marksheets[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-100 p-2 rounded-full text-green-700"
                  >
                    <Eye size={18} />
                  </a>
                ) : (
                  <div className="bg-red-100 p-2 rounded-full text-red-600 cursor-not-allowed">
                    <X size={18} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUPPORT REQUEST */}
          {activeTab === "Support Request" && (
            <div className="bg-white p-6 rounded-xl">
              <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">
                {u.currentStatus}
              </span>

              <p className="mt-4 text-gray-700">{u.Notes}</p>

              <p className="mt-4 flex items-center gap-2 text-green-700 text-sm">
                <Calendar size={16} />
                Submitted on: {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {u.currentStatus === "pending" && (
          <div className="flex justify-end gap-4 p-6">
            <button
              onClick={() => {
                setloadinId("Approve");
                Updatestatus("approved");
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full"
            >
              {loadingstatus && loadinId === "approved" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle size={18} />
              )}{" "}
              Approve
            </button>
            <button
              onClick={() => {
                setloadinId("Reject");
                Updatestatus("rejected");
              }}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full"
            >
              {loadingstatus && loadinId === "rejected" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <XCircle size={18} />
              )}{" "}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <div className="bg-white rounded-lg px-4 py-3 mt-1 shadow-sm">
      {value || "-"}
    </div>
  </div>
);

const DocCard = ({ name, url }) => (
  <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <div className="bg-green-600 p-2 rounded-lg text-white">
        <FileText size={18} />
      </div>
      <span className="font-medium">{name}</span>
    </div>
    {url && (
      <a
        href={url}
        target="_blank"
        className="bg-green-100 p-2 rounded-full text-green-700"
      >
        <Eye size={18} />
      </a>
    )}
  </div>
);

export default ActionModel;

// function AuthStatus(status) {
//   return status === "Approve" ? false : status === "Reject" ? false : true
// }

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Eye,
//   FileText,
//   CheckCircle,
//   XCircle,
//   Calendar,
//   Loader2,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import { useUpdateStatusMutation } from "../../redux/Admin/AdminApi";

// const tabs = [
//   "Personal Details",
//   "Documents",
//   "Qualification",
//   "Support Request",
// ];

// const ActionModel = ({ user, closemodel }) => {
//   const [activeTab, setActiveTab] = useState("Personal Details");
//   const modalRef = useRef(null);
//   const [UpdateStatus, { isLoading: loadingstatus }] =
//     useUpdateStatusMutation();

//   const [loadinId, setloadinId] = useState(null);

//   // ✅ VERY IMPORTANT — Normalize user shape
//   const u = user?.data?.[0] || user?.data || user || {};

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (modalRef.current && !modalRef.current.contains(e.target)) {
//         closemodel();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [closemodel]);

//   async function Updatestatus(status) {
//     try {
//       const res = await UpdateStatus({ status, id: u._id });
//       if (res.error) toast.error("Error updating status");
//       else toast.success("Status changed");
//     } catch {
//       toast.error("Error updating status");
//     } finally {
//       closemodel();
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//       <div
//         ref={modalRef}
//         className="bg-white w-[95%] max-w-5xl rounded-2xl overflow-hidden"
//       >
//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <img
//               src={u.userProfilePhoto || "/default-avatar.png"}
//               alt=""
//               className="w-14 h-14 rounded-full object-cover"
//             />
//             <div className="text-white">
//               <h2 className="font-semibold">{u.fullName}</h2>
//               <p className="text-sm">+91 {u.contactNo}</p>
//             </div>
//           </div>

//           <span className="bg-white text-green-700 px-4 py-1 rounded-full text-sm font-medium">
//             {u.categoryId?.categoryName}
//           </span>
//         </div>

//         {/* TABS */}
//         <div className="flex gap-3 px-6 py-4 bg-green-50">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium ${
//                 activeTab === tab
//                   ? "bg-green-600 text-white"
//                   : "bg-green-100 text-green-700"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* CONTENT */}
//         <div className="p-6 bg-green-50 min-h-[320px]">
//           {/* PERSONAL */}
//           {activeTab === "Personal Details" && (
//             <div className="grid grid-cols-2 gap-6">
//               <Info label="Full Name" value={u.fullName} />
//               <Info label="Contact No" value={u.contactNo} />
//               <Info label="Email ID" value={u.email} />
//               <Info
//                 label="Date of Birth"
//                 value={
//                   u.dateOfBirth
//                     ? new Date(u.dateOfBirth).toLocaleDateString("en-IN")
//                     : "-"
//                 }
//               />
//               <Info label="City" value={u.city} />
//               <Info label="Caste" value={u.caste} />
//             </div>
//           )}

//           {/* DOCUMENTS */}
//           {activeTab === "Documents" && (
//             <div className="grid grid-cols-2 gap-6">
//               <DocCard name="Aadhaar Card" url={u.aadhaarCard} />
//               <DocCard name="Other Document 1" url={u.otherDocuments?.[0]} />
//               <DocCard name="Other Document 2" url={u.otherDocuments?.[1]} />
//             </div>
//           )}

//           {/* QUALIFICATION */}
//           {activeTab === "Qualification" && (
//             <div className="grid grid-cols-2 gap-6">
//               <Info label="Current Qualification" value={u.status} />
//               <Info label="Field of Study" value="-" />
//               <Info label="Institute" value="-" />

//               <div className="bg-white p-4 rounded-xl flex items-center justify-between col-span-2">
//                 <span className="font-medium">Marksheet</span>
//                 {u.marksheets?.[0] ? (
//                   <a
//                     href={u.marksheets[0]}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-green-100 p-2 rounded-full text-green-700"
//                   >
//                     <Eye size={18} />
//                   </a>
//                 ) : (
//                   "-"
//                 )}
//               </div>
//             </div>
//           )}

//           {/* SUPPORT */}
//           {activeTab === "Support Request" && (
//             <div className="bg-white p-6 rounded-xl">
//               <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">
//                 {u.currentStatus}
//               </span>

//               <p className="mt-4 flex items-center gap-2 text-green-700 text-sm">
//                 <Calendar size={16} />
//                 Submitted on:{" "}
//                 {u.createdAt
//                   ? new Date(u.createdAt).toLocaleDateString("en-IN")
//                   : "-"}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* FOOTER */}
//         {u.currentStatus === "pending" && (
//           <div className="flex justify-end gap-4 p-6">
//             <button
//               onClick={() => {
//                 Updatestatus("Approve");
//                 setloadinId("Approve");
//               }}
//               className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full"
//             >
//               {loadingstatus && loadinId === "Approve" ? (
//                 <Loader2 size={18} className="animate-spin" />
//               ) : (
//                 <CheckCircle size={18} />
//               )}
//               Approve
//             </button>

//             <button
//               onClick={() => {
//                 Updatestatus("Rejected");
//                 setloadinId("Reject");
//               }}
//               className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full"
//             >
//               {loadingstatus && loadinId === "Reject" ? (
//                 <Loader2 size={18} className="animate-spin" />
//               ) : (
//                 <XCircle size={18} />
//               )}
//               Reject
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const Info = ({ label, value }) => (
//   <div>
//     <label className="text-sm text-gray-600">{label}</label>
//     <div className="bg-white rounded-lg px-4 py-3 mt-1 shadow-sm">
//       {value || "-"}
//     </div>
//   </div>
// );

// const DocCard = ({ name, url }) => (
//   <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
//     <div className="flex items-center gap-3">
//       <div className="bg-green-600 p-2 rounded-lg text-white">
//         <FileText size={18} />
//       </div>
//       <span className="font-medium">{name}</span>
//     </div>

//     {url ? (
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="bg-green-100 p-2 rounded-full text-green-700"
//       >
//         <Eye size={18} />
//       </a>
//     ) : (
//       "-"
//     )}
//   </div>
// );

// export default ActionModel;
