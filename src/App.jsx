// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import SideBar from "./components/SideBar";
// import MainDashBoard from "./pages/dashboard/MainDashBoard";
// import UserManage from "./pages/usermanagement/usermanage";
// import Request from "./pages/requests/request";
// import VideoManage from "./pages/videosmanagement/VideoManage";
// import UpdatesNews from "./pages/updatesnews/UpdatesNews";
// import SupportCategories from "./pages/supportcategories/SupportCategories";
// import Messaging from "./pages/bulkmessaging/Messaging";
// import Login from "./components/loginModel";
// import Protected from "./components/Protected";
// const App = () => {
//   return (
//     <div className="flex bg-[#F3FFF7] ">
//       <SideBar />
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Protected>
//               <MainDashBoard />
//             </Protected>
//           }
//         />
//         <Route path="/login" element={<Login />} />
//         <Route path="/usermanagement" element={<UserManage />} />
//         <Route path="/supportrequests" element={<Request />} />
//         <Route path="/videosmanagement" element={<VideoManage />} />
//         <Route path="/updatesnews" element={<UpdatesNews />} />
//         <Route path="/supportcategories" element={<SupportCategories />} />
//         <Route path="/bulkmessaging" element={<Messaging />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;



import { Routes, Route, Navigate } from "react-router-dom";

import MainDashBoard from "./pages/dashboard/MainDashBoard";
import UserManage from "./pages/usermanagement/usermanage";
import Request from "./pages/requests/request";
import VideoManage from "./pages/videosmanagement/VideoManage";
import UpdatesNews from "./pages/updatesnews/UpdatesNews";
import SupportCategories from "./pages/supportcategories/SupportCategories";
import Messaging from "./pages/bulkmessaging/Messaging";
import Login from "./components/loginModel";
import DonationSupport from "./pages/donationSupport/DonationSupport";
import ProtectedRoute from "./components/Protected";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

const App = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<MainDashBoard />} />
        <Route path="/usermanagement" element={<UserManage />} />
        <Route path="/supportrequests" element={<Request />} />
        <Route path="/donationsupport" element={<DonationSupport />} />
        <Route path="/videosmanagement" element={<VideoManage />} />
        <Route path="/updatesnews" element={<UpdatesNews />} />
        <Route path="/supportcategories" element={<SupportCategories />} />
        <Route path="/bulkmessaging" element={<Messaging />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
