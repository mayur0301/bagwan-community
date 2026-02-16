import React from "react";
import { Users, Clock, CheckCircle, Info, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const UserManage = ({ counts }) => {
  //console.log(counts);

  //COmmented by me
  // const stats = [
  //   {
  //     title: "Total Users",
  //     value: counts?.totalUsers,
  //     icon: Users,
  //     iconBg: "bg-blue-500",
  //     percent: "+12.5%",
  //   },
  //   {
  //     title: "Active Requests",
  //     value: counts?.totalApprovedUsers,
  //     icon: Clock,
  //     iconBg: "bg-orange-500",
  //     percent: "+12.5%",
  //   },
  //   {
  //     title: "Approved Today",
  //     value: counts?.todayApprovedUsers,
  //     icon: CheckCircle,
  //     iconBg: "bg-green-500",
  //     percent: "+12.5%",
  //   },
  //   {
  //     title: "Pending Review",
  //     value: counts?.pendingUsers,
  //     icon: Info,
  //     iconBg: "bg-purple-500",
  //     percent: "+12.5%",
  //   },
  // ];
  //Changed by me
  const stats = [
    {
      title: "Total Users",
      value: counts?.totalUsers,
      icon: Users,
      iconBg: "bg-blue-500",
      percent: "+12.5%",
    },
    {
      title: "Active Requests",
      value: counts?.activeRequests,
      icon: Clock,
      iconBg: "bg-orange-500",
      percent: "+12.5%",
    },
    {
      title: "Approved Today",
      value: counts?.approvedToday,
      icon: CheckCircle,
      iconBg: "bg-green-500",
      percent: "+12.5%",
    },
    {
      title: "Pending Review",
      value: counts?.pendingReview,
      icon: Info,
      iconBg: "bg-purple-500",
      percent: "+12.5%",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <Link
            to={"/usermanagement"}
            key={index}
            className="bg-white rounded-2xl p-4 shadow-sm border flex flex-col justify-between"
          >
            {/* Top */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">{item.title}</p>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${item.iconBg}`}
              >
                <Icon size={20} />
              </div>
            </div>

            {/* Value */}
            <p className="text-3xl font-bold text-gray-900 mt-4">
              {item.value}
            </p>

            {/* Bottom */}
            <div className="flex items-center gap-2 text-green-700 mt-4 text-sm font-medium">
              {/* <TrendingUp size={25} /> */}
              {/* {item.percent} */}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default UserManage;
