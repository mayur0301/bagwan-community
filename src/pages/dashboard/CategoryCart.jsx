import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Card } from "@mui/material";
//import { useGetAllCategoryQuery } from "../../redux/Admin/AdminApi"; //commented by me
//changed by me
import { useGetDashboardSummaryQuery } from "../../redux/Admin/AdminApi";

/**
 * Generate unique colors using HSL
 */
const generateColor = (index, total) => {
  const hue = Math.round((360 / total) * index);
  return `hsl(${hue}, 70%, 50%)`;
};

const CategoryChart = () => {
  const { data, isLoading } = useGetDashboardSummaryQuery();

  if (isLoading) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: "16px",
          boxShadow: "0 0 0 1px #e5e7eb",
        }}
      >
        {/* Title shimmer */}
        <div className="shimmer h-6 w-48 mb-6 rounded"></div>

        {/* Pie chart shimmer (circle) */}
        <div className="flex justify-center">
          <div className="shimmer h-60 w-60 rounded-full"></div>
        </div>
      </Card>
    );
  }

  //commented by me
  // const categories = data?.data || [];
  // const total = categories.length;

  //Changed by me
  const categories = data?.categoryBreakdown || [];
  const total = categories.length;

  //commented by me
  // const pieData = categories.map((item, index) => ({
  //   id: index,
  //   value: 1, // har category = 1
  //   label: item.categoryName,
  //   color: generateColor(index, total),
  // }));

  //Changed by me
  const pieData = categories.map((item, index) => ({
    id: index,
    value: item.count,
    label: item.category,
    color: generateColor(index, total),
  }));

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: "16px",
        boxShadow: "0 0 0 1px #e5e7eb",
      }}
    >
      <h2 style={{ fontWeight: 600, marginBottom: 20 }}>Support By Category</h2>

      <PieChart
        height={320}
        series={[
          {
            data: pieData,
            innerRadius: 0,
            outerRadius: 120,
            paddingAngle: 2,
            cornerRadius: 6,
          },
        ]}
        slotProps={{
          legend: { hidden: true },
        }}
      />
    </Card>
  );
};

export default CategoryChart;
