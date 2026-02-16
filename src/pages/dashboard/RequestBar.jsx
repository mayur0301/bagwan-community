import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card } from "@mui/material";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const RequestBar = ({ data = [] }) => {
  // 12 months = 12 slots
  const monthCounts = new Array(12).fill(0);

  // Count requests by month
  //Commented by me
  // data.forEach((item) => {
  //   const date = new Date(item?.createdAt);
  //   const monthIndex = date.getMonth(); // 0 = Jan, 11 = Dec
  //   monthCounts[monthIndex] += 1;
  // });
  //Changed by me
  data.forEach((item) => {
    const monthName = item.month?.split(" ")[0]; // March from "March 2025"
    const monthIndex = MONTHS.findIndex(
      (m) => m.toLowerCase() === monthName?.slice(0, 3).toLowerCase(),
    );
    if (monthIndex >= 0) {
      monthCounts[monthIndex] = item.count;
    }
  });

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: "16px",
        boxShadow: "0 0 0 1px #e5e7eb",
      }}
    >
      <h2 style={{ fontWeight: 600, marginBottom: 16 }}>
        Monthly Support Requests
      </h2>

      <BarChart
        height={320}
        width={500} // ⬅ wider for 12 months
        xAxis={[
          {
            data: MONTHS,
            scaleType: "band",
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: Math.max(...monthCounts, 5), // auto scale
          },
        ]}
        series={[
          {
            data: monthCounts,
            color: "#6BE000",
            borderRadius: 80,
          },
        ]}
        grid={{ horizontal: true }}
        slotProps={{
          legend: { hidden: true },
        }}
      />
    </Card>
  );
};

export default RequestBar;
