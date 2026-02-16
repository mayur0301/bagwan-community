import {useEffect , useState} from "react";
import UserManage from "./UserManage";
import RequestBar from "./RequestBar";
import CategoryChart from "./CategoryCart";
//import { useGetAllUsersQuery } from "../../redux/Admin/AdminApi";                     //commented by me
//changed by me
import { useGetDashboardSummaryQuery } from "../../redux/Admin/AdminApi";

const MainDashBoard = () => {
  
  const { data, isLoading } = useGetDashboardSummaryQuery();
  return (
    <div className="w-full px-4 sm:px-6 ">
      {/* Header */}
      <div className="py-4 sm:py-6">
        <p className="font-bold text-xl sm:text-2xl">Dashboard</p>
        <p className="text-gray-500 font-medium text-sm sm:text-base">
          Overview of your community support platform 
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mt-4 sm:mt-6">
        <UserManage counts={data?.counts} />
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-3 sm:p-4">
          {/* <RequestBar data={data?.data?.map((v) => v.SupportId)} /> Commented by me */}
          {/* Changed by me */}
          <RequestBar data={data?.monthlyRequests} />
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4">
          <CategoryChart />
        </div>
      </div>
    </div>
  );
};

export default MainDashBoard;
